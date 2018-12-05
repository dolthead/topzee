import {Injectable} from '@angular/core';
import {Platform} from '@ionic/angular';
import {NativeAudio} from '@ionic-native/native-audio/ngx';


interface Sound {
    key: string;
    asset: string;
    isNative: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AudioService {

    private sounds: Sound[] = [];
    private audioPlayer: HTMLAudioElement = new Audio();
    private forceWebAudio = true;

    constructor(private platform: Platform, private nativeAudio: NativeAudio) {

    }

    preload(key: string, asset: string): void {

        if (!this.sounds.filter((sound) => sound.key === key).length) {
            if (this.platform.is('cordova') && !this.forceWebAudio) {
                this.nativeAudio.preloadSimple(key, asset);
                this.sounds.push({
                    key: key,
                    asset: asset,
                    isNative: true
                });
            } else {
                const audio = new Audio();
                audio.src = asset;
                this.sounds.push({
                    key: key,
                    asset: asset,
                    isNative: false
                });
            }
        }
    }

    play(key: string): void {

        // console.log('sounds', JSON.stringify(this.sounds));
        const soundToPlay: Sound = this.sounds.find((sound) => sound.key === key);
        if (soundToPlay) {
            if (soundToPlay.isNative) {
                this.nativeAudio.play(soundToPlay.asset).then((res) => {
                    console.log(res);
                }, (err) => {
                    console.log(err);
                });
            } else {
                this.audioPlayer.src = soundToPlay.asset;
                this.audioPlayer.play();
            }
        }

    }

}