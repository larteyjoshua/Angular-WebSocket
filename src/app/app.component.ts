import { Component } from '@angular/core';
import {Stomp} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {Observable} from 'rxjs'
import { GridApi, ColumnApi } from 'ag-grid-community';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  rowData: Observable<any[]>;
  private api: GridApi;  
  private columnApi: ColumnApi;
  title = 'Angular-websocket-App';
  description = 'Angular-WebSocket Demo';


  columnDefs = [
    { field: 'riskDesk' },
    { field: 'asset' },
    { field: 'account'},
    { field: 'cusip' },
    { field: 'pv01' },
    { field: 'pv01Twos'},
    { field: 'pv01Tens' },
    { field: 'pv01Thirtys'},
    { field: 'dv01'},
    { field: 'convexity' },
    { field: 'kappa'},
    { field: 'kappa'}
];

onGridReady(params): void {  
  this.api = params.api;  
  this.columnApi = params.columnApi;  
  this.api.sizeColumnsToFit();   
}  


  greetings: string[] = [];
  disabled = true;
  name: string;
  private stompClient = null;

  constructor() { }

  setConnected(connected: boolean) {
    this.disabled = !connected;

    if (connected) {
      this.greetings = [];
    }
  }

  connect() {
    const socket = new SockJS('http://localhost:8080/convexapp');
    this.stompClient = Stomp.over(socket);

    const _this = this;
    this.stompClient.connect({}, function (frame) {
      _this.setConnected(true);
      console.log('Connected: ' + frame);

      _this.stompClient.subscribe('/topic/loans', function (livedata) {
        _this.showGreeting(JSON.parse(livedata.body));
      });
    });
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }

    this.setConnected(false);
    console.log('Disconnected!');
  }

  sendName() {
    this.stompClient.send(
      '/convex/livedata',
      {},
      JSON.stringify({ 'name': this.name })
    );
  }

  showGreeting(message) {
    this.rowData =message;
    console.log( this.rowData)
    this.greetings.push(message);
  }
}
