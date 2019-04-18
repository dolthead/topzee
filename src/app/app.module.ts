import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {IonicStorageModule} from '@ionic/storage';
import {NativeAudio} from '@ionic-native/native-audio/ngx';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Vibration} from '@ionic-native/vibration/ngx';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { firebaseConfig } from './firebaseConfig';
import { AngularFireAuth } from '@angular/fire/auth';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        IonicStorageModule.forRoot({
            name: '__topzee',
            driverOrder: ['indexeddb', 'sqlite', 'websql']
        }),
        BrowserAnimationsModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        AngularFireModule.initializeApp(firebaseConfig),
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        NativeAudio,
        Vibration,
        AngularFireAuth,
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
