import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiceRowComponent } from './dice-row.component';

describe('DiceRowComponent', () => {
  let component: DiceRowComponent;
  let fixture: ComponentFixture<DiceRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiceRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiceRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
