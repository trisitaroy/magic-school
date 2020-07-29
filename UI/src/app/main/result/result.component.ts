import { Component, OnInit,HostListener, Input,Output,EventEmitter ,ViewChild,ElementRef} from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {DataService} from '../../shared/service/data.service'

import { APP_CONST } from '@app/app.constant';
import { slideOutAnimation, fadeInAnimation } from  'assets/animations/animations';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-result',
    templateUrl: './result.component.html',
    styleUrls: ['./result.component.scss'],
    animations: [
        slideOutAnimation,
        fadeInAnimation
    ]
})
export class ResultComponent implements OnInit { 
  @Output() _overlayClosed = new EventEmitter<object>(); 
  public isShowOverlay: boolean = false;
    userInfo :any; 
    
  totalQuestions: number;
  allQuestions: any[];
  correctAnswersCount: number;
  percentage: number;
  completionTime: number;
  elapsedMinutes: number;
  elapsedSeconds: number;
  quizUrl = 'https://magicschool-front.eu-gb.mybluemix.net/#/topics';

  CONGRATULATIONS = 'assets/images/congo.png';
  NOT_BAD = 'assets/images/notbad.png';
  TRY_AGAIN = 'assets/images/tryagain.png';
  topicname :string;
    constructor(
      private dataService:DataService,      
      private location: Location, private router: Router
    ) {    
      if(!this.router.getCurrentNavigation().extras.state)  
      this.router.navigateByUrl('/topics');
    this.topicname = this.router.getCurrentNavigation().extras.state.topicname; 
    this.totalQuestions = this.router.getCurrentNavigation().extras.state.totalQuestions;
    this.correctAnswersCount = this.router.getCurrentNavigation().extras.state.correctAnswersCount;
    this.completionTime = this.router.getCurrentNavigation().extras.state.completionTime;
    this.allQuestions = this.router.getCurrentNavigation().extras.state.allQuestions;
     }
  
    ngOnInit() {
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'));  
      this.elapsedSeconds = this.completionTime ;
      this.percentage = Math.round(100 * this.correctAnswersCount / this.totalQuestions);
      this.postResult();  
    }
    ngAfterViewChecked() {        
   
  } 
    postResult(){
      const obj= {
        username :this.userInfo.userName,
        topiccode : this.topicname,
        createdby : this.allQuestions[0].createdby,
        topicname: this.allQuestions[0].quizname,
        totalQ:this.totalQuestions,
        correctQ:this.correctAnswersCount,
        score:this.percentage,
        totaltime:this.elapsedSeconds,
        passingscore:'80%',
        comment:this.percentage>=80 ?'Congratulations': this.percentage>=60 ? 'Not Bad' : 'Try Again',
        date : new Date().toISOString().substring(0, 10).toString(),
        status : this.percentage>=60 ?'Passed' :'Failed!!'
      }
      this.dataService.postResult(obj).subscribe(data => { });

    } 
    public navigateToBack() {
      this.closeOverlay(true, true);
      this.router.navigateByUrl('/topics');
    }
    public closeOverlay(value: boolean, isContactSave?: boolean) {
      localStorage.removeItem("chatId");
      this._overlayClosed.emit({ value, isContactSave });
      this.isShowOverlay = !value;
    }
    
  
    ngOnDestroy() { } 
  }
  
