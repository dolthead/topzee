import { TestBed, async } from '@angular/core/testing';
import { GameService } from './game.service';
import { AngularDelegate, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

describe('GameService', () => {
    let mockStorage;

    beforeEach(async(() => {
        mockStorage = jasmine.createSpyObj(['get', 'set']);
        TestBed.configureTestingModule({
            providers: [{ provide: Storage, useValue: mockStorage }, Platform, AngularDelegate],
        }).compileComponents();
    }));

    beforeEach(() => {});

    it('should be created', () => {
        const service: GameService = TestBed.get(GameService);
        expect(service).toBeTruthy();
    });
});
