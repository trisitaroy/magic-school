import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {DataService} from './../../shared/service/data.service'
import { Router,ActivatedRoute } from '@angular/router';

import { APP_CONST } from '@app/app.constant';
import { slideOutAnimation, fadeInAnimation } from 'assets/animations/animations';
import { DropdownOption } from '@core/index';
import { Location } from '@angular/common';
import { getFormAttributeAsFormControl } from '@core/util';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-create-quiz',
    templateUrl: './create-quiz.component.html',
    styleUrls: ['./create-quiz.component.scss'],
    animations: [
        slideOutAnimation,
        fadeInAnimation
    ]
})
export class CreateQuizComponent implements OnInit {
    topicList: DropdownOption[] = []
    quizForm: FormGroup;
    isShowDuplicateContact = false;
    @Output() _overlayClosed = new EventEmitter<object>();
    public isShowOverlay: boolean = false;
    userInfo :any
    isQAdded: boolean = false;
    totalTeacher:any;
    ansList: DropdownOption[] = []
    teacherList: DropdownOption[] = []
    chooseTeacher:boolean=false;
    topic : string ='geo';
    ans:string='';
    quizname:string='random';
    teacher :string;
    constructor(
      private formBuilder: FormBuilder,
      private router: Router,      
      private activeroute: ActivatedRoute,
      private toaster :ToastrService,
      private location: Location,
      private dataService:DataService
    ) { }
  
    ngOnInit() {  
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
      this.topic = this.activeroute.snapshot.paramMap.get("id");
      this.createquizForm();
    }
      
    

    private createquizForm(): void {
      this.quizForm = this.formBuilder.group({
        quizname: ['', [Validators.required]],
        question: ['', [Validators.required]],
        optionA: ['', [Validators.required]],
        optionB: ['', [Validators.required]],
        optionC: ['', [Validators.required]],
        optionD: ['', [Validators.required]]
      });
    }
    /** Form Control Instances Start */
   
    get quizFormGroup_question(): FormControl {
      return getFormAttributeAsFormControl(this.quizForm, 'question');
    }
    get quizFormGroup_optionA(): FormControl {
      return getFormAttributeAsFormControl(this.quizForm, 'optionA');
    }
    get quizFormGroup_optionB(): FormControl {
      return getFormAttributeAsFormControl(this.quizForm, 'optionB');
    }
    get quizFormGroup_optionC(): FormControl {
      return getFormAttributeAsFormControl(this.quizForm, 'optionC');
    }
    get quizFormGroup_optionD(): FormControl {
      return getFormAttributeAsFormControl(this.quizForm, 'optionD');
    }
    get quizFormGroup_answer(): FormControl {
      return getFormAttributeAsFormControl(this.quizForm, 'answer');
    }
    get quizFormGroup_quizname(): FormControl {
      return getFormAttributeAsFormControl(this.quizForm, 'quizname');
    }

    /** Form Control Instances End */
    onFocusOutEvent(event: any,index){
      this.ansList[index]=
        {
          label:event.target.value,
          value:event.target.value
        } 
   }
  
    public selectionChanged(value: string, dropdownFor: string) {      
      switch (dropdownFor) {
        case 'ansList':
          this.ans = value;
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
  
    public createButtonClicked(event: boolean) {
      this.isShowDuplicateContact = true;    
    }
  
    public saveChanges(event: boolean){
        this.quizname = this.quizFormGroup_quizname.value;
        const quizCreateRequstObj = {
        createdby : this.userInfo.userName,
        topicname : this.topic,
        quizname :this.quizFormGroup_quizname.value,
        questionText: this.quizFormGroup_question.value,
        options: [this.quizFormGroup_optionA.value,this.quizFormGroup_optionB.value,
          this.quizFormGroup_optionC.value,this.quizFormGroup_optionD.value],
        answer: this.ans
       };
       if(this.ans!==''){
        this.dataService.createQuiz(quizCreateRequstObj).subscribe(data => {
          this.toaster.success('Question Added', APP_CONST.toasterMsgType.success);
          this.isQAdded = true;
          this.quizForm.reset();          
          this.quizForm.get('quizname').patchValue( this.quizname);
      });
       }else{
        this.toaster.error('Please Choose an Answer', APP_CONST.toasterMsgType.error);
       }
      
    }
  
    public cancelChanges(): void {
      this.quizForm.disable();
    }
   
  
    ngOnDestroy() { } 
  }
  
