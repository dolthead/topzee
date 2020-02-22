import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
    constructor(private modalController: ModalController) {}

    ngOnInit() {}

    cancel() {
        this.modalController.dismiss();
    }
}
