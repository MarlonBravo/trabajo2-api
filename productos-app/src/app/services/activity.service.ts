import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Activity {
  id: number;
  title: string;
  dueDate: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = 'http://localhost:3000/activities';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.apiUrl);
  }

  getActivity(id: number): Observable<Activity> {
    return this.http.get<Activity>(`${this.apiUrl}/${id}`);
  }

  createActivity(activity: Omit<Activity, 'id'>): Observable<Activity> {
    return this.http.post<Activity>(this.apiUrl, activity, { 
      headers: this.getHeaders() 
    });
  }

  updateActivity(id: number, activity: Omit<Activity, 'id'>): Observable<Activity> {
    return this.http.put<Activity>(`${this.apiUrl}/${id}`, activity, { 
      headers: this.getHeaders() 
    });
  }

  deleteActivity(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { 
      headers: this.getHeaders() 
    });
  }
}