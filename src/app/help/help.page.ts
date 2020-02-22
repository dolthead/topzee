import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';

@Component({
    selector: 'app-help',
    templateUrl: './help.page.html',
    styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {
    constructor(public platform: Platform, private modalController: ModalController) {}

    ngOnInit() {}

    cancel() {
        this.modalController.dismiss();
    }
}
