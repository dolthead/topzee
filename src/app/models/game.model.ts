import { Die } from './die.model';

export interface Game {
    playing: Boolean;
    turnsLeft: number;
    rollsLeft: number;
    dice: Die[];
    category: undefined;
    categories: any;
    subtotalLeft: number;
    subtotalRight: number;
    total: number;
    extraOak5Count: number;
}
