import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

const { Browser } = Plugins;

@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.scss'],
})
export class AboutPage {
    constructor(private modalController: ModalController) {}

    async browseTwitter() {
        await Browser.open({ url: 'https://twitter.com/dolthead' });
    }

    cancel() {
        this.modalController.dismiss();
    }
}
