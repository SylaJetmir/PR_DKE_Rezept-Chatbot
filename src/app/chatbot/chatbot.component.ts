// src/app/chatbot/chatbot.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, RecipeResponse } from '../api.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  userInput = '';
  preferences = '';
  ingredients: string[] = [];
  chatMessages: { sender: string; text: string }[] = [];
  currentRecipeIndex = 0;

  constructor(private api: ApiService) {}

  addIngredient(): void {
    if (this.userInput.trim()) {
      this.ingredients.push(this.userInput.trim());
      this.chatMessages.push({
        sender: 'User',
        text: `Zutat hinzugefügt: ${this.userInput.trim()}`
      });
      this.userInput = '';
    }
  }

  setPreferences(): void {
    if (this.preferences.trim()) {
      this.chatMessages.push({
        sender: 'User',
        text: `Präferenzen gesetzt: ${this.preferences.trim()}`
      });
    }
  }

  getRecipe(): void {
    // Füge User-Message hinzu
    this.chatMessages.push({
      sender: 'User',
      text: `Ich habe folgende Zutaten: ${this.ingredients.join(', ')} und bevorzuge: ${this.preferences}. Welches Rezept empfiehlst du?`
    });

    // Payload bauen und API aufrufen
    this.api.getRecipes({
      ingredients: this.ingredients,
      preferences: this.preferences
    }).subscribe({
      next: (resp: RecipeResponse) => {
        // Jede Antwort wird einzeln gepusht
        resp.result.forEach((r: string) =>
          this.chatMessages.push({ sender: 'Chatbot', text: r })
        );
      },
      error: (err: any) => {
        console.error(err);
        this.chatMessages.push({
          sender: 'Chatbot',
          text: 'Sorry, da gab’s einen Fehler beim Abruf.'
        });
      }
    });
  }

  getAnotherRecipe(): void {
    this.chatMessages.push({
      sender: 'User',
      text: 'Ich hätte gern etwas anderes 😕'
    });
    // Optional: hier Bestandteile erneuern oder neuen API-Aufruf machen
  }

  get hasRecipeSuggestion(): boolean {
    return this.chatMessages.some(
      m => m.sender === 'Chatbot' && m.text.includes('Rezept')
    );
  }
}
