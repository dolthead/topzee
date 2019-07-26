import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Game } from '../models/game.model';
import { Die } from '../models/die.model';
import { GameStats } from '../models/gameStats.model';
import { CategoryService } from './category.service';
import { DiceService } from './dice.service';

const GAME_DATA = 'GAME_DATA'; // local storage key for current game state
const HISTORY_DATA = 'HISTORY_DATA'; // local storage key for user stats
const MIN_FOR_BONUS = 60;
const BONUS = 50;
const OAK5_SCORE = 50;

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public game: Game;
  public lifetimeStats: GameStats = {
    lastGame: undefined,
    completedGameCount: 0,
    highScore: 0,
    totalScore: 0,
    averageScore: 0.0
  };

  constructor(
    public storage: Storage,
    public categoryService: CategoryService,
    public diceService: DiceService
  ) {
    this.loadData();
  }

  /**
   * load game data and user stats from storage
   */
  async loadData() {
    await this.storage
      .get(GAME_DATA)
      .then(
        data => (this.game = data ? <Game>JSON.parse(data) : undefined),
        error => console.log("game read error", error)
      );
    await this.storage
      .get(HISTORY_DATA)
      .then(
        data =>
          (this.lifetimeStats = data ? JSON.parse(data) : this.lifetimeStats),
        error => console.log("lifetime read error", error)
      );
  }

  newGame():Game {
      return <Game>{
        playing: true,
        turnsLeft: 13,
        rollsLeft: 3,
        dice: <[Die]>this.diceService.newDice(),
        category: undefined, // where to put the score, selected by user
        categories: this.categoryService.newCategories(),
        subtotalLeft: 0,
        subtotalRight: 0,
        total: 0,
        extraOak5Count: 0
      };
  };

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
   * calculate the score for the input category
   * @param catName name of tapped category
   * @returns score for selected scoring category
   */
  public getScore(catName): number {
    switch (catName) {
      case "Ones":
        return this.getPipsCount(1);
      case "Twos":
        return this.getPipsCount(2) * 2;
      case "Threes":
        return this.getPipsCount(3) * 3;
      case "Fours":
        return this.getPipsCount(4) * 4;
      case "Fives":
        return this.getPipsCount(5) * 5;
      case "Sixes":
        return this.getPipsCount(6) * 6;

      case "3 Oak":
        return this.getOAKScore(3);
      case "4 Oak":
        return this.getOAKScore(4);
      case "Full House":
        return this.get23OAKScore();
      case "4 Straight":
        return this.get4StraightScore();
      case "5 Straight":
        return this.get5StraightScore();
      case "5 Oak":
        return this.getOAKScore(5) > 0 ? OAK5_SCORE : 0;
      case "Any":
        return this.getDiceTotal();

      default:
        return 0;
    }
  }

  /**
   * @returns true if all 5 dice are the same AND the 5OAK has already been scored
   */
  public alreadyHas5Oak(): boolean {
    return (
      this.game.category !== "5 Oak" &&
      this.getCat("5 Oak") &&
      this.getCat("5 Oak").score === OAK5_SCORE
    );
  }

  /**
   * process totals, start new turn (or end game), and store game state
   */
  public async save() {
    // count extra 5OAKs for bonus calculation
    if (this.alreadyHas5Oak() && this.getOAKScore(5)) {
      this.game.extraOak5Count++;
    }
    this.game.category = undefined;
    await this.calcTotals();

    this.game.rollsLeft = 3;
    this.game.dice = <[Die]>this.diceService.newDice();
    this.game.turnsLeft--;
    if (!this.game.turnsLeft) {
      this.gameOver();
    }
    await this.storeGame();
  }

  /**
   * calculate and set subtotals and total
   */
  public async calcTotals() {
    this.game.subtotalLeft = this.game.categories
      .slice(0, 6)
      .reduce((total, cat) => total + (cat.score || 0), 0);
    const bonus = this.game.categories.find(cat => cat.name === "Bonus");
    if (this.game.subtotalLeft >= MIN_FOR_BONUS) {
      bonus.score = BONUS;
      this.game.subtotalLeft += BONUS;
    }

    this.game.subtotalRight = this.game.categories
      .slice(7)
      .reduce((total, cat) => total + (cat.score || 0), 0);

    this.game.total =
      this.game.subtotalLeft +
      this.game.subtotalRight +
      this.game.extraOak5Count * OAK5_SCORE;
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
    if (
      catName !== "Bonus" &&
      catName !== this.game.category &&
      this.game.dice[0].pips > 0
    ) {
      const cat = this.getCat(catName);
      this.clearSelectedCategory();
      if (cat.score === undefined) {
        this.game.category = catName;
        points = this.getScore(catName);
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

    return await this.storage.set(
      HISTORY_DATA,
      JSON.stringify(this.lifetimeStats)
    );
  }

  async storeGame() {
    return await this.storage.set(GAME_DATA, JSON.stringify(this.game));
  }

  setCatScore(catName, score) {
    this.game.categories.find(c => c.name === catName).score = score;
  }

  getCat(catName) {
    return catName
      ? this.game.categories.find(c => c.name === catName)
      : catName;
  }

  /**
   * get "of a kind" score
   * returns sum of dice if input count of matching dice is met
   * when dice are {5,5,5,5,1}, returns 21 for howManyOAK(3) or howManyOAK(4)
   * when dice are {5,5,4,4,2}, returns 0 for howManyOAK(3) or howManyOAK(4)
   *
   * @param howManyOAK number of highest recurring pip value
   * @returns number true if there are at least howManyOAK of a pip value
   */
  getOAKScore(howManyOAK): number {
    const mode = this.getMode(this.game.dice);
    return this.getPipsCount(mode) >= howManyOAK ? this.getDiceTotal() : 0;
  }

  /**
   * return 25 if dice make a full house
   * @returns number 0 if no full house, 25 if dice make a full house
   */
  get23OAKScore(): number {
    const value = 25;
    if (this.getOAKScore(5) > 0) {
      return value;
    }
    if (this.getOAKScore(3) === 0) {
      return 0;
    }
    const mode = this.getMode(this.game.dice);
    const notMode = this.game.dice.filter(die => die.pips !== mode);
    return notMode.length === 2 && notMode[0].pips === notMode[1].pips
      ? value
      : 0;
  }

  /**
   * return 30 if dice include 4 in a row
   * @returns number 0 if less than 4 in a row, 30 if 4 or more in a row
   */
  get4StraightScore(): number {
    let value = 30;
    let sorted = [...this.game.dice].sort((a, b) => a.pips - b.pips);
    sorted = sorted.reduce((accumulator, current) => {
      const length = accumulator.length;
      if (length === 0 || accumulator[length - 1].pips !== current.pips) {
        accumulator.push(current);
      }
      return accumulator;
    }, []);
    if (sorted.length < 4) {
      // four unique numbers is required
      return 0;
    } else if (sorted.length === 5) {
      if (sorted[0].pips + 1 !== sorted[1].pips) {
        // if gap is at start, remove first item (1, 3, 4, 5, 6)
        sorted.shift();
      } else {
        sorted.pop();
      }
    }
    sorted.forEach((die, d, thisArray) => {
      // see if first 3 have their successor successing
      if (d < 3 && die.pips + 1 !== thisArray[d + 1].pips) {
        value = 0;
      }
    });
    return value;
  }

  /**
   * return 40 if dice include 5 in a row
   * @returns number 0 if not 5 in a row, 40 if 5 in a row
   */
  get5StraightScore(): number {
    const value = 40;
    const sorted = [...this.game.dice].sort((a, b) => a.pips - b.pips);
    return sorted[0].pips + 1 === sorted[1].pips &&
      sorted[1].pips + 1 === sorted[2].pips &&
      sorted[2].pips + 1 === sorted[3].pips &&
      sorted[3].pips + 1 === sorted[4].pips
      ? value
      : 0;
  }

  /**
   * find the highest occurring die value
   * @param myArray array of dice { pips: number on dice }
   * @returns number on dice of highest mode
   */
  getMode(myArray): number {
    return myArray.reduce(
      (a: number, b: any, i: number, arr: any[]) =>
        arr.filter(v => v.pips === a).length >=
        arr.filter(v => v.pips === b.pips).length
          ? a
          : b.pips,
      null
    );
  }

  /**
   * sum the pips on all of the dice
   */
  getDiceTotal(): number {
    return this.game.dice.reduce((total, die) => total + (die.pips || 0), 0);
  }

  /**
   * how many dice have the input value
   * @param pips number on dice to count
   * @returns count of dice (0-5) having input value
   */
  getPipsCount(pips): number {
    return this.game.dice.filter(die => die.pips === pips).length;
  }
}
