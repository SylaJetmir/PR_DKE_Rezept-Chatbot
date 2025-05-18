import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  getResponse(prompt: string): Observable<any> {
    return this.http.post<string>(`${this.apiUrl}/retrieve`, prompt);
  }

  continueConversation(prompt: string): Observable<any> {
    return this.http.post<string>(`${this.apiUrl}/continue`, prompt);
  }
}
