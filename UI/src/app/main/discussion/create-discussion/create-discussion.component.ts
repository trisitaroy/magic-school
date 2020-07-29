import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import {DataService} from './../../../shared/service/data.service'
import { Router } from '@angular/router';

import { APP_CONST } from '@app/app.constant';
import { slideOutAnimation, fadeInAnimation } from 'assets/animations/animations';
import { DropdownOption} from '@core/index';
import { Location } from '@angular/common';
import { getFormAttributeAsFormControl } from '@core/util';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-create-discussion',
    templateUrl: './create-discussion.component.html',
    styleUrls: ['./create-discussion.component.scss'],
    animations: [
        slideOutAnimation,
        fadeInAnimation
    ]
})
export class CreateDiscussionComponent implements OnInit {

    private companyLibDataSub$: Subscription;
    private hbCompMasterId: string="";
    discussionForm: FormGroup;
    isContactCreatedSuccessfully = false;
    createdDiscussion :any;
    @Output() _overlayClosed = new EventEmitter<object>();
    public isShowOverlay: boolean = false;
    contactDetailObject: any;
    
    contactMasterId: any;
    private propertyImageControl: any;
    public propertyImageSrc: string | any;
    userInfo :any
    totalTopics: any;
    totalTeacher:any;
    topicList: DropdownOption[] = []
    teacherList: DropdownOption[] = []
    chooseTeacher:boolean=false;
    topic : string ='math';
    toggleChecked:boolean=false;
    teacher :string;
    constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private location: Location,
      private dataService:DataService
    ) { }
  
    ngOnInit() {  
      this.getTopics(); 
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    }
      
    

    private createDiscussionForm(): void {
      this.discussionForm = this.formBuilder.group({
        topic: ['', ''],
        question: ['', Validators.required]
        
      });
    }
    getTopics(){
      this.dataService.getQuiz().subscribe(data => {
        this.totalTopics = data;
        this.totalTopics.forEach(element => {
          this.topicList.push({
            value: element.topiccode,
            label: element.topicname
        })
        });
        this.topic = this.topicList[0].value    
      this.createDiscussionForm();
      });
    }
    /** Form Control Instances Start */
    get discussionFormGroup_topic(): FormControl {
      return getFormAttributeAsFormControl(this.discussionForm, 'topic');
    }
    get discussionFormGroup_question(): FormControl {
      return getFormAttributeAsFormControl(this.discussionForm, 'question');
    }
    /** Form Control Instances End */
  
    public selectionChanged(value: string, dropdownFor: string) {      
      switch (dropdownFor) {
        case 'topic':
          this.topic = value;
          this.toggleChecked=false;
          break;
          case 'teacher':
            this.teacher = value;
            break;
      }
    }
    
  
    public navigateToContact() {
      this.closeOverlay(true, true);
      this.location.back();
    }
  
    public closeOverlay(value: boolean, isContactSave?: boolean) {
      this._overlayClosed.emit({ value, isContactSave });
      this.isShowOverlay = !value;
    }
    public saveChanges(event: boolean){ 
        const discussionCreateRequstObj = {
        subject : this.topic,
        teacher :this.chooseTeacher?this.teacher:'',
        question: this.discussionFormGroup_question.value,
        askedBy: this.userInfo.fName +' '+this.userInfo.lName,
        askedByUsername:this.userInfo.userName,
        role: this.userInfo.role,
        totalLikes:0,
        Date: new Date().getDate() +"/"+new Date().getMonth() +"/"+new Date().getFullYear()
      };
      this.dataService.createDiscussion(discussionCreateRequstObj).subscribe(data => {
        this.createdDiscussion = data
        if(this.chooseTeacher){
          const noty={
            fromname:this.userInfo.userName,
            fromrole : this.userInfo.role,
            date: new Date().getDate() +"/"+new Date().getMonth() +"/"+new Date().getFullYear(),
            tousername :this.teacher,
            body : this.userInfo.fName +' '+this.userInfo.lName +' has notify you to a discussion',
            questionid : this.createdDiscussion.id
          }
          this.dataService.postNoty(noty).subscribe(data=>{            
         
          });  
        } 
        this.router.navigate([
          `${APP_CONST.routes.home}`
        ]);                           
      });
    }
  
    public cancelChanges(): void {
      this.discussionForm.disable();
    }
    public toggleValueChange(value) {
      if(value){  
        this.chooseTeacher = true;
        this.getTeacher();
      }else{
        this.chooseTeacher = false;
      }
    }
    getTeacher(){
      this.dataService.getTeacher(this.topic).subscribe(data => {
        this.totalTeacher = data;
        this.teacherList=[];
        this.totalTeacher.forEach(element => {
          this.teacherList.push({
            value: element.userName,
            label: element.fName +' '+  element.lName
        })
        });  
        this.teacher =this.teacherList[0]?this.teacherList[0].value:''      
      });
    }
  
    ngOnDestroy() { } 
  }
  
