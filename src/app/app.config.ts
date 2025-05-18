import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import {ChatService} from './chatbot/chat.service';

export const appConfig = {
  providers: [
    importProvidersFrom(
      BrowserModule,
      HttpClientModule
    ),
    provideRouter([], withEnabledBlockingInitialNavigation()), ChatService
  ]
};
