import { Component, OnInit, Input } from '@angular/core';
import { Die } from '../models/die.model';

@Component({
  selector: 'app-dice-row',
  templateUrl: './dice-row.component.html',
  styleUrls: ['./dice-row.component.scss']
})
export class DiceRowComponent implements OnInit {

  @Input() diceValues: number[];
  @Input() points: number;

  constructor() { }

  ngOnInit() {
  }

}
