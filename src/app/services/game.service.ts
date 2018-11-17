import {Injectable, OnInit} from '@angular/core';
import {NativeStorage} from '@ionic-native/native-storage/ngx';

const newDice = () => JSON.parse(JSON.stringify([
    { pips: 0, locked: false },
    { pips: 0, locked: false },
    { pips: 0, locked: false },
    { pips: 0, locked: false },
    { pips: 0, locked: false }
]));
const newCategories = () => JSON.parse(JSON.stringify([
    { name: 'Ones', score: undefined },
    { name: 'Twos', score: undefined },
    { name: 'Threes', score: undefined },
    { name: 'Fours', score: undefined },
    { name: 'Fives', score: undefined },
    { name: 'Sixes', score: undefined },
    { name: 'Bonus', score: undefined },
    { name: '3 Oak', score: undefined },
    { name: '4 Oak', score: undefined },
    { name: '2+3 Oak', score: undefined },
    { name: '4 Str', score: undefined },
    { name: '5 Str', score: undefined },
    { name: '5 Oak', score: undefined },
    { name: 'Any', score: undefined }
]));
const newGame: any = {
    playing: true,
    turnsLeft: 13,
    rollsLeft: 3,
    dice: newDice(),
    category: undefined, // where to put the score, selected by user
    categories: newCategories(),
    subtotalLeft: 0,
    subtotalRight: 0,
    total: 0
};
const GAME_DATA = 'GAME_DATA';
const MIN_FOR_BONUS = 63;
const BONUS = 50;

@Injectable({
    providedIn: 'root'
})
export class GameService implements OnInit {

    public game: any;

    constructor(private nativeStorage: NativeStorage) {
    }

    ngOnInit() {
        this.nativeStorage.getItem(GAME_DATA)
            .then(data => this.game = data,
                error => console.log('storage error', error));
    }

    public resetGame() {
        this.game = { ...newGame };
        this.game.dice.forEach((die) => {
            die.pips = 0;
            die.locked = false;
        });
        this.game.categories.forEach((cat) => cat.score = undefined);
        return this.nativeStorage.setItem(GAME_DATA, this.game);
    }

    public getScore (catName) {
        switch (catName) {
            case 'Ones':
                return this.getPipsCount(1);
            case 'Twos':
                return this.getPipsCount(2) * 2;
            case 'Threes':
                return this.getPipsCount(3) * 3;
            case 'Fours':
                return this.getPipsCount(4) * 4;
            case 'Fives':
                return this.getPipsCount(5) * 5;
            case 'Sixes':
                return this.getPipsCount(6) * 6;

            case '3 Oak':
                return this.getOAKScore(3);
            case '4 Oak':
                return this.getOAKScore(4);
            case '2+3 Oak':
                return this.get23OAKScore();
            case '4 Str':
                return this.get4StraightScore();
            case '5 Str':
                return this.get5StraightScore();
            case '5 Oak':
                return this.getOAKScore(5) > 0 ? 50 : 0;
            case 'Any':
                return this.getDiceTotal();

            default:
                return 0;
        }
    }

    public save() {
        this.game.category = undefined;
        this.game.subtotalLeft = this.game.categories.slice(0, 6)
            .reduce((total, cat) => total + (cat.score || 0), 0);
        const bonus = this.game.categories.find(cat => cat.name === 'Bonus');
        if (this.game.subtotalLeft >= MIN_FOR_BONUS) {
            bonus.score = BONUS;
            this.game.subtotalLeft += BONUS;
        }
        this.game.subtotalRight = this.game.categories.slice(7)
            .reduce((total, cat) => total + (cat.score || 0), 0);
        this.game.total = this.game.subtotalLeft + this.game.subtotalRight;

        this.game.rollsLeft = 3;
        this.game.dice = newDice();
        this.game.turnsLeft--;
    }

    public clearSelectedCategory() {
        if (this.game.category) {
            this.setCatScore(this.game.category, undefined);
            this.game.category = undefined;
        }
    }

    public setSelectedCategory(catName) {
        if (catName !== 'Bonus'
                && catName !== this.game.category
                && this.game.dice[0].pips > 0) {
            const cat = this.getCat(catName);
            this.clearSelectedCategory();
            if (cat.score === undefined) {
                this.game.category = catName;
                this.setCatScore(catName, this.getScore(catName));
            }
        }
    }

    setCatScore(catName, score) {
        this.game.categories.find(c => c.name === catName).score = score;
    }

    getCat(catName) {
        return catName ? this.game.categories.find(c => c.name === catName) : catName;
    }

    getOAKScore(howManyOAK) {
        const mode = this.getMode(this.game.dice);
        return (this.getPipsCount(mode) >= howManyOAK ? this.getDiceTotal() : 0);
    }

    get23OAKScore() {
        const value = 25;
        if (this.getOAKScore(5) > 0) { return value; }
        if (this.getOAKScore(3) === 0) { return 0; }
        const mode = this.getMode(this.game.dice);
        const notMode = this.game.dice.filter(die => die.pips !== mode);
        return notMode.length === 2 && notMode[0].pips === notMode[1].pips ? value : 0;
    }

    get4StraightScore() {
        let value = 30;
        let sorted = this.game.dice.concat().sort((a, b) => a.pips - b.pips);
        sorted = sorted.reduce((accumulator, current) => {
            const length = accumulator.length;
            if (length === 0 || accumulator[length - 1].pips !== current.pips) {
                accumulator.push(current);
            }
            return accumulator;
        }, []);
        if (sorted.length < 4) { // four unique numbers is required
            return 0;
        } else if (sorted.length === 5) {
            if (sorted[0].pips + 1 !== sorted[1].pips) { // if gap is at start, remove first item (1, 3, 4, 5, 6)
                sorted.shift();
            } else {
                sorted.pop();
            }
        }
        sorted.forEach((die, d, thisArray) => { // see if first 3 have their successor successing
            if (d < 3 && ((die.pips + 1) !== thisArray[d + 1].pips)) { value = 0; }
        });
        return value;
    }

    get5StraightScore() {
        const value = 40;
        const sorted = this.game.dice.concat().sort((a, b) => a.pips - b.pips);
        return sorted[0].pips + 1 === sorted[1].pips
                && sorted[1].pips + 1 === sorted[2].pips
                && sorted[2].pips + 1 === sorted[3].pips
                && sorted[3].pips + 1 === sorted[4].pips
            ? value : 0;
    }

    getMode(myArray) {
        return myArray.reduce((a, b, i, arr) =>
                (arr.filter(v => v.pips === a).length >= arr.filter(v => v.pips === b.pips).length ? a : b.pips),
            null);
    }

    getDiceTotal() {
        return this.game.dice.reduce((total, die) => total + (die.pips || 0), 0);
    }

    getPipsCount(pips) {
        return this.game.dice.filter(die => (die.pips === pips)).length;
    }

}
