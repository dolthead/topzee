import {Component} from '@angular/core';
import {GameService} from '../services/game.service';
import {Router} from '@angular/router';
import {AlertController} from '@ionic/angular';

@Component({
    selector: 'app-game-screen',
    templateUrl: './game-screen.page.html',
    styleUrls: ['./game-screen.page.scss'],
})
export class GameScreenPage {

    unlockedCount: number = 5;
    rollLabel: String;

    constructor(private router: Router, public gameService: GameService,
                public alertController: AlertController) {
    }

    ionViewDidEnter() {
        this.setRollLabel();
    }

    async roll() {
        // this.gameService.game.categories.forEach(cat => cat.name !== 'Any' ? cat.score = 5 : 0);
        // this.gameService.game.turnsLeft = this.gameService.game.rollsLeft = 1;
        // await this.gameService.calcTotals();
        // this.gameService.gameOver();
        // await this.gameOver();
        // return;

        if (this.gameService.game.rollsLeft) {
            this.gameService.clearSelectedCategory();
            this.gameService.game.dice.filter(die => !die.locked)
                .forEach(die => die.pips = Math.ceil(Math.random() * 6 ));
            this.gameService.game.rollsLeft--;
            this.setRollLabel();
        }
        this.gameService.storeGame();
    }

    dieClick(i) {
        this.gameService.game.dice[i].locked = !this.gameService.game.dice[i].locked;
        this.setRollLabel();
    }

    setRollLabel() {
        this.unlockedCount = this.gameService.game.dice.filter((d) => !d.locked).length;
        this.rollLabel = !this.gameService.game.turnsLeft
                ? `Game over`
                : this.gameService.game.rollsLeft
                ? `Roll ${ this.unlockedCount } ${ this.unlockedCount > 1 ? 'dice' : 'die' }`
                : `No rolls left`;
    }

    setSelectedCategory(catName) {
        this.gameService.setSelectedCategory(catName);
    }

    async save() {
        await this.gameService.save();
        if (this.gameService.game) {
            this.setRollLabel();
        } else {
            this.gameService.gameOver();
            await this.gameOver();
        }
    }

    reset() {
        this.gameService.resetGame();
        this.setRollLabel();
    }

    goHome() {
        this.router.navigateByUrl('/home');
    }

    async gameOver() {
        const alert = await this.alertController.create({
            header: 'Game Completed',
            // subHeader: 'Subtitle',
            message: `You scored ${ this.gameService.lifetimeStats.lastGame }!`,
            buttons: ['Play Again', 'Show Stats', 'Close']
        });

        await alert.present();
    }

}
