import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp({
        apiKey: "AIzaSyDHh9r8nej9FouA7YR6hWv4P_cM5davpVI",
        authDomain: "finalfire-8f3c0.firebaseapp.com",
        projectId: "finalfire-8f3c0",
        storageBucket: "finalfire-8f3c0.appspot.com",
        messagingSenderId: "869860097307",
        appId: "1:869860097307:web:aad1479784c9528b28e7be"
      }))
    ),
    importProvidersFrom(
      provideFirestore(() => getFirestore())
    ), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"finalfire-8f3c0","appId":"1:869860097307:web:aad1479784c9528b28e7be","storageBucket":"finalfire-8f3c0.appspot.com","apiKey":"AIzaSyDHh9r8nej9FouA7YR6hWv4P_cM5davpVI","authDomain":"finalfire-8f3c0.firebaseapp.com","messagingSenderId":"869860097307"}))), importProvidersFrom(provideFirestore(() => getFirestore()))
  ]
};
