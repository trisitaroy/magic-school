import { Component, OnInit,NgZone, TemplateRef,ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { slideInOutAnimation, showHideAnimation} from 'assets/animations/animations';
import {DataService} from './../../../shared/service/data.service'
import { Router } from '@angular/router';
import { APP_CONST } from '@app/app.constant';
import { OverlayConfig, DropdownOption } from '@core/index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MatTabChangeEvent } from '@angular/material';

declare const annyang: any;
@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  animations: [slideInOutAnimation, showHideAnimation]
})
export class DocumentsComponent implements OnInit {
  voiceActiveSectionDisabled: boolean = true;
	voiceActiveSectionError: boolean = false;
	voiceActiveSectionSuccess: boolean = false;
  voiceActiveSectionListening: boolean = false;
  isListenting:boolean = false;
  showText :boolean = false;
  voiceText: any;
  selectedIndex :number =0;
  modalRef: BsModalRef;
  userInfo :any; 
  @ViewChild('template', {static: false}) templateRef: TemplateRef<any>;
  file :string;
  inputfile :any;
  fileName :string;
  loader:boolean= true;
  public listFiles:any=[];
  public listComment :any=[];
  public listDocumentInbox = []
  public noOfNotification = 10;
  public overlayTemplate: TemplateRef<HTMLElement>;
  public isShowOverlay = false;
  public overlayOptions: OverlayConfig = {
    backdropClose: true,
    showFooter: true,
  };
  public noteForm: FormGroup;
  public listNoteType: DropdownOption[] = [
    {
      value: 'Geography',
      label: 'Geography'
    },
    {
      value: 'Physics',
      label: 'Physics'
    }
  ];
  ilanguageList:DropdownOption[] = [];
  olanguageList:DropdownOption[] = [];
  ilang:any=[];
  detecedlanglist:any=[];
  olang:any=[];
  actualtext:string;
  translatedtext:string='';
  detectedlang:string;
  translatedList:any=[];
  models:any=[];
  avlModel:any=[];
  constructor(
    private router: Router,
    private ngZone: NgZone,
    private formBuilder: FormBuilder,
    public modalService: BsModalService,
    private dataService:DataService
  ) { }

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.createNoteForm();
    this.getFiles();
    this.getLang();
    this.getModels();
  }
 getFiles(){
  this.dataService.getFiles().subscribe(data => {
    this.listFiles = data;
    if(this.listFiles.length>0){
      this.listFiles.forEach(element => {
        this.dataService.getFileComments(element.id).subscribe(data => {
          this.listComment = data;
          element.totalAns = this.listComment.length;         
          this.listComment.sort((a, b) => parseFloat(b.id) - parseFloat(a.id));
          element.comments = this.listComment; 
        });
      });
    }
    this.listFiles.sort((a, b) => parseFloat(b.id) - parseFloat(a.id));
  });
  }
