import { Injectable } from '@angular/core';
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";
import {FunctionalityBlock} from "../interfaces/functionality-block";
import {Observable} from "rxjs";
import {ProjectInfo} from "../interfaces/project-info";
import {CreateTask} from "../interfaces/create-task";

@Injectable({
  providedIn: 'root'
})
export class FunctionalityBlockService {

  private apiUrl: string = `${environment.apiUrl}/FunctionalityBlock`

  constructor(private httpClient: HttpClient) { }

  public createFunctionalityBlock(funcBlockObj: CreateTask, boardId: string): Observable<FunctionalityBlock> {
    return this.httpClient.post<FunctionalityBlock>(this.apiUrl + `/${boardId}`, funcBlockObj)
  }

  getTasksByBoardId(boardId: string): Observable<FunctionalityBlock[]> {
    return this.httpClient.get<FunctionalityBlock[]>(this.apiUrl + `/${boardId}`);
  }

  public updateTask(funcBlock: FunctionalityBlock, funcBlockId: string): Observable<FunctionalityBlock> {
    return this.httpClient.put<FunctionalityBlock>(this.apiUrl + `/${funcBlockId}`, funcBlock)
  }

  public deleteTask(funcBlockId: string): Observable<FunctionalityBlock> {
    return this.httpClient.delete<FunctionalityBlock>(this.apiUrl + `/${funcBlockId}`)
  }

  public updateTaskStatus(funcBlockId: string, status: number): Observable<FunctionalityBlock> {
    return this.httpClient.patch<FunctionalityBlock>(this.apiUrl + `/${funcBlockId}`, status);
  }
}
