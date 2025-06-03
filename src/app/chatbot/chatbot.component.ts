import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService} from './chat.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  ingredients: string = "";
  preferences: string = "";
  directInput: string = "";
  chatMessages: { sender: string; text: string }[] = [];

  constructor(private chat: ChatService) {}

  // Zutaten-basierte Anfrage
  sendRequest(): void {
    if (!this.ingredients.trim()) return;

    const message = `Zutaten: ${this.ingredients}. ${this.preferences ? 'Präferenzen: ' + this.preferences : ''}`;
    this.addMessage('User', message);

    try {
      this.chat.getResponse(this.ingredients, this.preferences).subscribe(response => {
      this.handleResponse(response)
    });
    } catch (error) {
      this.handleError;
    }
    
  }

  // Direkte Chat-Eingabe
  sendDirect(): void {
    const text = this.directInput.trim();
    if (!text) return;

    this.addMessage('User', text);

    try {
      this.chat.continueConversation(text).subscribe(response => {
      this.handleResponse(response)
    });
    } catch (error) {
      this.handleError;
    }

    this.directInput = '';
  }

  private addMessage(sender: string, text: string): void {
    this.chatMessages.push({ sender, text });
  }

  private handleResponse(resp: string): void {
      this.addMessage('Chatbot', resp);
  }

  private handleError(): void {
    this.addMessage('Chatbot', 'Entschuldigung, es gab ein Problem.');
  }
}
