import { Injectable } from '@angular/core';
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";
import {Board} from "../interfaces/board";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private apiUrl: string = `${environment.apiUrl}/Board`

  constructor(private httpClient: HttpClient) { }

  public createBoard(boardObj: Board, projectId: string): Observable<Board> {
    return this.httpClient.post<Board>(this.apiUrl + `/${projectId}`, boardObj)
  }
}
