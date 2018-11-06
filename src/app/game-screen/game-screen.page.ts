import {Component} from '@angular/core';
import {GameService} from '../services/game.service';

@Component({
    selector: 'app-game-screen',
    templateUrl: './game-screen.page.html',
    styleUrls: ['./game-screen.page.scss'],
})
export class GameScreenPage {

    constructor(public gameService: GameService) {
    }

    ionViewWillEnter() {
    }

    unlockedCount() {
        return this.gameService.game.dice.filter((d) => !d.locked).length;
    }

    roll() {
        if (this.gameService.game.rollsLeft) {
            this.setSelectedCategory(undefined);
            this.gameService.game.dice.filter(die => !die.locked)
                .forEach(die => die.pips = Math.ceil(Math.random() * 6 ));
            this.gameService.game.rollsLeft--;
        }
    }

    setSelectedCategory(catName) {
        this.gameService.setSelectedCategory(catName);
    }

    save() {
        this.gameService.save();
    }

    reset() {
        this.gameService.resetGame();
    }

}
