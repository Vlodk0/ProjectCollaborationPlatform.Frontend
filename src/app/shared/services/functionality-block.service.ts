import { Injectable } from '@angular/core';
import {environment} from "../../environment";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {FunctionalityBlock} from "../interfaces/functionality-block";
import {Observable} from "rxjs";
import {
  CreateFunctionalityBlockInterface
} from "../interfaces/functionality-block/create-functionality-block.interface";
import {FunctionalityBlockInterface} from "../interfaces/functionality-block/functionality-block.interface";
import {TaskStatus} from "../../core/enums/task-status.enum";

@Injectable({
  providedIn: 'root'
})
export class FunctionalityBlockService {

  private apiUrl: string = `${environment.apiUrl}/FunctionalityBlock`

  constructor(private httpClient: HttpClient) { }

  public createFunctionalityBlock(createFunctionalityBlock: CreateFunctionalityBlockInterface, projectId: string): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}?projectId=${projectId}`, createFunctionalityBlock);
  }

  getProjectTasks(projectId: string): Observable<FunctionalityBlockInterface[]> {
    return this.httpClient.get<FunctionalityBlockInterface[]>(this.apiUrl + `/${projectId}`);
  }

  public updateFunctionalityBlock(updateFunctionalityBlock: CreateFunctionalityBlockInterface, taskId: string): Observable<void> {
    return this.httpClient.patch<void>(this.apiUrl + `/${taskId}`, updateFunctionalityBlock)
  }

  public deleteFunctionalityBlock(funcBlockId: string): Observable<void> {
    return this.httpClient.delete<void>(this.apiUrl + `/${funcBlockId}`)
  }

  public updateTaskStatus(funcBlockId: string, status: TaskStatus): Observable<FunctionalityBlock> {
    return this.httpClient.patch<FunctionalityBlock>(this.apiUrl + `/task/${funcBlockId}`, status);
  }

  public assignProjectTask(taskId: string, developerId: string): Observable<void> {
    return this.httpClient.patch<void>(`${this.apiUrl}?taskId=${taskId}&developerId=${developerId}`, {});
  }

  public exportProjectTasksReport(projectId: string): Observable<HttpResponse<Blob> | any> {
    const url = `${this.apiUrl}/export?projectId=${projectId}`;

    return this.httpClient.get<Blob>(url,
      {
        observe: 'response',
        responseType: 'blob' as 'json'
      });
  }
}
