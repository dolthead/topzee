import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePage } from './home.page';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, Platform } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { Storage } from '@ionic/storage';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

describe('HomePage', () => {
    let component: HomePage;
    let fixture: ComponentFixture<HomePage>;
    let mockStorage, mockNativeAudio;

    beforeEach(async(() => {
        mockStorage = jasmine.createSpyObj(['get', 'set']);
        mockNativeAudio = jasmine.createSpyObj(['get', 'set']);

        TestBed.configureTestingModule({
            declarations: [HomePage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            // schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: Storage, useValue: mockStorage },
                Platform,
                { provide: NativeAudio, useValue: mockNativeAudio },
            ],
            imports: [CommonModule, FormsModule, IonicModule, RouterTestingModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    xit('should create', () => {
        // mockStorage.get.and.returnValue({ score: 22 });
        expect(component).toBeTruthy();
    });
});
