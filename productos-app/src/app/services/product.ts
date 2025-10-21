import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://api-producto-primero-2.onrender.com/productos'; // url de productos de render

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

 getProduct(id: string): Observable<any> {
  return this.http.get<any>(
    `${this.apiUrl}/${id}`,
    { headers: this.getAuthHeaders() }
  );
}

createProduct(product: any): Observable<any> {
  return this.http.post<any>(
    this.apiUrl,
    product,
    { headers: this.getAuthHeaders() } 
  );
}

  updateProduct(id: string, product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, product, {
      headers: this.getAuthHeaders()
    });
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}