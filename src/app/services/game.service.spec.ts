import { TestBed } from '@angular/core/testing';

import { GameService } from './game.service';

xdescribe('GameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  xit('should be created', () => {
    const service: GameService = TestBed.get(GameService);
    expect(service).toBeTruthy();
  });
});
