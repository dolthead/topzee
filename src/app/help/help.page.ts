import { Component } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';

@Component({
    selector: 'app-help',
    templateUrl: './help.page.html',
    styleUrls: ['./help.page.scss'],
})
export class HelpPage {
    constructor(public platform: Platform, private modalController: ModalController) {}

    cancel() {
        this.modalController.dismiss();
    }
}
