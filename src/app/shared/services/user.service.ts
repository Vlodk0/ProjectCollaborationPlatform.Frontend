import { Injectable } from '@angular/core';
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {GetUser} from "../interfaces/get-user";
import {UpdateUser} from "../interfaces/update-user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl: string = `${environment.apiUrl}/User`

  constructor(private readonly httpClient: HttpClient) { }

  public getUser(): Observable<GetUser> {
    return this.httpClient.get<GetUser>(this.apiUrl);
  }

  public updateUser(user: UpdateUser) {
    return this.httpClient.patch(this.apiUrl, user)
  }
}
