import { TestBed } from '@angular/core/testing';

import { ScoringService } from './scoring.service';
import { Die } from '../models/die.model';

const getDice = ([d1, d2, d3, d4, d5]: number[]): Die[] => {
  return [
    { pips: d1, locked: false },
    { pips: d2, locked: false },
    { pips: d3, locked: false },
    { pips: d4, locked: false },
    { pips: d5, locked: false },
  ];
};

describe('ScoringService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScoringService = TestBed.get(ScoringService);
    expect(service).toBeTruthy();
  });

  describe('getScore (numbers)', () => {

    it('should return sum of ONES on dice', () => {
      const service: ScoringService = TestBed.get(ScoringService);
      expect(service.getScore(getDice([2,3,4,5,6]), 'Ones')).toEqual(0);
      expect(service.getScore(getDice([1,1,1,1,1]), 'Ones')).toEqual(5);
      expect(service.getScore(getDice([5,4,2,1,1]), 'Ones')).toEqual(2);
    });

    it('should return sum of TWOS on dice', () => {
      const service: ScoringService = TestBed.get(ScoringService);
      expect(service.getScore(getDice([1,3,4,5,6]), 'Twos')).toEqual(0);
      expect(service.getScore(getDice([2,2,2,2,2]), 'Twos')).toEqual(10);
      expect(service.getScore(getDice([2,4,2,1,1]), 'Twos')).toEqual(4);
    });

    it('should return sum of THREES on dice', () => {
      const service: ScoringService = TestBed.get(ScoringService);
      expect(service.getScore(getDice([1,2,4,5,6]), 'Threes')).toEqual(0);
      expect(service.getScore(getDice([3,3,3,3,3]), 'Threes')).toEqual(15);
      expect(service.getScore(getDice([2,3,2,3,1]), 'Threes')).toEqual(6);
    });

    it('should return sum of FOURS on dice', () => {
      const service: ScoringService = TestBed.get(ScoringService);
      expect(service.getScore(getDice([1,2,3,5,6]), 'Fours')).toEqual(0);
      expect(service.getScore(getDice([4,4,4,4,4]), 'Fours')).toEqual(20);
      expect(service.getScore(getDice([4,3,2,3,4]), 'Fours')).toEqual(8);
    });

    it('should return sum of FIVES on dice', () => {
      const service: ScoringService = TestBed.get(ScoringService);
      expect(service.getScore(getDice([1,2,3,4,6]), 'Fives')).toEqual(0);
      expect(service.getScore(getDice([5,5,5,5,5]), 'Fives')).toEqual(25);
      expect(service.getScore(getDice([4,5,5,3,4]), 'Fives')).toEqual(10);
    });

    it('should return sum of SIXES on dice', () => {
      const service: ScoringService = TestBed.get(ScoringService);
      expect(service.getScore(getDice([1,2,3,4,5]), 'Sixes')).toEqual(0);
      expect(service.getScore(getDice([6,6,6,6,6]), 'Sixes')).toEqual(30);
      expect(service.getScore(getDice([4,6,5,3,6]), 'Sixes')).toEqual(12);
    });

  });

  describe('getScore (sets)', () => {

    it('should return sum of dice when 3 OAK', () => {
      const service: ScoringService = TestBed.get(ScoringService);
      expect(service.getScore(getDice([2,3,4,5,6]), '3 Oak')).toEqual(0);
      expect(service.getScore(getDice([1,1,1,1,1]), '3 Oak')).toEqual(5);
      expect(service.getScore(getDice([5,4,4,1,4]), '3 Oak')).toEqual(18);
    });

    it('should return sum of dice when 4 OAK', () => {
      const service: ScoringService = TestBed.get(ScoringService);
      expect(service.getScore(getDice([2,3,4,5,6]), '4 Oak')).toEqual(0);
      expect(service.getScore(getDice([1,1,1,1,1]), '4 Oak')).toEqual(5);
      expect(service.getScore(getDice([4,4,4,1,4]), '4 Oak')).toEqual(17);
    });

    it('should return 25 when Full House', () => {
      const service: ScoringService = TestBed.get(ScoringService);
      expect(service.getScore(getDice([2,3,4,5,6]), 'Full House')).toEqual(0);
      expect(service.getScore(getDice([1,1,1,1,1]), 'Full House')).toEqual(25);
      expect(service.getScore(getDice([4,4,1,1,4]), 'Full House')).toEqual(25);
      expect(service.getScore(getDice([6,5,6,5,6]), 'Full House')).toEqual(25);
    });

    it('should return 30 when 4 Straight', () => {
      const service: ScoringService = TestBed.get(ScoringService);
      expect(service.getScore(getDice([2,3,5,5,5]), '4 Straight')).toEqual(0);
      expect(service.getScore(getDice([1,3,2,4,1]), '4 Straight')).toEqual(30);
      expect(service.getScore(getDice([4,3,1,1,2]), '4 Straight')).toEqual(30);
      expect(service.getScore(getDice([3,5,6,4,2]), '4 Straight')).toEqual(30);
    });

    it('should return 40 when 5 Straight', () => {
      const service: ScoringService = TestBed.get(ScoringService);
      expect(service.getScore(getDice([1,1,1,1,1]), '5 Straight')).toEqual(0);
      expect(service.getScore(getDice([2,3,4,5,5]), '5 Straight')).toEqual(0);
      expect(service.getScore(getDice([1,3,2,4,5]), '5 Straight')).toEqual(40);
      expect(service.getScore(getDice([4,3,5,6,2]), '5 Straight')).toEqual(40);
      expect(service.getScore(getDice([3,5,6,4,2]), '5 Straight')).toEqual(40);
    });

    it('should return 50 when 5 Oak', () => {
      const service: ScoringService = TestBed.get(ScoringService);
      expect(service.getScore(getDice([2,3,4,5,5]), '5 Oak')).toEqual(0);
      expect(service.getScore(getDice([5,3,5,5,5]), '5 Oak')).toEqual(0);
      expect(service.getScore(getDice([1,1,1,1,1]), '5 Oak')).toEqual(50);
      expect(service.getScore(getDice([3,3,3,3,3]), '5 Oak')).toEqual(50);
      expect(service.getScore(getDice([5,5,5,5,5]), '5 Oak')).toEqual(50);
      expect(service.getScore(getDice([6,6,6,6,6]), '5 Oak')).toEqual(50);
    });

    it('should return sum of dice for Any', () => {
      const service: ScoringService = TestBed.get(ScoringService);
      expect(service.getScore(getDice([2,3,4,5,6]), 'Any')).toEqual(20);
      expect(service.getScore(getDice([1,1,1,1,1]), 'Any')).toEqual(5);
      expect(service.getScore(getDice([5,4,4,1,4]), 'Any')).toEqual(18);
      expect(service.getScore(getDice([6,6,6,5,6]), 'Any')).toEqual(29);
      expect(service.getScore(getDice([6,4,6,4,6]), 'Any')).toEqual(26);
    });

  });

});
