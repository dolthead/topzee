import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {GameService} from '../services/game.service';
import {AudioService} from '../services/audio.service';
// import {AngularFireAuth} from '@angular/fire/auth';
// import { auth } from 'firebase/app';
import {Platform} from '@ionic/angular';
// import {FirebaseAuth} from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    // public fireAuth: FirebaseAuth;
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
            console.log('cordova');
            return this.afAuth.auth.signInWithRedirect(provider)
                .then(() => {
                    return this.afAuth.auth.getRedirectResult().then( result => {
                        // This gives you a Google Access Token.
                        // You can use it to access the Google API.
                        // let token = result.credential.accessToken;
                        // The signed-in user info.
                        // let user = result.user;
                        // console.log(token, user);
                    }).catch(function(error) {
                        // Handle Errors here.
                        alert(error.message);
                    });
                });
        } else { // web login
            console.log('web');
            return this.afAuth.auth
                .signInWithPopup(provider)
                .then(res => console.log(res));
        }
    }

    logout() {
        this.afAuth.auth.signOut();
    }

}
