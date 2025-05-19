import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RecipeResponse {
  result: string[];
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = 'http://127.0.0.1:8000';
  private url = '/api/chat';

  constructor(private http: HttpClient) {}

  getResponse(prompt: string): Observable<any> {
    return this.http.post<string>(`${this.apiUrl}/retrieve`, prompt);
  }

  continueConversation(prompt: string): Observable<any> {
    return this.http.post<string>(`${this.apiUrl}/continue`, prompt);
  }

  /* getResponse(message: string, preferences?: string): Observable<RecipeResponse> {
    const payload = preferences
      ? { ingredients: message, preferences }
      : { message };

    return this.http.post<RecipeResponse>(this.url, payload);
  } */
}
