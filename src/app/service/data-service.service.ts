import { Injectable, OnInit } from '@angular/core';;
import { Observable, timer, Subject, EMPTY } from 'rxjs';
import { retryWhen, tap, delayWhen, switchAll, catchError } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
@Injectable({

  providedIn: 'root'
})
export class DataServiceService  {

  wsEndpoint: string = 'ws://localhost:8080/convexapp';
  reconnectInterval: 2000;
  private socket$: WebSocketSubject<any>;

  constructor() {


  }
 

   public connect(): WebSocketSubject<any> {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket('ws://localhost:8080/convexapp');
      console.log('Connection Established');
    }
    return this.socket$;
  }

  public dataUpdates$() {
    return this.connect().asObservable();
  }

  closeConnection() {
    this.connect().complete();
    console.log('Connection closed');
  }

  sendMessage(msg: any) {
     this.socket$.next(msg);
  }

}
