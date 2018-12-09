import {Component} from '@angular/core';
import {GameService} from '../services/game.service';
import {Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {AudioService} from '../services/audio.service';

@Component({
    selector: 'app-game-screen',
    templateUrl: './game-screen.page.html',
    styleUrls: ['./game-screen.page.scss'],
})
export class GameScreenPage {

    unlockedCount = 5;
    rollLabel: String;
    debounced = false;

    constructor(private router: Router,
                public gameService: GameService,
                public alertController: AlertController,
                public audio: AudioService) {
    }

    ionViewWillEnter() {
        // console.log('will enter');
        setTimeout(() => this.setRollLabel(), 100);
    }

    ionViewDidEnter() {
        this.audio.preload('roll0', 'assets/sounds/roll0.mp3');
        this.audio.preload('roll1', 'assets/sounds/roll1.mp3');
        this.audio.preload('roll2', 'assets/sounds/roll2.mp3');
        this.audio.preload('dice0', 'assets/sounds/dice0.mp3');
        this.audio.preload('dice1', 'assets/sounds/dice1.mp3');
        this.audio.preload('score', 'assets/sounds/score.mp3');
        this.audio.preload('score0', 'assets/sounds/score0.mp3');
        this.audio.preload('oak5', 'assets/sounds/oak5.mp3');
        this.audio.preload('gameOver', 'assets/sounds/gameOver.mp3');
    }

    async roll() {
        if (!this.debounced) {
            this.debounced = true;
            setTimeout(() => this.debounced = false, 800);
            this.audio.play(`roll${ Math.floor(Math.random() * 3) }`);
            if (this.gameService.game.rollsLeft) {
                this.gameService.clearSelectedCategory();
                this.gameService.game.dice.filter(die => !die.locked)
                // .forEach(die => die.pips = 6;
                    .forEach(die => die.pips = Math.ceil(Math.random() * 6));
                this.gameService.game.rollsLeft--;
                this.setRollLabel();
                if (this.gameService.getOAKScore(5)) {
                    this.audio.play('oak5');
                }
            }
            this.gameService.storeGame();
        }
    }

    dieClick(i) {
        if (this.gameService.game.turnsLeft
                && this.gameService.game.rollsLeft < 3) {
            this.audio.play('dice' + (this.gameService.game.dice[i].locked ? 1 : 0));
            this.gameService.game.dice[i].locked = !this.gameService.game.dice[i].locked;
            this.setRollLabel();
        }
    }

    async setRollLabel() {
        this.unlockedCount = await this.gameService.game.dice.filter((d) => !d.locked).length;
        this.rollLabel = !this.gameService.game.turnsLeft
                ? `Game over`
                : this.gameService.game.rollsLeft
                ? `Roll ${ this.unlockedCount } ${ this.unlockedCount > 1 ? 'dice' : 'die' }`
                : `No rolls left`;
    }

    setSelectedCategory(catName) {
        if (this.gameService.game.turnsLeft
                && catName !== this.gameService.game.category
                && catName !== 'Bonus'
                && this.gameService.game.rollsLeft < 3) {
            const points = this.gameService.setSelectedCategory(catName);
            this.audio.play(points ? 'score' : 'score0');
        }
    }

    async save() {
        this.audio.play('score');
        await this.gameService.save();
        if (!this.gameService.game || !this.gameService.game.turnsLeft) {
            await this.gameOver();
        }
        this.setRollLabel();
    }

    reset() {
        this.gameService.resetGame();
        this.setRollLabel();
    }

    goHome() {
        this.router.navigateByUrl('/home');
    }

    async gameOver() {
        this.audio.play('gameOver');
        const alert = await this.alertController.create({
            header: `You scored ${ this.gameService.lifetimeStats.lastGame }!`,
            // message: 'Game Completed',
            buttons: [
                    {
                        text: 'Play Again',
                        handler: () => this.reset()
                    },
                    {
                        text: 'Close',
                        role: 'cancel'
                    },
                    // {
                    //     text: 'Close',
                    //     handler: () => this.goHome()
                    // },
                ]
        });

        await alert.present();
    }

}
