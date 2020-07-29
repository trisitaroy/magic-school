import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl ,Validators,AbstractControl} from '@angular/forms';
import {DataService} from '../../../shared/service/data.service'
import { ToastrService } from 'ngx-toastr';
import {
  getFormAttributeAsFormGroup,
  getFormAttributeAsFormControl,
} from '@core/util';

import { DropdownOption } from '@core/index';
import { ActivatedRoute ,Router} from '@angular/router';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit, AfterViewInit {

  public myProfileForm: FormGroup;
  myData:any;
  subject:string='geo';
  totalTopics: any;
  isTeacher : boolean=false;
  topicList: DropdownOption[] = [];

  public timeSheet:any;
  public performanceList :any;
  public userInfo :any; 
  public monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
   "July", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];
  public weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  public dayDetail :any=[];

  

  constructor(private router:Router,
    private toaster:ToastrService,private formBuilder: FormBuilder, private route: ActivatedRoute,private dataService:DataService) { }

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.getMyTimeSheet();
    this.createMyProfileForm();
    this.getMyContactInfo();
    this.getTopics();
    this.getProfileData();
  }

  ngAfterViewInit() {
  }
  getProfileData(){
    if(this.userInfo.role=='student'){
      this.dataService.getProfileData(this.userInfo.userName).subscribe(data => {
        this.performanceList = data;
        if(this.performanceList.length>0){
          this.performanceList.sort((a, b) => parseFloat(b.id) - parseFloat(a.id));  
        }
      });
    }else{
      this.dataService.getStudentData(this.userInfo.userName).subscribe(data => {
        this.performanceList = data;
        if(this.performanceList.length>0){
          this.performanceList.sort((a, b) => parseFloat(b.id) - parseFloat(a.id));  
        }
      });

    }
   
  }
  getMyTimeSheet(){
    var today = new Date().toISOString().substring(0, 10).toString();
    this.dataService.getTimeSheet(this.userInfo.userName).subscribe(data => {      
      this.timeSheet = data
     // this.timeSheet= this.timeSheet.filter(t=>t.today !== today);
      this.timeSheet.forEach(element => {
        var loginHours = new Date(element.login).getHours();        
        var loginMin = new Date(element.login).getMinutes();
        
        var logoutHours = new Date(element.logout).getHours();
        var logoutMin = new Date(element.logout).getMinutes();
        
        var dayNight = 'AM';
        if(logoutHours >12){
          logoutHours = logoutHours - 12;
          dayNight ='PM'
        }
        if(loginHours >12){
          loginHours = loginHours - 12;
          dayNight ='PM'
        }
        var diff = new Date(element.logout).getTime() - new Date(element.login).getTime();
        var days = Math.floor(diff / (60 * 60 * 24 * 1000));
        var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
        var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
        var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));    
        const obj ={
          header : this.weekday[new Date(element.today).getDay()] + ', ' 
          +  new Date(element.today).getDate() +' ' + this.monthNames[new Date(element.today).getMonth()],
          totalTime: hours +'h' +' ' + minutes +'m',          
          login :  loginHours +':' + loginMin + ' ' + dayNight,
          logout : logoutHours +':' + logoutMin + ' ' + dayNight,
          idle : element.idle
        }
        this.dayDetail.push(obj);        
      });
    });
  }
  getMyContactInfo(){
    this.theBasicsFromGroup_role.patchValue(this.userInfo.role),
    this.theBasicsFromGroup_firstName.patchValue(this.userInfo.fName);
    this.theBasicsFromGroup_lastName.patchValue(this.userInfo.lName);
    this.theBasicsFromGroup_workPhone.patchValue(this.userInfo.mobile);
    this.theBasicsFromGroup_email.patchValue(this.userInfo.email);
    this.subject =this.userInfo.subject;
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
  private createMyProfileForm(): void {
    this.myProfileForm = this.formBuilder.group({
      contactInfoFormGroup: this.formBuilder.group({
        firstName: ['',[Validators.required, this.whiteSpaceValidator]],
        lastName: ['', [Validators.required, this.whiteSpaceValidator]],
        email: ['', [Validators.required, this.whiteSpaceValidator]],
        workPhone: ['', []],
        role: ['', []],
        sub: ['', []]
      })
    });
  //  this.myProfileForm.disable();
    this.contactInfoFormGroup.controls['email'].disable();
    this.contactInfoFormGroup.controls['role'].disable();
  }
  private whiteSpaceValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control && control.value && !control.value.replace(/\s/g, '').length) {
        control.setValue('');
        return { isOnlywhiteSpace: true };
    }
    return null;
  }

  /** Form Group Instances Start */
  get contactInfoFormGroup(): FormGroup {
    return getFormAttributeAsFormGroup(this.myProfileForm, 'contactInfoFormGroup');
  }
 
  /** Form Group Instances end */

  /** Form Control Instances Start */
  get theBasicsFromGroup_firstName(): FormControl {
    return getFormAttributeAsFormControl(this.contactInfoFormGroup, 'firstName');
  }
  get theBasicsFromGroup_lastName(): FormControl {
    return getFormAttributeAsFormControl(this.contactInfoFormGroup, 'lastName');
  }
  get theBasicsFromGroup_email(): FormControl {
    return getFormAttributeAsFormControl(this.contactInfoFormGroup, 'email');
  }
  get theBasicsFromGroup_workPhone(): FormControl {
    return getFormAttributeAsFormControl(this.contactInfoFormGroup, 'workPhone');
  }
  get theBasicsFromGroup_role(): FormControl {
    return getFormAttributeAsFormControl(this.contactInfoFormGroup, 'role');
  }
  /** Form Control Instances End */

  public selectionChanged(value: string, dropdownFor: string) {
    switch(dropdownFor){
      case 'topic': {
        this.subject = value;
      }
      break;
    }
  }

  public saveChanges()  {
    const user ={
      role : this.userInfo.role,
      userName : this.userInfo.userName,
      email : this.userInfo.email,
      password : this.userInfo.password,     
      subject :this.subject,
      id: this.userInfo.id,
      fName : this.theBasicsFromGroup_firstName.value,
      lName : this.theBasicsFromGroup_lastName.value,
      mobile : this.theBasicsFromGroup_workPhone.value ,
     }
     this.dataService.updateMember(user,this.userInfo.id).subscribe(data => {
      localStorage.setItem('userInfo',JSON.stringify(user));
      
      this.toaster.success('Updated your info', 'Success');
    },
      error => {
        this.toaster.error('Error Occured', 'Error');
      });
  }

  public cancelChanges(): void {
    this.router.navigate(['home']);   
  }

  
}
