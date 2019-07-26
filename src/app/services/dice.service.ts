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
}
