import { TestBed } from '@angular/core/testing';

import { AudioService } from './audio.service';
import { Platform } from '@ionic/angular';

describe('AudioService', () => {
    beforeEach(() =>
        TestBed.configureTestingModule({
            providers: [Platform],
        })
    );

    it('should be created', () => {
        const service: AudioService = TestBed.get(AudioService);
        expect(service).toBeTruthy();
    });

    describe('preload', () => {
        it('should load 1 sound file', () => {
            const service: AudioService = TestBed.get(AudioService);

            service.preload('score', 'assets/sounds/score.mp3');

            expect(service.getSounds().length).toEqual(1);
        });

        it('should load all 9 sound files', () => {
            const service: AudioService = TestBed.get(AudioService);

            service.preload('roll0', 'assets/sounds/roll0.mp3');
            service.preload('roll1', 'assets/sounds/roll1.mp3');
            service.preload('roll2', 'assets/sounds/roll2.mp3');
            service.preload('dice0', 'assets/sounds/dice0.mp3');
            service.preload('dice1', 'assets/sounds/dice1.mp3');
            service.preload('score', 'assets/sounds/score.mp3');
            service.preload('score0', 'assets/sounds/score0.mp3');
            service.preload('oak5', 'assets/sounds/oak5.mp3');
            service.preload('gameOver', 'assets/sounds/gameOver.mp3');

            expect(service.getSounds().length).toEqual(9);
        });
    });

    describe('play', () => {
        it('should return true for existing sound ', () => {
            const service: AudioService = TestBed.get(AudioService);

            service.preload('score', 'assets/sounds/score.mp3');

            expect(service.play('score')).toEqual(true);
        });

        it('should return false for non-existent sound', () => {
            const service: AudioService = TestBed.get(AudioService);

            service.preload('score', 'assets/sounds/score.mp3');

            expect(service.play('not a sound key')).toEqual(false);
        });
    });
});
