import { Injectable } from '@angular/core';
import { Die } from '../models/die.model';

@Injectable({
  providedIn: 'root'
})
export class ScoringService {

  constructor() { }

  MIN_FOR_BONUS = 60;
  BONUS = 50;
  OAK5_SCORE = 50;

  /**
   * calculate the score for the input category
   * @param catName name of tapped category
   * @returns score for selected scoring category
   */
  public getScore(dice: Die[], catName: string): number {
    switch (catName) {
      case "Ones":
        return this.getPipsCount(dice, 1);
      case "Twos":
        return this.getPipsCount(dice, 2) * 2;
      case "Threes":
        return this.getPipsCount(dice, 3) * 3;
      case "Fours":
        return this.getPipsCount(dice, 4) * 4;
      case "Fives":
        return this.getPipsCount(dice, 5) * 5;
      case "Sixes":
        return this.getPipsCount(dice, 6) * 6;

      case "3 Oak":
        return this.getOAKScore(dice, 3);
      case "4 Oak":
        return this.getOAKScore(dice, 4);
      case "Full House":
        return this.get23OAKScore(dice);
      case "4 Straight":
        return this.get4StraightScore(dice);
      case "5 Straight":
        return this.get5StraightScore(dice);
      case "5 Oak":
        return this.getOAKScore(dice, 5) > 0 ? this.OAK5_SCORE : 0;
      case "Any":
        return this.getDiceTotal(dice);

      default:
        return 0;
    }
  }

  /**
   * sum the pips on all of the dice
   */
  getDiceTotal(dice: Die[]): number {
    return dice.reduce((total, die) => total + (die.pips || 0), 0);
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
  getOAKScore(dice: Die[], howManyOAK: number): number {
    const mode = this.getMode(dice);
    return this.getPipsCount(dice, mode) >= howManyOAK ? this.getDiceTotal(dice) : 0;
  }

  /**
   * return 25 if dice make a full house
   * @returns number 0 if no full house, 25 if dice make a full house
   */
  get23OAKScore(dice: Die[]): number {
    const value = 25;
    if (this.getOAKScore(dice, 5) > 0) {
      return value;
    }
    if (this.getOAKScore(dice, 3) === 0) {
      return 0;
    }
    const mode = this.getMode(dice);
    const notMode = dice.filter(die => die.pips !== mode);
    return notMode.length === 2 && notMode[0].pips === notMode[1].pips
      ? value
      : 0;
  }

  /**
   * return 30 if dice include 4 in a row
   * @returns number 0 if less than 4 in a row, 30 if 4 or more in a row
   */
  get4StraightScore(dice: Die[]): number {
    let value = 30;
    let sorted: Die[] = [...dice].sort((a, b) => a.pips - b.pips);
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
  get5StraightScore(dice: Die[]): number {
    const value = 40;
    const sorted = [...dice].sort((a, b) => a.pips - b.pips);
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
  getMode(dice: Die[]): number {
    return dice.reduce(
      (a: number, b: any, i: number, arr: any[]) =>
        arr.filter(v => v.pips === a).length >=
        arr.filter(v => v.pips === b.pips).length
          ? a
          : b.pips,
      null
    );
  }

  /**
   * how many dice have the input value
   * @param pips number on dice to count
   * @returns count of dice (0-5) having input value
   */
  getPipsCount(dice: Die[], pips: number): number {
    return dice.filter(die => die.pips === pips).length;
  }

}
