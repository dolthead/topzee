import { Injectable } from '@angular/core';
import { Die } from '../models/die.model';

@Injectable({
  providedIn: 'root'
})
export class DiceService {
  constructor() {}

  newDice = (): Die[] => [
      <Die>{ pips: 0, locked: false },
      <Die>{ pips: 0, locked: false },
      <Die>{ pips: 0, locked: false },
      <Die>{ pips: 0, locked: false },
      <Die>{ pips: 0, locked: false }
    ];

  getDice = ([d1, d2, d3, d4, d5]: number[]): Die[] => [
      <Die>{ pips: d1, locked: false },
      <Die>{ pips: d2, locked: false },
      <Die>{ pips: d3, locked: false },
      <Die>{ pips: d4, locked: false },
      <Die>{ pips: d5, locked: false },
    ];
    
}
