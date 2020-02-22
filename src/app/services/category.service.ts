import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    constructor() {}

    newCategories = () => [
        { name: 'Ones', score: undefined },
        { name: 'Twos', score: undefined },
        { name: 'Threes', score: undefined },
        { name: 'Fours', score: undefined },
        { name: 'Fives', score: undefined },
        { name: 'Sixes', score: undefined },
        { name: 'Bonus', score: undefined },
        { name: '3 Oak', score: undefined },
        { name: '4 Oak', score: undefined },
        { name: 'Full House', score: undefined },
        { name: '4 Straight', score: undefined },
        { name: '5 Straight', score: undefined },
        { name: '5 Oak', score: undefined },
        { name: 'Any', score: undefined },
    ];
}
