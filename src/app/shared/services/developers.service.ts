import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export type DeveloperLevel = 'Junior' | 'Mid' | 'Senior' | 'Lead';

export interface DeveloperRecord {
  id: number;
  name: string;
  role: string;
  level: DeveloperLevel;
  department: string;
  contributions: number;
}

export type DeveloperDraft = Omit<DeveloperRecord, 'id'>;

export interface DeveloperSeedResult {
  alreadySeeded: boolean;
  rows: DeveloperRecord[];
}

export const DEVELOPER_LEVELS: DeveloperLevel[] = ['Junior', 'Mid', 'Senior', 'Lead'];

/**
 * Talks to the local SQLite lab API (Express).
 * Dev: Angular proxy sends /api → http://localhost:3001
 */
@Injectable({ providedIn: 'root' })
export class DevelopersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/developers';

  getAll(): Observable<DeveloperRecord[]> {
    return this.http.get<DeveloperRecord[]>(this.baseUrl);
  }

  create(draft: DeveloperDraft): Observable<DeveloperRecord> {
    return this.http.post<DeveloperRecord>(this.baseUrl, draft);
  }

  update(id: number, draft: DeveloperDraft): Observable<DeveloperRecord> {
    return this.http.patch<DeveloperRecord>(`${this.baseUrl}/${id}`, draft);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  seed(): Observable<DeveloperSeedResult> {
    return this.http.post<DeveloperSeedResult>(`${this.baseUrl}/seed`, {});
  }

  reset(): Observable<DeveloperRecord[]> {
    return this.http.post<DeveloperRecord[]>(`${this.baseUrl}/reset`, {});
  }
}
