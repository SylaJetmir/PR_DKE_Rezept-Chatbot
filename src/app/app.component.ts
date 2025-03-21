import { Component } from '@angular/core';
import { ChatbotComponent } from './chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [ChatbotComponent]
})
export class AppComponent {
  title = 'PR-DKE-UI';
}
