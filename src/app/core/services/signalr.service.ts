// ============================================================
// VMS Pro — SignalR Service
// ============================================================
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import * as signalR from '@microsoft/signalr';
import { environment } from '@env';
import { TokenService } from '@core/auth/token.service';

export interface VisitorCheckedInEvent {
  id: string;
  visitorName: string;
  hostName: string;
  locationName: string;
  checkInTime: string;
}

export interface VisitorCheckedOutEvent {
  id: string;
  visitorName: string;
  checkOutTime: string;
}

export type ConnectionStatus = 'connected' | 'reconnecting' | 'disconnected';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection: signalR.HubConnection | null = null;

  private connectionStatusSubject = new BehaviorSubject<ConnectionStatus>('disconnected');
  connectionStatus$ = this.connectionStatusSubject.asObservable().pipe(distinctUntilChanged());

  get connectionStatus(): ConnectionStatus {
    return this.connectionStatusSubject.value;
  }

  private visitorCheckedInSubject = new Subject<VisitorCheckedInEvent>();
  visitorCheckedIn$ = this.visitorCheckedInSubject.asObservable();

  private visitorCheckedOutSubject = new Subject<VisitorCheckedOutEvent>();
  visitorCheckedOut$ = this.visitorCheckedOutSubject.asObservable();

  private readonly MAX_RETRY_ATTEMPTS = 5;
  private retryAttempts = 0;
  private retryTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private tokenService: TokenService,
    private ngZone: NgZone,
  ) {}

  startConnection(): void {
    if (this.hubConnection) { return; }

    const token = this.tokenService.getAccessToken();
    if (!token) { return; }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.signalRUrl, {
        accessTokenFactory: () => this.tokenService.getAccessToken() ?? ''
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    this.registerLifecycleHooks();
    this.registerEvents();
    this.doStart();
  }

  stopConnection(): void {
    this.clearRetryTimeout();
    if (this.hubConnection) {
      this.hubConnection.stop().then(() => console.log('[SignalR] Disconnected'));
      this.hubConnection = null;
    }
    this.setStatus('disconnected');
  }

  private doStart(): void {
    if (!this.hubConnection) { return; }
    this.hubConnection
      .start()
      .then(() => {
        console.log('[SignalR] Connected');
        this.retryAttempts = 0;
        this.setStatus('connected');
      })
      .catch(err => {
        console.error('[SignalR] Connection failed:', err);
        this.setStatus('disconnected');
        this.retryStart();
      });
  }

  private retryStart(): void {
    if (this.retryAttempts >= this.MAX_RETRY_ATTEMPTS) {
      console.warn('[SignalR] Max retry attempts reached.');
      return;
    }
    const delay = Math.min(2000 * Math.pow(2, this.retryAttempts), 30000);
    this.retryAttempts++;
    this.retryTimeout = setTimeout(() => this.doStart(), delay);
  }

  private clearRetryTimeout(): void {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }
  }

  private setStatus(status: ConnectionStatus): void {
    this.ngZone.run(() => this.connectionStatusSubject.next(status));
  }

  private registerLifecycleHooks(): void {
    if (!this.hubConnection) { return; }
    this.hubConnection.onreconnecting(() => this.setStatus('reconnecting'));
    this.hubConnection.onreconnected(() => {
      this.retryAttempts = 0;
      this.setStatus('connected');
    });
    this.hubConnection.onclose(() => {
      this.setStatus('disconnected');
      this.retryStart();
    });
  }

  private registerEvents(): void {
    if (!this.hubConnection) { return; }
    this.hubConnection.on('VisitorCheckedIn', (data: VisitorCheckedInEvent) => {
      this.ngZone.run(() => this.visitorCheckedInSubject.next(data));
    });
    this.hubConnection.on('VisitorCheckedOut', (data: VisitorCheckedOutEvent) => {
      this.ngZone.run(() => this.visitorCheckedOutSubject.next(data));
    });
  }
}
