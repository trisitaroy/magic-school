import { Component, OnInit,HostListener, Input,Output,EventEmitter ,ViewChild,ElementRef} from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {DataService} from '../../shared/service/data.service'

import { APP_CONST } from '@app/app.constant';
import { slideOutAnimation, fadeInAnimation } from  'assets/animations/animations';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-topics',
    templateUrl: './topics.component.html',
    styleUrls: ['./topics.component.scss'],
    animations: [
        slideOutAnimation,
        fadeInAnimation
    ]
})
export class TopicsComponent implements OnInit { 
  @Output() _overlayClosed = new EventEmitter<object>(); 
  public isShowOverlay: boolean = false;
    userInfo :any; 

    topicDetailsList :any=[];
    checkmark = '';
    checkmark_stem = '';
    checkmark_kick = '';
    selectedtopicCode = '';
    selectedtopicName :string;
    constructor(
      private dataService:DataService,      
      private location: Location, private router: Router
    ) { }
  
    ngOnInit() {
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
      this.getQuiz();     
    }
    ngAfterViewChecked() {        
   
  }
  goToQuiz(topiccode){
    if(this.userInfo.role =='teacher'){
      this.router.navigateByUrl('/createquiz/'+topiccode);
    }else{
      this.router.navigateByUrl('/quiz/'+topiccode);
    }
  } 

  addtopicLogo(topic) {
    switch (topic) {
      case "physics":
        return "physics";
      case "biology":
        return "biology";
      case "english":
        return "english";
      case "chemistry":
        return "chemistry";
      case "history":
        return "history";
      case "math":
        return "math";
      case "geography":
        return "geography";
      case "music":
        return "music";
      case "art":
        return "art";
      case "dance":
        return "dance";
    }
  }
  getQuiz(){
    this.dataService.getQuiz().subscribe(data => {
      this.topicDetailsList = data;
    });
  }
    public navigateToBack() {
      this.closeOverlay(true, true);
      this.router.navigateByUrl('/home');
    }
    public closeOverlay(value: boolean, isContactSave?: boolean) {
      localStorage.removeItem("chatId");
      this._overlayClosed.emit({ value, isContactSave });
      this.isShowOverlay = !value;
    }
    
  
    ngOnDestroy() { } 
  }
  
