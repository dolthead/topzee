import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GameScreenPage} from './game-screen.page';
import {Storage} from '@ionic/storage';
import {AlertController, AngularDelegate, ModalController, Platform} from '@ionic/angular';
import {NativeAudio} from '@ionic-native/native-audio/ngx';
import {RouterTestingModule} from '@angular/router/testing';
import {Vibration} from '@ionic-native/vibration/ngx';
import {GameService} from '../services/game.service';

describe('GameScreenPage', () => {

    let component: GameScreenPage;
    let fixture: ComponentFixture<GameScreenPage>;
    let mockStorage, mockNativeAudio, mockVibration, mockGameService;

    beforeEach(async(() => {
        mockStorage = jasmine.createSpyObj(['get', 'set']);
        mockNativeAudio = jasmine.createSpyObj(['get', 'set']);
        mockVibration = jasmine.createSpyObj(['get', 'set']);
        mockGameService = jasmine.createSpyObj(['get', 'set']);

        TestBed.configureTestingModule({
            declarations: [GameScreenPage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                {provide: Storage, useValue: mockStorage},
                {provide: NativeAudio, useValue: mockNativeAudio},
                {provide: Vibration, useValue: mockVibration},
                {provide: GameService, useValue: mockGameService},
                Platform,
                AlertController,
                ModalController,
                AngularDelegate
            ],
            imports: [
                RouterTestingModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GameScreenPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    
});
