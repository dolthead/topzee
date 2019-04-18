import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {GameService} from '../services/game.service';
import {AudioService} from '../services/audio.service';
import {AngularFireAuth} from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    constructor(private router: Router,
                public gameService: GameService,
                public audio: AudioService,
                public afAuth: AngularFireAuth) {
    }

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
        this.gameService.resetGame()
            .then(() => this.goToGame(), () => this.goToGame());
    }

    goToGame = function() {
        this.router.navigateByUrl('/GameScreen');
    };


    login() {
        this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    }

    logout() {
        this.afAuth.auth.signOut();
    }

}
