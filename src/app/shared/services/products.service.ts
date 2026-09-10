import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  make: string;
  model: string;
  price: number;
  stock: number;
}

export type ProductUpdate = Partial<Omit<Product, 'id'>>;

/**
 * Talks to the local SQLite lab API (Express).
 * Dev: Angular proxy sends /api → http://localhost:3001
 */
@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/products';

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  update(id: number, patch: ProductUpdate): Observable<Product> {
    return this.http.patch<Product>(`${this.baseUrl}/${id}`, patch);
  }

  create(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  reset(): Observable<Product[]> {
    return this.http.post<Product[]>(`${this.baseUrl}/reset`, {});
  }
}
