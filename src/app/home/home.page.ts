import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {GameService} from '../services/game.service';
import {AudioService} from '../services/audio.service';
import {AngularFireAuth} from '@angular/fire/auth';
import { auth } from 'firebase/app';
import {Platform} from '@ionic/angular';
import {FirebaseAuth} from '@angular/fire';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    public fireAuth: FirebaseAuth;
    private user;

    constructor(private router: Router,
                private platform: Platform,
                public gameService: GameService,
                public audio: AudioService,
                public afAuth: AngularFireAuth) {
        afAuth.authState.subscribe(user => {
            this.user = user;
        });
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
        // mobile device login
        const provider = new auth.GoogleAuthProvider();
        if (this.platform.is('cordova')) {
            this.fireAuth.signInWithRedirect(provider)
                .then(() => {
                    return this.fireAuth.getRedirectResult()
                        .then(result => {
                        // This gives you a Google Access Token.
                        // You can use it to access the Google API.
                        // const token = result.credential.accessToken;
                        // The signed-in user info.
                        // const user = result.user;
                        // console.log(token, user);
                        }).catch(function (error) {
                            // Handle Errors here.
                            console.error(error.message);
                        });
                });
        } else { // web login
            return this.afAuth.auth
                .signInWithPopup(provider)
                .then(res => console.log(res));
        }
    }

    logout() {
        this.afAuth.auth.signOut();
    }

}
