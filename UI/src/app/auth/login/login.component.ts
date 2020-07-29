import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder,FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { ToastrService } from 'ngx-toastr';
import {AuthGuard} from 'app/guard/auth.guard'
import {DataService} from './../../shared/service/data.service';

import { UserLoggedIn } from '@core/services';
import { APP_CONST } from '@app/app.constant';
import { DropdownOption } from '@core/index';
import { getFormAttributeAsFormControl } from '@core/util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm: FormGroup;
  public loading = false;
  public submitted = false;
  public role : string = 'student';
  public subject :string ;
  public member :any;
  public swipeInData:any;
  public haveAcc:boolean=true;  
  totalTopics: any;
  isTeacher : boolean=false;
  topicList: DropdownOption[] = [];
  contactTypeList: DropdownOption[] = [
    {
        value: 'teacher',
        label: 'Teacher'
    },
    {
        value: 'student',
        label: 'Student'
    },
];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private auth: AuthGuard,
    private dataService:DataService,
    private toaster:ToastrService,    
    private userLoggedIn: UserLoggedIn
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, this.whiteSpaceValidator]],
      fName: ['', [Validators.required, this.whiteSpaceValidator]],
      lName: ['', [Validators.required, this.whiteSpaceValidator]],
      email: ['', [Validators.required, this.whiteSpaceValidator]],
      mobile: [null], 
      password: ['', [Validators.required, this.whiteSpaceValidator]]
    });
    this.onChanges();
  }

  onChanges() {
  }

  ngOnDestroy() {
    }

  get f() { return this.loginForm.controls; }

  private whiteSpaceValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control && control.value && !control.value.replace(/\s/g, '').length) {
        control.setValue('');
        return { isOnlywhiteSpace: true };
    }
    return null;
  }
  get discussionFormGroup_contactType(): FormControl {
    return getFormAttributeAsFormControl(this.loginForm, 'contactType');
  }
  public selectionChanged(value: string, dropdownFor: string) {
    switch(dropdownFor){
      case 'role': {
        this.role = value;
        if(value == 'teacher'){
          this.getTopics();          
          this.isTeacher = true;
        }
        else{
          this.subject = '';
          this.isTeacher = false;
        }
      }
      break;
      case 'topic': {
        this.subject = value;
      }
      break;
    }
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
    });
  }
  onSubmit() {
    this.loading = true;     
    if(!this.haveAcc){
      this.dataService.getMember(this.f.username.value).subscribe(data => {
        this.loading = false;
        this.member = data;
        if(this.member.length>0){
          this.toaster.error('User name Taken', APP_CONST.toasterMsgType.error);
        }else{          
              this.dataService.getDuplicateMail(this.f.email.value).subscribe(data => {
              this.member = data;
              if(this.member.length>0){
                this.toaster.error('Email exists', APP_CONST.toasterMsgType.error);
              }else{ 
                  const user ={
                    role : this.role,
                    subject :this.subject,
                    userName : this.f.username.value ,
                    fName : this.f.fName.value,
                    lName : this.f.lName.value,
                    email : this.f.email.value ,
                    mobile : this.f.mobile.value ,
                    password : CryptoJS.AES.encrypt(this.f.password.value, 'mypassword').toString()
                  }
                  this.dataService.register(user).subscribe(data => {
                  this.loading = false;
                  localStorage.setItem('userInfo',JSON.stringify(data));
                  this.router.navigate([APP_CONST.routes.home]);            
                  this.userLoggedIn.setUserLoggedIn(true); 
                  this.fillTimeSheet();
                },
                  error => {
                    this.loading = false;
                    this.toaster.error('There is some problem in API');
                  });  
              }      
            });
        
        }

      }); 
    }
    else{
      this.dataService.getMember(this.f.username.value).subscribe(data => {
        this.loading = false;
        this.member = data;
        if(this.member.length>0){
          if(CryptoJS.AES.decrypt(this.member[0].password, 'mypassword').toString(CryptoJS.enc.Utf8)==this.f.password.value){
            localStorage.setItem('userInfo',JSON.stringify(this.member[0]));
            this.router.navigate([APP_CONST.routes.home]);                       
            this.userLoggedIn.setUserLoggedIn(true); 
            this.fillTimeSheet();
          }else{
            this.toaster.error("Incorrect Password",APP_CONST.toasterMsgType.error);
          }
        }else{
          this.toaster.error("User Does Not Exists Please Register",APP_CONST.toasterMsgType.error);
        }
      });
    }
  }

  fillTimeSheet(){
      var today = new Date().toISOString().substring(0, 10).toString();
      this.dataService.getSwipeIn(this.f.username.value,today).subscribe(data => {
      this.swipeInData = data;
      if(this.swipeInData.length>0){
          var newLogin = new Date().toISOString().replace('T', ' ').substring(0, 11) + new Date().toTimeString().substring(0, 8);
          var oldLogin = this.swipeInData[0].logout;
          var diff = new Date(newLogin).getTime() - new Date(oldLogin).getTime();
          var days = Math.floor(diff / (60 * 60 * 24 * 1000));
          var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
          var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
          var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
          var idle = this.swipeInData[0].idle.split(" ");
          var iH = parseInt(idle[0].replace("h", " ")) + hours;
          var iM = parseInt(idle[1].replace("m", " ")) + minutes;

          const swipeOut ={
            "idle" : iH+'h'+ ' '+iM+'m',
            "id" :this.swipeInData[0].id
          }  
          this.dataService.swipeOut(swipeOut).subscribe(data => {
            localStorage.setItem('loginObj',JSON.stringify(data));
          });
      }else{
        const timesheet = {
          today:new Date().toISOString().substring(0, 10),
          idle :'0h 0m',
          username : this.f.username.value ,
          login :new Date().toISOString().replace('T', ' ').substring(0, 11) + new Date().toTimeString().substring(0, 8),
          logout:new Date().toISOString().replace('T', ' ').substring(0, 11) + new Date().toTimeString().substring(0, 8)
         }
         this.dataService.swipeIn(timesheet).subscribe(swipeindata => {
          localStorage.setItem('loginObj',JSON.stringify(swipeindata));
         });

      }
    });

  }
  public haveAccount(){
    this.loginForm.reset();
    this.haveAcc = !this.haveAcc;
  }
}
