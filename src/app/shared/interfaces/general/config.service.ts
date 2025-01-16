import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {MenuConfigInterface} from "./menu.interface";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configUrl = 'assets/configs/';

  constructor(private readonly http: HttpClient) {
  }

  public getConfigMenu(): Observable<MenuConfigInterface> {
    return this.http.get<MenuConfigInterface>(`${this.configUrl}menu.config.json`);
  }
}
