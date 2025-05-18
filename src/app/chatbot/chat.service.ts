import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RecipeResponse {
  result: string[];
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private url = '/api/chat';

  constructor(private http: HttpClient) {}

  getResponse(message: string, preferences?: string): Observable<RecipeResponse> {
    const payload = preferences
      ? { ingredients: message, preferences }
      : { message };

    return this.http.post<RecipeResponse>(this.url, payload);
  }
}
