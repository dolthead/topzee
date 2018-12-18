import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {GameScreenPage} from './game-screen.page';
import {HelpPage} from '../help/help.page';

const routes: Routes = [
    {
        path: '',
        component: GameScreenPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [GameScreenPage, HelpPage],
    entryComponents: [HelpPage]
})
export class GameScreenPageModule {
}
