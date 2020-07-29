import { Component,NgZone, OnInit,TemplateRef,ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import {DataService} from './../../shared/service/data.service'
import { APP_CONST } from '@app/app.constant';
import { DropdownOption} from '@core/index';
import { ToastrService } from 'ngx-toastr';
import {
  slideInOutAnimation,
  showHideAnimation
} from 'assets/animations/animations';

declare const annyang: any;

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
  animations: [slideInOutAnimation, showHideAnimation]
})
export class InboxComponent implements OnInit {

 
  @ViewChild('template', {static: false}) templateRef: TemplateRef<any>; 
  
  voiceActiveSectionDisabled: boolean = true;
	voiceActiveSectionError: boolean = false;
	voiceActiveSectionSuccess: boolean = false;
  voiceActiveSectionListening: boolean = false;
  isListenting:boolean = false;
  showText :boolean = false;
  messege: any;

  memberlist:any;
  everyOne: DropdownOption[] = []
  listinbox :any = [];
  userInfo :any;  
  loadCount:number = 20;
  shortName :string;
  isPencilCicked :boolean= false;
  member:string;
  inboxId :number;
  selectedTabIndex:number=0;
  sortFor :string='All inbox';
  constructor(
    private ngZone: NgZone,
    private router: Router,private dataService:DataService, private toaster:ToastrService,
  ) { }

  ngOnInit() {
   
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.getinbox();
    this.getMembers();

  }
  

public tabSelected(tab:number){
  this.selectedTabIndex=tab;
  if(tab==1){
    this.sortFor = 'My inbox';
  }else{
    this.sortFor = 'All inbox';
  }
  this.getinbox();
}
getMembers(){
this.dataService.getEveryone().subscribe(data => {
  this.memberlist = data;
  this.memberlist =this.memberlist.filter(x=>x.userName!==this.userInfo.userName)
  this.memberlist.forEach(element => {
    this.everyOne.push({
      value: element.userName,
      label: element.fName +' '+  element.lName +'('+element.role+')'
  })
  }); 
  this.member= this.everyOne[0].value;       
});
}


public getinbox(){
  this.dataService.getInbox(this.userInfo.userName).subscribe(data => {
    this.listinbox = data;
    this.listinbox.forEach(element => {
      element.shortName = this.getAskedByShortName(element.fromname)      
    });

  });
}
deleteFile(inbox){
}
public willReply(){
  this.isPencilCicked = !this.isPencilCicked;
  if(this.isPencilCicked){    
  this.initializeVoiceRecognitionCallback();
  }else{
    this.isListenting = false;
  this.showText = false;
  this.voiceActiveSectionDisabled = true;
  this.voiceActiveSectionError = false;
  this.voiceActiveSectionSuccess = false;
  this.voiceActiveSectionListening = false;
  this.messege = undefined;

  if(annyang){
    annyang.abort();
  }
  }
}
initializeVoiceRecognitionCallback(): void {
  annyang.addCallback('error', (err) => {
    if(err.error === 'network'){
      this.messege = "Internet is require";
      annyang.abort();
      this.ngZone.run(() => this.voiceActiveSectionSuccess = true);
    } else if (this.messege === undefined) {
      this.ngZone.run(() => this.voiceActiveSectionError = true);
      annyang.abort();
    }
  });

  annyang.addCallback('soundstart', (res) => {
    this.ngZone.run(() => this.voiceActiveSectionListening = true);
  });

  annyang.addCallback('end', () => {
    if (this.messege === undefined) {
      this.ngZone.run(() => this.voiceActiveSectionError = true);
      annyang.abort();
    }
  });

  annyang.addCallback('result', (userSaid) => {
    this.ngZone.run(() => this.voiceActiveSectionError = false);

    let queryText: any = userSaid[0];
    this.isListenting = false;
    annyang.abort();

    this.messege = queryText;

    this.ngZone.run(() => this.voiceActiveSectionListening = false);
    this.ngZone.run(() => this.voiceActiveSectionSuccess = true);
  });
}
startVoiceRecognition(): void {
  this.voiceActiveSectionDisabled = false;
  this.voiceActiveSectionError = false;
  this.voiceActiveSectionSuccess = false;
  this.messege = undefined;
  this.isListenting = true;
  this.showText = true;
  if (annyang) {
    let commands = {
      'demo-annyang': () => { }
    };

    annyang.addCommands(commands);

    this.initializeVoiceRecognitionCallback();

    annyang.start({ autoRestart: false });
  }
}

public getShortName(userInfo){
return userInfo.fName[0] + userInfo.lName[0]
}
public getAskedByShortName(fullName){
  var shortName = fullName.split(" ");
  return (shortName[0]?shortName[0][0] :' ') + (shortName[1]? shortName[1][0]:' ');
}
public selectionChanged(value: string, dropdownFor: string) {      
  switch (dropdownFor) {
    case 'member':
      this.member = value;
      break;
  }
}
startRecord(){

}
send(){
  if(this.messege==''||!this.messege){
    this.toaster.error('Please write something', 'Error');
  }
  const msg = {
    fromname:this.userInfo.fName +' '+this.userInfo.lName,
    fromrole : this.userInfo.role,
    fromemail :this.userInfo.email,
    date: new Date().getDate() +"/"+new Date().getMonth() +"/"+new Date().getFullYear(),
    tousername :this.member,
    body : this.messege
  };
  this.dataService.send(msg).subscribe(data => {
    this.toaster.success('Messege Sent', 'Success'); 
    this.isPencilCicked=!this.isPencilCicked;
    this.messege ='';     
  });
}

}


