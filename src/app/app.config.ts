// src/app/app.config.ts
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';    // ← wichtig
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';

export const appConfig = {
  providers: [
    importProvidersFrom(BrowserModule, HttpClientModule),
    provideRouter([], withEnabledBlockingInitialNavigation())
  ]
};
