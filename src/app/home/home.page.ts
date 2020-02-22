import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../services/game.service';
import { AudioService } from '../services/audio.service';
import { ModalController } from '@ionic/angular';
import { AboutPage } from '../about/about.page';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    constructor(
        public router: Router,
        public gameService: GameService,
        public audio: AudioService,
        private modalController: ModalController
    ) {}

    ionViewDidEnter() {
        this.audio.preload('score', 'assets/sounds/score.mp3');
    }

    playGame() {
        if (!this.gameService.game || !this.gameService.game.turnsLeft) {
            this.restartGame();
        } else {
            this.audio.play('score');
            this.goToGame();
        }
    }

    restartGame() {
        this.audio.play('score');
        this.gameService.resetGame().then(
            () => this.goToGame(),
            () => this.goToGame()
        );
    }

    async showAbout() {
        const modal = await this.modalController.create({
            component: AboutPage,
        });
        return await modal.present();
    }

    goToGame = function() {
        this.router.navigateByUrl('/GameScreen');
    };
}
