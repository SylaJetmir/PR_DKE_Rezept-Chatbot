import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, RecipeResponse } from './chat.service';

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

    this.chat.getResponse(this.ingredients, this.preferences).subscribe({
      next: (resp: RecipeResponse) => this.handleResponse(resp),
      error: () => this.handleError()
    });
  }

  // Direkte Chat-Eingabe
  sendDirect(): void {
    const text = this.directInput.trim();
    if (!text) return;

    this.addMessage('User', text);
    this.chat.getResponse(text, '').subscribe({
      next: (resp: RecipeResponse) => this.handleResponse(resp),
      error: () => this.handleError()
    });

    this.directInput = '';
  }

  private addMessage(sender: string, text: string): void {
    this.chatMessages.push({ sender, text });
  }

  private handleResponse(resp: RecipeResponse): void {
    resp.result.forEach((r: string) => {
      this.addMessage('Chatbot', r);
    });
  }

  private handleError(): void {
    this.addMessage('Chatbot', 'Entschuldigung, es gab ein Problem.');
  }
}
