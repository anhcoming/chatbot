import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // private baseUrl: string;
  constructor(private http: HttpClient) {
    // this.baseUrl = environment.apiUrl;
  }
  get(url: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(url, { headers });
  }

  download(url: string, param: any){
    return this.http.post(url, param, { responseType: 'blob' });
  }

  get_download(url: string){
    return this.http.get(url, { observe: 'response', responseType: 'blob' });
  }

  post(url: string, data?: any) {
    // const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(url, data);
  }
  put(url: string, data?: any, headers?: any) {
    // const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.put(url, data, { headers });
  }
  delete(url: string, id: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.delete(url + id, { headers });
  }
}