getLang(){
  this.dataService.getLang().subscribe(data=>{
    this.ilang=data;
    this.ilang.languages.forEach(element => {
      this.ilanguageList.push(
        {
          label: element.name,
          value: element.language
        }
      )                
    });
  });
}
getModels(){
  this.dataService.getModels().subscribe(data=>{
    this.models = data;
  });
}
  openModal(template: TemplateRef<any>) {
      const user = {
          id: 10
        };
      this.modalRef = this.modalService.show(template, {
        initialState : user
      });
    }
 
 public fileChange(element) {
  this.inputfile = element.target.files;
  }
 public saveFile(){
   var obj =
  {
    name: this.fileName?this.fileName:this.inputfile[0].name,
    content: btoa(unescape(encodeURIComponent(this.file))),
    uploadedBy: this.userInfo.userName,
    uploadedFrom: 'Upload File',
    uploadedDate: new Date().getDate() +"/"+new Date().getMonth() +"/"+new Date().getFullYear(),
    disableAudio:false,
    showTranslation: false,
    showAudio: false,
    showNotes: false,
    showAddNoteBtn:false,
    type:'',
     comments: [
     ]
  };
      const blob = new Blob(this.inputfile, { type: this.inputfile[0].type }); 
      let reader=new FileReader();
      reader.onload  = (e) => {
        var b64 = reader.result.toString().replace(/^data:.+;base64,/, '');
        obj.content= b64;
        obj.type = this.inputfile[0].type;
        if(obj.type!== 'text/plain')
        obj.disableAudio = true;
        if(this.inputfile[0].size < 5000000){
          this.dataService.createFile(obj).subscribe(data => {   
            this.getFiles();
            this.modalRef.hide();
            });
        }
        else{
          alert("Max file size 5mb")
        }
    }
    reader.readAsDataURL(blob);      

 }
 public createFile(){
  var obj =
 {
  name: this.fileName?this.fileName:'File',
  content: btoa(unescape(encodeURIComponent(this.file))),
  uploadedBy: this.userInfo.userName,
  uploadedFrom: 'Create File',
  uploadedDate: new Date().getDate() +"/"+new Date().getMonth() +"/"+new Date().getFullYear(),
  disableAudio:false,
  showAudio: false,
  showTranslation: false,
  showNotes: false,
  showAddNoteBtn:false,
  type:'text/plain',
   comments: [
   ]
 }; 
  
  this.dataService.createFile(obj).subscribe(data => { 
    this.getFiles();
  this.modalRef.hide();
  });
 
}

public createFileFromVoice(){
  this.file = this.voiceText;
  var obj =
 {
  name: 'VoiceNote By '+this.userInfo.userName,
  content: btoa(this.file),
  uploadedBy: this.userInfo.userName,
  uploadedFrom: 'Create File',
  uploadedDate: new Date().getDate() +"/"+new Date().getMonth() +"/"+new Date().getFullYear(),
  disableAudio:false,
  showTranslation: false,
  showAudio: false,
  showNotes: false,
  showAddNoteBtn:false,
  type:'text/plain',
   comments: [
   ]
 }; 
  
  this.dataService.createFile(obj).subscribe(data => { 
    this.closeVoiceRecognition();
    this.getFiles();
    this.selectedIndex = 0;
  });
 
}
 public deleteFile(documents){   
    this.dataService.deleteFile(documents.id).subscribe(data => { 
  this.getFiles();
  });
 }
 public openFile(documents){
  const linkSource = 
  'data:'+documents.type+';base64,' + documents.content;
  const downloadLink = document.createElement("a");
  const fileName = documents.name;

  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
}
downloadtranslated(){
  const linkSource = 
  'data:text/plain;base64,' + btoa(unescape(encodeURIComponent(this.translatedtext)));
  const downloadLink = document.createElement("a");
  const fileName ='Translated Note';

  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
  this.translatedtext='';
}
  public toggleNoteOrMessage(document, toggleFor?: string) {
    switch (toggleFor) {
      case 'audio':
      var text = atob(document.content);  
      var voice ='en-US_AllisonV3Voice'
      document.audio =   APP_CONST.WATSON_URL+"/v3/synthesize?text="+text+"&voice="+voice+"&download=true&accept=audio%2Fmp3";
      document.showNotes = false;
      document.showAudio = !document.showAudio; 
      document.showTranslation =false;
      break;
      case 'note':
        document.showAudio = false;
        document.showTranslation = false
        document.showNotes = !document.showNotes;
        this.noteForm.reset();
        this.listDocumentInbox.map((doc) => {
          doc.showAddNoteBtn = true;
          if (doc !== document) {
            doc.showNotes = false;
          }
        });
        break;
        case 'translate': 
          this.translatedtext ='';
          document.showAudio = false;
          document.showNotes = false;
          document.showTranslation = !document.showTranslation;
          if(document.showTranslation){            
           this.actualtext = decodeURIComponent(escape(atob(document.content)));
           var body={
             text : this.actualtext
           }
           this.dataService.detectedlang(body).subscribe(data=>{
             this.detecedlanglist=data;
             this.detectedlang= this.detecedlanglist.languages[0].language;
             this.olanguageList=this.ilanguageList.filter(x=>x.value!==this.detectedlang);
           })            
          }
          break;
      default:
        document.showAudio = false;
        document.showNotes = false;
        break;
    }
  }
  public selectionChanged(value: string, dropdownFor: string) {      
    switch (dropdownFor) {
      case 'lang':
        var modelId =this.detectedlang+'-'+value;
        this.avlModel = this.models.models.filter(x=>x.model_id==modelId)
        if(this.avlModel.length==0)
        {
          alert('Choose other language');          
          return;
        }
        var body={
          modelId : modelId,
          text : this.actualtext
        }
        this.dataService.translate(body).subscribe(data=>{
          this.translatedList=data;
          this.translatedtext = this.translatedList.translations[0].translation
        },
        error => {
          alert('Trial Limit over');
        }); 
        break;
    }
  }

  public showOverlay(template: TemplateRef<HTMLElement>, document: any): void {
    this.overlayTemplate = template;
    this.isShowOverlay = true;
  }

  public overlayClosed(value: boolean): void {
    this.isShowOverlay = !value;
  }

  public savecomment(document): void {
    document.comments.unshift(
      {
        owner: this.getShortName(this.userInfo.userName),
        text: this.noteForm.get('note').value,
        Date: new Date().getDate() +"/"+new Date().getMonth() +"/"+new Date().getFullYear(),
        ownerFullName: this.userInfo.userName,
        role :this.userInfo.role,
      }
    );
    const commentObj = {
      fileid: document.id,
      text: this.noteForm.get('note').value,
      ownerFullName: this.userInfo.userName,
      owner: this.getShortName(this.userInfo.userName),
      role :this.userInfo.role,
      Date: new Date().getDate() +"/"+new Date().getMonth() +"/"+new Date().getFullYear()
    };
    this.dataService.addFileComment(commentObj).subscribe(data => { 
      document.showAddNoteBtn = true;
      this.noteForm.reset();
    });
   
  }

  public getShortName(name:string){
    return "AD"
    }

  private createNoteForm() {
    this.noteForm = this.formBuilder.group({
      notesType: [''],
      note: ['', [Validators.required]]
    });
  }  
  public addNote(document): void {
    document.showAddNoteBtn = false;
  }

  public cancelAddingNote(document): void {
    document.showAddNoteBtn = true;
     this.noteForm.reset();
  }

