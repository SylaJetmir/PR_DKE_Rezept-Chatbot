import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  chatMessages: { sender: string, text: string }[] = [];
  currentRecipeIndex = 0;

  recipeSuggestions: string[] = [
    'Spaghetti mit Tomatensauce 🍝',
    'Gebratener Reis mit Gemüse 🥦🍚',
    'Vegane Linsensuppe 🥣',
    'Ofenkartoffeln mit Kräuterquark 🥔🌿',
    'Scharfes Kichererbsen-Curry 🌶️🍛'
  ];

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
    const message = `Ich habe folgende Zutaten: ${this.ingredients.join(', ')} und bevorzuge: ${this.preferences}. Welches Rezept empfiehlst du?`;
    this.chatMessages.push({ sender: 'User', text: message });

    this.currentRecipeIndex = 0;

    setTimeout(() => {
      const firstSuggestion = this.recipeSuggestions[this.currentRecipeIndex];
      this.chatMessages.push({
        sender: 'Chatbot',
        text: `Hier ist ein Rezept für dich: ${firstSuggestion}`
      });
    }, 500);
  }

  getAnotherRecipe(): void {
    this.currentRecipeIndex++;

    if (this.currentRecipeIndex >= this.recipeSuggestions.length) {
      this.currentRecipeIndex = 0;
    }

    const newSuggestion = this.recipeSuggestions[this.currentRecipeIndex];

    this.chatMessages.push({
      sender: 'User',
      text: 'Ich hätte gern etwas anderes 😕'
    });

    setTimeout(() => {
      this.chatMessages.push({
        sender: 'Chatbot',
        text: `Kein Problem! Hier ist ein weiteres Rezept: ${newSuggestion}`
      });
    }, 500);
  }

  get hasRecipeSuggestion(): boolean {
    return this.chatMessages.some(
      m => m.sender === 'Chatbot' && m.text.includes('Rezept')
    );
  }
}
