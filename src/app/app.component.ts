import { Component, OnInit } from '@angular/core';
import {Stomp} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {Observable} from 'rxjs'
import { GridApi, ColumnApi } from 'ag-grid-community';
import{DataServiceService} from './service/data-service.service'
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { map, switchMap} from 'rxjs/operators'
// const subject = webSocket('ws://localhost:8080/convexapp');

// subject.subscribe(
//   msg => console.log('message received: ' + msg), // Called whenever there is a message from the server.
//   err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
//   () => console.log('complete') // Called when connection is closed (for whatever reason).
// );
// subject.asObservable().subscribe(dataFromServer => console.log('message received: ' + dataFromServer));
// const observableA = subject.multiplex(
//   () => ({subscribe: '/topic/loans'}), // When server gets this message, it will start sending messages for 'A'...
//   () => ({unsubscribe: '/topic/loans'}), // ...and when gets this one, it will stop.
//   message => message === 'A' // If the function returns `true` message is passed down the stream. Skipped if the function returns false.
// );
// const subA = observableA.subscribe(messageForA => console.log(messageForA));

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  
  rowData: Observable<any[]>;
  data: string;
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

  constructor(private service: DataServiceService) {

    if(typeof(EventSource) !== "undefined") {
      console.log('I am suppose to work')
      var source = new EventSource("http://localhost:8080/websocket/sse");
      source.addEventListener('message', message => {
          console.log(JSON.parse(message.data));
          this.rowData= JSON.parse(message.data);
      });
      // source.onmessage = function(event) {
      //   document
      //  console.log(event.data.toString());
      //  this.rowData = event.data;
      // }
    }
    
   }
  ngOnInit(): void {

   
    
  }
   connect() {
     
     this.service.connect().pipe(
       map(results => console.log(results))
     );
  }


  // setConnected(connected: boolean) {
  //   this.disabled = !connected;

  //   if (connected) {
  //     this.greetings = [];
  //   }
  // }

  // connect() {
  //   const socket = new SockJS('http://localhost:8080/convexapp');
  //   this.stompClient = Stomp.over(socket);

  //   const _this = this;
  //   this.stompClient.connect({}, function (frame) {
  //     _this.setConnected(true);
  //     console.log('Connected: ' + frame);

  //     _this.stompClient.subscribe('/topic/loans', function (livedata) {
  //       _this.showGreeting(JSON.parse(livedata.body));
  //     });
  //   });
  // }

  // disconnect() {
  //   if (this.stompClient != null) {
  //     this.stompClient.disconnect();
  //   }

  //   this.setConnected(false);
  //   console.log('Disconnected!');
  // }

  // sendName() {
  //   this.stompClient.send(
  //     '/convex/livedata',
  //     {},
  //     JSON.stringify({ 'name': this.name })
  //   );
  // }

  // showGreeting(message) {
  //   this.rowData =message;
  //   console.log( this.rowData)
  //   this.greetings.push(message);
  // }
}
