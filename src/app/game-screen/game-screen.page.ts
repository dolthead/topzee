import { Component } from '@angular/core';
import { GameService } from '../services/game.service';
import { ScoringService } from '../services/scoring.service';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { AudioService } from '../services/audio.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { HelpPage } from '../help/help.page';

@Component({
    selector: 'app-game-screen',
    templateUrl: './game-screen.page.html',
    styleUrls: ['./game-screen.page.scss'],
    animations: [
        trigger('dieState', [
            state('show', style({ transform: 'scale(1.0)' })),
            state('hide', style({ transform: 'scale(0.1)' })),
            transition('hide => show', animate('100ms')),
            // transition('show => hide', animate('1ms')),
        ]),
    ],
})
export class GameScreenPage {
    unlockedCount = 5;
    rollLabel: String;
    debounced = false;

    constructor(
        private router: Router,
        public gameService: GameService,
        public scoringService: ScoringService,
        public alertController: AlertController,
        public audio: AudioService,
        private modalController: ModalController
    ) {}

    ionViewWillEnter() {
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

    async showHelp() {
        const modal = await this.modalController.create({
            component: HelpPage,
        });
        return await modal.present();
    }

    /**
     * roll the dice, after 800ms debounce and if there are rolls left this turn
     */
    roll() {
        if (!this.debounced) {
            this.debounced = true;
            setTimeout(() => (this.debounced = false), 800);

            if (this.gameService.game.rollsLeft) {
                this.gameService.clearSelectedCategory();

                this.gameService.game.dice.forEach(die => {
                    if (!die.locked) {
                        die.pips = 0;
                        // timeout between 0 and new die value helps trigger animation
                        setTimeout(() => {
                            this.audio.play(`roll${Math.floor(Math.random() * 3)}`);
                            die.pips = Math.ceil(Math.random() * 6);
                            this.gameService.storeGame();
                            if (this.scoringService.getOAKScore(this.gameService.game.dice, 5)) {
                                this.audio.play('oak5');
                                // this.vibration.vibrate(500);
                            }
                        }, 10);
                    }
                });
                this.gameService.game.rollsLeft--;
                this.setRollLabel();
            }
        }
    }

    /**
     * set die selected state
     * @param i which die to toggle (0-4)
     */
    dieClick(i: number) {
        if (this.gameService.game.turnsLeft && this.gameService.game.rollsLeft < 3) {
            // ignore die tap if they haven't rolled yet
            this.audio.play('dice' + (this.gameService.game.dice[i].locked ? 1 : 0));
            this.gameService.game.dice[i].locked = !this.gameService.game.dice[i].locked;
            this.setRollLabel();
        }
    }

    /**
     * update text on Roll button
     */
    async setRollLabel() {
        this.unlockedCount = await this.gameService.game.dice.filter(d => !d.locked).length;
        this.rollLabel = !this.gameService.game.turnsLeft
            ? `Game over`
            : this.gameService.game.rollsLeft
            ? `Roll ${this.unlockedCount} ${this.unlockedCount > 1 ? 'dice' : 'die'}`
            : `No rolls left`;
    }

    /**
     * handle tapped categories with sound and potential score (must save to finish scoring)
     * @param catName
     */
    setSelectedCategory(catName: String) {
        if (this.gameService.game.rollsLeft === 3) {
            this.showHelp();
        } else if (
            this.gameService.game.turnsLeft &&
            catName !== this.gameService.game.category && // ignore if they've already selected this category
            catName !== 'Bonus' &&
            this.gameService.game.rollsLeft < 3
        ) {
            // ignore if they haven't rolled the dice yet
            const points = this.gameService.setSelectedCategory(catName);
            this.audio.play(points ? 'score' : 'score0');
        }
    }

    /**
     * handle saving score and check for game over
     */
    async save() {
        this.audio.play('score');
        await this.gameService.save();
        if (!this.gameService.game || !this.gameService.game.turnsLeft) {
            await this.gameOver();
        }
        this.setRollLabel();
    }

    /**
     * allow new game after game over
     */
    reset() {
        this.gameService.resetGame();
        this.setRollLabel();
    }

    /**
     * handle game over with a sound and alert (state is already saved)
     */
    async gameOver() {
        this.audio.play('gameOver');
        const alert = await this.alertController.create({
            header: `You scored ${this.gameService.lifetimeStats.lastGame}!`,
            buttons: [
                {
                    text: 'Play Again',
                    handler: () => this.reset(),
                },
                {
                    text: 'Close',
                    role: 'cancel',
                },
            ],
        });

        await alert.present();
    }
}
