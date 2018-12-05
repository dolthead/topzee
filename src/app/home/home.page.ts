import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {GameService} from '../services/game.service';
import {AudioService} from '../services/audio.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    averageScore = 0.0;

    constructor(private router: Router,
                public gameService: GameService,
                public audio: AudioService) {
    }

    ionViewDidEnter() {
        this.audio.preload('score', 'assets/sounds/score.mp3');
    }

    restartGame() {
        this.audio.play('score');
        this.gameService.resetGame()
            .then(() => this.router.navigateByUrl('/GameScreen'),
                () => this.router.navigateByUrl('/GameScreen'));
    }

    playGame() {
        this.audio.play('score');
        if (!this.gameService.game || !this.gameService.game.turnsLeft) {
            this.gameService.resetGame()
                .then(() => this.router.navigateByUrl('/GameScreen'),
                    () => this.router.navigateByUrl('/GameScreen'));
        } else {
            this.router.navigateByUrl('/GameScreen');
        }
    }

}
