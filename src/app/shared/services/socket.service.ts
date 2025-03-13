import {Injectable} from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {LogLevel} from '@microsoft/signalr';
import {AlertsService} from "./alerts.service";
import {SignalrEvent} from "../../core/constants/signalr-event";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public active = false;
  private connection: signalR.HubConnection;

  constructor(private readonly alertService: AlertsService) { }

  public start(): void {
    if (this.active) {
      return;
    }

    const token = localStorage.getItem('access_token'); // Ensure token is stored in localStorage/sessionStorage

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5212' + '/clientHub', {
        accessTokenFactory: () => token ? token : "",
        logger: LogLevel.Information
      })
      .withAutomaticReconnect()
      .build();

    this.connection.onclose(() => this.startConnection());

    this.connection.on(
      SignalrEvent.newNotification,
      (value: any) => this.alertService.setNewAlert(value));

    this.connection.on(
      SignalrEvent.newInvitation,
      (value: any) => this.alertService.setNewAlert(value));

    this.startConnection();
  }

  public stop(): void {
    if (this.connection) {
      this.connection.stop();
    }
  }

  private startConnection(): void {
    this.connection.start()
      .then(() => this.active = true)
      .catch(async () => {
        this.active = false;
        await new Promise(resolve => setTimeout(resolve, 5000));
        this.start();
      });
  }
}
