import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  ingredients = '';
  preferences = '';
  chatMessages: { sender: string; text: string }[] = [];
  directInput = '';

  constructor(private chat: ChatService) {}

  /** Sendet die Zutaten+Präferenzen als einen Request */
  sendRequest(): void {
    const text = `Zutaten: ${this.ingredients}; Präferenzen: ${this.preferences}`;
    this.chat.getResponse(this.ingredients, this.preferences)
      .subscribe({
        next: resp => {
          resp.result.forEach(r =>
            this.chatMessages.push({ sender: 'Chatbot', text: r })
          );
        },
        error: () => this.chatMessages.push({ sender: 'Chatbot', text: 'Fehler beim Laden.' })
      });
    this.chatMessages.push({ sender: 'User', text });
  }

  /** Direkte Eingabe an den Bot senden */
  sendDirect(): void {
    const text = this.directInput.trim();
    if (!text) return;
    // Hier Logik für direkten Service-Call oder lokale Antwort
    this.chatMessages.push({ sender: 'User', text });
    // Beispiel: dieselbe Service-Methode verwenden
    this.chat.getResponse(text, '')
      .subscribe({ next: resp => {
          resp.result.forEach(r =>
            this.chatMessages.push({ sender: 'Chatbot', text: r })
          );
        }});
    this.directInput = '';
  }
}
