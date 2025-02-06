import { Injectable } from '@angular/core';
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";
import {CountryInterface} from "../interfaces/country-interface";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StaticDataService {
  private apiUrl: string = `${environment.apiUrl}/StaticData`

  constructor(private readonly httpClient: HttpClient) { }

  getAllCountries(): Observable<CountryInterface[]> {
    return this.httpClient.get<CountryInterface[]>(`${this.apiUrl}/country`);
  }

  getAllStates(countryCode: string): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.apiUrl}/states?countryCode=${countryCode}`);
  }
}
