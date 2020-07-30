import { Component, OnInit,HostListener, Input,Output,EventEmitter ,ViewChild,ElementRef} from '@angular/core';
import { Observable } from 'rxjs';
import {DataService} from '../../shared/service/data.service'

import { APP_CONST } from '@app/app.constant';
import { slideOutAnimation, fadeInAnimation } from  'assets/animations/animations';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { AngularAgoraRtcService, Stream } from 'angular-agora-rtc'; // Add


@Component({
    selector: 'app-videocall',
    templateUrl: './videocall.component.html',
    styleUrls: ['./videocall.component.scss'],
    animations: [
        slideOutAnimation,
        fadeInAnimation
    ]
})
export class VideocallComponent implements OnInit { 
  localStream: Stream // Add
  remoteCalls:any = [];
  isJoined :boolean = false;
  @Output() _overlayClosed = new EventEmitter<object>(); 
  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
   
    localStorage.removeItem("chjjatId");
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
      private location: Location, private agoraService: AngularAgoraRtcService
    ) {  this.agoraService.createClient(); }
  
    ngOnInit() {
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
      
    }
    ngAfterViewChecked() {        
    
   } 
    // Add
    startCall() {
      this.isJoined = true;
      this.agoraService.client.join(null, '1000', null, (uid) => {
        this.localStream = this.agoraService.createStream(uid, true, null, null, true, false);
        this.localStream.setVideoProfile('720p_3');
        this.subscribeToStreams();
      });
    }

  // Add
  private subscribeToStreams() {
    this.localStream.on("accessAllowed", () => {
      console.log("accessAllowed");
    });
    // The user has denied access to the camera and mic.
    this.localStream.on("accessDenied", () => {
      console.log("accessDenied");
    });

    this.localStream.init(() => {
      console.log("getUserMedia successfully");
      this.localStream.play('agora_local');
      this.agoraService.client.publish(this.localStream, function (err) {
        console.log("Publish local stream error: " + err);
      });
      this.agoraService.client.on('stream-published', function (evt) {
        console.log("Publish local stream successfully");
      });
    }, function (err) {
      console.log("getUserMedia failed", err);
    });

    // Add
    this.agoraService.client.on('error', (err) => {
      console.log("Got error msg:", err.reason);
      if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
        this.agoraService.client.renewChannelKey("", () => {
          console.log("Renew channel key successfully");
        }, (err) => {
          console.log("Renew channel key failed: ", err);
        });
      }
    });

    // Add
    this.agoraService.client.on('stream-added', (evt) => {
      const stream = evt.stream;
      this.agoraService.client.subscribe(stream, (err) => {
        console.log("Subscribe stream failed", err);
      });
    });

    // Add
    this.agoraService.client.on('stream-subscribed', (evt) => {
      const stream = evt.stream;
      if (!this.remoteCalls.includes(`agora_remote${stream.getId()}`)) this.remoteCalls.push(`agora_remote${stream.getId()}`);
      setTimeout(() => stream.play(`agora_remote${stream.getId()}`), 2000);
    });

    // Add
    this.agoraService.client.on('stream-removed', (evt) => {
      const stream = evt.stream;
      stream.stop();
      this.remoteCalls = this.remoteCalls.filter(call => call !== `#agora_remote${stream.getId()}`);
      console.log(`Remote stream is removed ${stream.getId()}`);
    });

    // Add
    this.agoraService.client.on('peer-leave', (evt) => {
      const stream = evt.stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = this.remoteCalls.filter(call => call === `#agora_remote${stream.getId()}`);
        console.log(`${evt.uid} left from this channel`);
      }
    });
  }
  leave() {
    window.location.reload();
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
  
