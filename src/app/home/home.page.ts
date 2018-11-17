import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {GameService} from '../services/game.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    lifetimeStats = {
        completedGameCount: 0,
        highScore: 0,
        totalScore: 0
    };
    averageScore = 0.0;

    constructor(private router: Router, public gameService: GameService) {
    }

    ionViewWillEnter() {
        this.averageScore = this.lifetimeStats.completedGameCount > 0 ?
            this.lifetimeStats.totalScore * 1.0 / this.lifetimeStats.completedGameCount
            : 0.0;
    }

    restartGame() {
        this.gameService.resetGame()
            .then(() => this.router.navigateByUrl('/GameScreen'),
                () => this.router.navigateByUrl('/GameScreen'));
    }

    playGame() {
        if (!this.gameService.game) {
            this.gameService.resetGame()
                .then(() => this.router.navigateByUrl('/GameScreen'),
                    () => this.router.navigateByUrl('/GameScreen'));
        } else {
            this.router.navigateByUrl('/GameScreen');
        }
    }

}
