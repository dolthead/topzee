import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Game } from '../models/game.model';
import { Die } from '../models/die.model';
import { GameStats } from '../models/gameStats.model';
import { CategoryService } from './category.service';
import { DiceService } from './dice.service';
import { ScoringService } from './scoring.service';

const GAME_DATA = 'GAME_DATA'; // local storage key for current game state
const HISTORY_DATA = 'HISTORY_DATA'; // local storage key for user stats

@Injectable({
    providedIn: 'root',
})
export class GameService {
    public game: Game;
    public lifetimeStats: GameStats = {
        lastGame: undefined,
        completedGameCount: 0,
        highScore: 0,
        totalScore: 0,
        averageScore: 0.0,
    };

    constructor(
        public storage: Storage,
        public categoryService: CategoryService,
        public diceService: DiceService,
        public scoringService: ScoringService
    ) {
        this.loadData();
    }

    /**
     * load game data and user stats from storage
     */
    async loadData() {
        await this.storage.get(GAME_DATA).then(
            data => (this.game = data ? <Game>JSON.parse(data) : undefined),
            error => console.log('game read error', error)
        );
        return await this.storage.get(HISTORY_DATA).then(
            data => (this.lifetimeStats = data ? JSON.parse(data) : this.lifetimeStats),
            error => console.log('lifetime read error', error)
        );
    }

    newGame(): Game {
        return <Game>{
            playing: true,
            turnsLeft: 13,
            rollsLeft: 3,
            dice: this.diceService.newDice(),
            category: undefined, // where to put the score, selected by user
            categories: this.categoryService.newCategories(),
            subtotalLeft: 0,
            subtotalRight: 0,
            total: 0,
            extraOak5Count: 0,
            newBonus: false,
        };
    }

    /**
     * replace current game state with new game state
     */
    public resetGame() {
        this.game = <Game>{ ...this.newGame() };
        this.game.dice.forEach(die => {
            die.pips = 0;
            die.locked = false;
        });
        this.game.categories.forEach(cat => (cat.score = undefined));
        return this.storeGame();
    }

    /**
     * @returns true if all 5 dice are the same AND the 5OAK has already been scored
     */
    public alreadyHas5Oak(): boolean {
        return (
            this.game.category !== '5 Oak' &&
            this.getCat('5 Oak') &&
            this.getCat('5 Oak').score === this.scoringService.OAK5_SCORE
        );
    }

    /**
     * process totals, start new turn (or end game), and store game state
     */
    public async save() {
        // count extra 5OAKs for bonus calculation
        if (this.alreadyHas5Oak() && this.scoringService.getOAKScore(this.game.dice, 5)) {
            this.game.extraOak5Count++;
        }
        this.game.category = undefined;
        await this.calcTotals();

        this.game.rollsLeft = 3;
        this.game.dice = this.diceService.newDice();
        this.game.turnsLeft--;
        if (!this.game.turnsLeft) {
            this.gameOver();
        }
        return await this.storeGame();
    }

    /**
     * calculate and set subtotals and total
     */
    public calcTotals() {
        this.game.subtotalLeft = this.game.categories.slice(0, 6).reduce((total, cat) => total + (cat.score || 0), 0);
        const bonus = this.game.categories.find(cat => cat.name === 'Bonus');
        if (this.game.subtotalLeft >= this.scoringService.MIN_FOR_BONUS) {
            bonus.score = this.scoringService.BONUS;
            this.game.subtotalLeft += this.scoringService.BONUS;
            this.game.newBonus = true;
        }

        this.game.subtotalRight = this.game.categories.slice(7).reduce((total, cat) => total + (cat.score || 0), 0);

        this.game.total =
            this.game.subtotalLeft +
            this.game.subtotalRight +
            this.game.extraOak5Count * this.scoringService.OAK5_SCORE;
    }

    /**
     * remove score from selected category (not saved yet)
     */
    public clearSelectedCategory() {
        if (this.game.category) {
            this.setCatScore(this.game.category, undefined); // blank out score in category
            this.game.category = undefined; // clear selected category name
        }
    }

    /**
     * set score for category tapped by user
     * @param catName name of scoring category to check and score
     */
    public setSelectedCategory(catName): number {
        let points = 0;
        if (catName !== 'Bonus' && catName !== this.game.category && this.game.dice[0].pips > 0) {
            const cat = this.getCat(catName);
            this.clearSelectedCategory();
            if (cat.score === undefined) {
                this.game.category = catName;
                points = this.scoringService.getScore(this.game.dice, catName);
                this.setCatScore(catName, points);
            }
        }
        return points;
    }

    /**
     * calculate and update user stats
     */
    async gameOver() {
        this.lifetimeStats.lastGame = this.game.total;
        if (this.game.total > this.lifetimeStats.highScore) {
            this.lifetimeStats.highScore = this.game.total;
        }
        this.lifetimeStats.completedGameCount++;
        this.lifetimeStats.totalScore += this.game.total;
        this.lifetimeStats.averageScore =
            this.lifetimeStats.completedGameCount > 0
                ? this.lifetimeStats.totalScore / this.lifetimeStats.completedGameCount
                : 0.0;
        this.game.playing = false;

        return await this.storage.set(HISTORY_DATA, JSON.stringify(this.lifetimeStats));
    }

    async storeGame() {
        return await this.storage.set(GAME_DATA, JSON.stringify(this.game));
    }

    setCatScore(catName, score) {
        this.game.categories.find(c => c.name === catName).score = score;
    }

    getCat(catName) {
        return catName ? this.game.categories.find(c => c.name === catName) : catName;
    }
}