public tabChanged(tab:MatTabChangeEvent){
  this.selectedIndex = tab.index;
  if(tab.index==1){
    this.initializeVoiceRecognitionCallback();
  }
}


initializeVoiceRecognitionCallback(): void {
  annyang.addCallback('error', (err) => {
    if(err.error === 'network'){
      this.voiceText = "Internet is require";
      annyang.abort();
      this.ngZone.run(() => this.voiceActiveSectionSuccess = true);
    } else if (this.voiceText === undefined) {
      this.ngZone.run(() => this.voiceActiveSectionError = true);
      annyang.abort();
    }
  });

  annyang.addCallback('soundstart', (res) => {
    this.ngZone.run(() => this.voiceActiveSectionListening = true);
  });

  annyang.addCallback('end', () => {
    if (this.voiceText === undefined) {
      this.ngZone.run(() => this.voiceActiveSectionError = true);
      annyang.abort();
    }
  });

  annyang.addCallback('result', (userSaid) => {
    this.ngZone.run(() => this.voiceActiveSectionError = false);

    let queryText: any = userSaid[0];
    this.isListenting = false;
    annyang.abort();

    this.voiceText = queryText;

    this.ngZone.run(() => this.voiceActiveSectionListening = false);
    this.ngZone.run(() => this.voiceActiveSectionSuccess = true);
  });
}

startVoiceRecognition(): void {
  this.voiceActiveSectionDisabled = false;
  this.voiceActiveSectionError = false;
  this.voiceActiveSectionSuccess = false;
  this.voiceText = undefined;
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

closeVoiceRecognition(): void {
  this.isListenting = false;
  this.showText = false;
  this.voiceActiveSectionDisabled = true;
  this.voiceActiveSectionError = false;
  this.voiceActiveSectionSuccess = false;
  this.voiceActiveSectionListening = false;
  this.voiceText = undefined;

  if(annyang){
    annyang.abort();
  }
}

}
