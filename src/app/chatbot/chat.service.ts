import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export class PromptRequest{
  ingredients!: string
  preferences!: string
}

export class ConversationRequest{
  prompt!: string
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = 'http://127.0.0.1:8000';
  private url = '/api/chat';
  private header = {};

  constructor(private http: HttpClient) {
    this.header = {
      headers: new HttpHeaders()
         .set("Access-Control-Allow-Origin", "http://127.0.0.1:8000")
         .set("Access-Control-Allow-Methods", "POST, GET, PUT")
         .set("Access-Control-Allow-Headers", "Content-Type")
    }
  }

  getResponse(ingredients: string, preferences?: string): Observable<string> {
    var request = new PromptRequest();
    request.ingredients = ingredients;
    request.preferences = preferences ?? '';

    return this.http.post<string>(`${this.apiUrl}/retrieve`, request, this.header);
  }

  continueConversation(prompt: string): Observable<string> {
    var request = new ConversationRequest();
    request.prompt = prompt;

    return this.http.post<string>(`${this.apiUrl}/continueConversation`, request, this.header);
  }

}
