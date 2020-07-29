import { Component, OnInit,HostListener, Input,Output,EventEmitter ,ViewChild,ElementRef} from '@angular/core';
import { Observable } from 'rxjs';
import {DataService} from './../../shared/service/data.service'

import { APP_CONST } from '@app/app.constant';
import { slideOutAnimation, fadeInAnimation } from  'assets/animations/animations';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-covid',
    templateUrl: './covid.component.html',
    styleUrls: ['./covid.component.scss'],
    animations: [
        slideOutAnimation,
        fadeInAnimation
    ]
})
export class CovidComponent implements OnInit { 
  @Output() _overlayClosed = new EventEmitter<object>(); 
  @ViewChild('scrollMe', {static: false}) myScrollContainer: ElementRef; 
  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
   
    localStorage.removeItem("chatId");
}

  public isShowOverlay: boolean = false;
    messages: any[] = [];
    userInfo :any;    
    newMessage = '';
    chatSeasionData :any;
    botReply:any=[];
    isBotActive:boolean=false;
    constructor(
      private dataService:DataService,      
      private location: Location,
    ) { }
  
    ngOnInit() {
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
      this.getChatSeassionId();
      this.getBotMsg();
    }
    ngAfterViewChecked() {        
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  } 

    getBotMsg(){
      var session_id = localStorage.getItem("chatId");
      if(session_id){
        var msg ={
          "session_id": session_id,
          "input": {
            "message_type": "text",
            "text": this.newMessage===''?"":this.newMessage
          }
        }
        this.dataService.getBotMsg(msg).subscribe(data => {
          this.botReply = data;
          this.botReply = this.botReply.result.output.generic;
          if(this.botReply.length>0){
            this.botReply.forEach(element => {
              var obj ={"text":element.text,"incomming":true}
              this.messages.push(obj);              
            });
          }
          this.isBotActive= true;
          this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        },
        error => {
          if(error.error.message ==='Invalid Session'){
            localStorage.removeItem("chatId");            
            this.getChatSeassionId();
          }
        });
      }     
    }
    getChatSeassionId(){
      var session_id = localStorage.getItem("chatId");
      if(!session_id){
      this.dataService.getChatSeasionId().subscribe(data => {
        this.chatSeasionData = data;
        localStorage.setItem("chatId", this.chatSeasionData .result.session_id);
        this.getBotMsg();
      });
    }
    }
    
     sendMessage() {
      if (this.newMessage.trim() === '') {
        return;
      }
  
      var obj ={"text":this.newMessage,"incomming":false}
      this.messages.push(obj);
      this.getBotMsg();
      this.newMessage ='';
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;     
    }
    public navigateToBack() {
      this.closeOverlay(true, true);
      this.location.back();
    }
    public closeOverlay(value: boolean, isContactSave?: boolean) {
      localStorage.removeItem("chatId");
      this._overlayClosed.emit({ value, isContactSave });
      this.isShowOverlay = !value;
    }
  
    ngOnDestroy() { } 
  }
  
