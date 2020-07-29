import { Component, OnInit,HostListener, Input,Output,EventEmitter ,ViewChild,ElementRef} from '@angular/core';
import { Observable } from 'rxjs';
import { DropdownOption} from '@core/index';
import {DataService} from '../../shared/service/data.service'
import { Router,ActivatedRoute } from '@angular/router';

import { APP_CONST } from '@app/app.constant';
import { slideOutAnimation, fadeInAnimation } from  'assets/animations/animations';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-quiz',
    templateUrl: './quiz.component.html',
    styleUrls: ['./quiz.component.scss'],
    animations: [
        slideOutAnimation,
        fadeInAnimation
    ]
})
export class QuizComponent implements OnInit { 
  @Output() _overlayClosed = new EventEmitter<object>(); 
  public isShowOverlay: boolean = false;
    userInfo :any; ;
    topic:string;
    quizname:string;
    totalQuiz :any;
    topicList: DropdownOption[] = []
    constructor(
      private dataService:DataService,      
      private location: Location,
      private activeroute: ActivatedRoute,
      private router :Router
    ) { }
  
    ngOnInit() {
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
      this.topic = this.activeroute.snapshot.paramMap.get("id");
      this.getQuiz();
    }
    ngAfterViewChecked() {        
   
  } 

    public navigateToBack() {
      this.closeOverlay(true, true);
      this.location.back();
    }
    public closeOverlay(value: boolean, isContactSave?: boolean) {
      this._overlayClosed.emit({ value, isContactSave });
      this.isShowOverlay = !value;
    }
    getQuiz(){
      this.dataService.getAllQuestion(this.topic).subscribe(data => {
        this.totalQuiz = data;
        this.totalQuiz = [...new Set( this.totalQuiz.map(item => item.quizname))];
        this.totalQuiz.forEach(element => {
          this.topicList.push({
            value: element,
            label: element
        })
        }); 
        this.quizname = this.topicList[0].value;  
      });

    }
    public selectionChanged(value: string, dropdownFor: string) {      
      switch (dropdownFor) {
        case 'quizname':
          this.quizname = value;
          break;
      }
    }
    startQuiz() {
      this.router.navigateByUrl('/question/'+ this.topic +'/'+ this.quizname+'/1');
    }
  
    ngOnDestroy() { } 
  }
  
