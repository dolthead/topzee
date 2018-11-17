import {Component} from '@angular/core';
import {GameService} from '../services/game.service';

@Component({
    selector: 'app-game-screen',
    templateUrl: './game-screen.page.html',
    styleUrls: ['./game-screen.page.scss'],
})
export class GameScreenPage {

    unlockedCount: number = 5;
    rollLabel: String;

    constructor(public gameService: GameService) {
    }

    ionViewWillEnter() {
        this.setRollLabel();
    }

    roll() {
        if (this.gameService.game.rollsLeft) {
            this.clearSelectedCategory();
            this.gameService.game.dice.filter(die => !die.locked)
                .forEach(die => die.pips = Math.ceil(Math.random() * 6 ));
            this.gameService.game.rollsLeft--;
            this.setRollLabel();
        }
    }

    setRollLabel() {
        this.unlockedCount = this.gameService.game.dice.filter((d) => !d.locked).length;
        this.rollLabel = !this.gameService.game.turnsLeft
                ? `Game over`
                : this.gameService.game.rollsLeft
                ? `Roll ${ this.unlockedCount } ${ this.unlockedCount > 1 ? 'dice' : 'die' }`
                : `No rolls left`;
    }

    clearSelectedCategory() {
        this.gameService.clearSelectedCategory();
    }

    setSelectedCategory(catName) {
        this.gameService.setSelectedCategory(catName);
    }

    save() {
        this.gameService.save();
        this.setRollLabel();
    }

    reset() {
        this.gameService.resetGame();
        this.setRollLabel();
    }

}
