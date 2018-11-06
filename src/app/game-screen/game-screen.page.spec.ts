import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameScreenPage } from './game-screen.page';

describe('GameScreenPage', () => {
  let component: GameScreenPage;
  let fixture: ComponentFixture<GameScreenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameScreenPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
