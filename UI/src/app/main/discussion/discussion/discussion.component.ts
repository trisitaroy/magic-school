import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {DataService} from './../../../shared/service/data.service'
import { APP_CONST } from '@app/app.constant';
import { OverlayConfig, DropdownOption } from '@core/index';
import {
  slideInOutAnimation,
  showHideAnimation
} from 'assets/animations/animations';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss'],
  animations: [slideInOutAnimation, showHideAnimation]
})
export class DiscussionComponent implements OnInit {

 
  isCardView = false; 
  listDiscussion :any = [];
  listComment : any=[];
  listLikes :any=[];
  listFewComments:any=[];
 
  sortModeList = [
    {
      label: 'All'
    },
    {
      label: 'My'
    }
  ];
  userInfo :any;  
  notyId:any;
  loadCount:number = 20;
  loadComment:number=2;
  isPencilCicked :boolean= false;
  discussionId :number;
  comment:string;
  selectedTabIndex:number=0;
  sortFor :string='All Discussion';  
  olanguageList:DropdownOption[] = [];  
  models:any=[];  
  avlModel:any=[];
  ilang:any=[];
  translatedList:any=[];

  constructor(
    private router: Router,private dataService:DataService
  ) { }

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.getDiscussion();    
    this.getLang();
    this.getModels();
  }
  getLang(){
    this.dataService.getLang().subscribe(data=>{
      this.ilang=data;
      this.ilang.languages.forEach(element => {
        this.olanguageList.push(
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
  public selectionChanged(value: string, dropdownFor: string,discussion:any) {      
    switch (dropdownFor) {
      case 'lang':
        var modelId ='en-'+value;
        this.avlModel = this.models.models.filter(x=>x.model_id==modelId)
        if(this.avlModel.length==0)
        {
          alert('Choose other language');          
          return;
        }
        var body={
          modelId : modelId,
          text : discussion.question
        }
        this.dataService.translate(body).subscribe(data=>{
          discussion.isTranslate=false;
          this.translatedList=data;
          discussion.question = this.translatedList.translations[0].translation
        },
        error => {
          alert('Trial Limit over');
        }); 
        break;
    }
  }
public tabSelected(tab:number){
  this.selectedTabIndex=tab;
  if(tab==1){
    this.sortFor = 'My Discussion';
  }else{
    this.sortFor = 'All Discussion';
  }
  this.getDiscussion();
}

public getDiscussion(questionId? ,showMoreComment?,liked?){  
  this.notyId = localStorage.getItem('notyId')
  this.comment ='';
  this.isPencilCicked = false;
  this.listFewComments =[];
  if(!this.notyId){
    if( this.sortFor === 'My Discussion'){
    this.dataService.getMyDiscussion(this.userInfo.fName +' '+this.userInfo.lName).subscribe(data => {
      this.listDiscussion = data;
      if(this.listDiscussion.length>0){
        this.listDiscussion.forEach(element => {
          element.shortName =this.getAskedByShortName(element.askedBy);
          this.dataService.getComments(element.id).subscribe(data => {
            this.listComment = data;
            element.totalAns = this.listComment.length;         
            this.listComment.sort((a, b) => parseFloat(b.id) - parseFloat(a.id));
            if(!questionId || !showMoreComment){
              if(this.listComment.length >this.loadComment)
              element.showAllComment = true;
              else
             element.showAllComment = false;
              this.listFewComments =this.listComment.slice(0, this.loadComment); 
              element.ansList = this.listFewComments; 
            }
            else{
              if(questionId ===element.id){
                element.ansList = this.listComment; 
                element.showAllComment = false;              
              }else{              
                this.listFewComments =this.listComment.slice(0, 2); 
                element.ansList = this.listFewComments; 
                if(this.listFewComments >this.loadComment)
                element.showAllComment = true;
                else
                element.showAllComment = false;
              }
  
            }   
          }); 
          if(liked && liked === true && element.id === questionId){
            const likedObj ={
              "totalLikes" : element.totalLikes + 1,
              "id" : questionId
            }          
            element.totalLikes = element.totalLikes + 1
            this.dataService.updatedPost(likedObj).subscribe(data => {
            });
          }
          this.dataService.getLikedPost(element.id,this.userInfo.userName).subscribe(data => {
            this.listLikes = data;
            if(this.listLikes.length>0)
            element.liked = true;
          });
        });      
      }   
      this.listDiscussion.sort((a, b) => parseFloat(b.id) - parseFloat(a.id));    
    });
    }else{
      this.dataService.getDiscussion().subscribe(data => {
        this.listDiscussion = data;
        if(this.listDiscussion.length>0){
          this.listDiscussion.forEach(element => {
            element.shortName =this.getAskedByShortName(element.askedBy);
            this.dataService.getComments(element.id).subscribe(data => {
              this.listComment = data;
              element.totalAns = this.listComment.length;         
              this.listComment.sort((a, b) => parseFloat(b.id) - parseFloat(a.id));
              if(!questionId || !showMoreComment){
                if(this.listComment.length >this.loadComment)
                element.showAllComment = true;
                else
              element.showAllComment = false;
                this.listFewComments =this.listComment.slice(0, this.loadComment); 
                element.ansList = this.listFewComments; 
              }
              else{
                if(questionId ===element.id){
                  element.ansList = this.listComment; 
                  element.showAllComment = false;              
                }else{              
                  this.listFewComments =this.listComment.slice(0, 2); 
                  element.ansList = this.listFewComments; 
                  if(this.listFewComments >this.loadComment)
                  element.showAllComment = true;
                  else
                  element.showAllComment = false;
                }
    
              }   
            }); 
            if(liked && liked === true && element.id === questionId){
              const likedObj ={
                "totalLikes" : element.totalLikes + 1,
                "id" : questionId
              }          
              element.totalLikes = element.totalLikes + 1
              this.dataService.updatedPost(likedObj).subscribe(data => {
              });
            }
            this.dataService.getLikedPost(element.id,this.userInfo.userName).subscribe(data => {
              this.listLikes = data;
              if(this.listLikes.length>0)
              element.liked = true;
            });
          });      
        }   
        this.listDiscussion.sort((a, b) => parseFloat(b.id) - parseFloat(a.id));    
      });
    }  
  }else{
    this.dataService.getDiscussionById(parseInt(this.notyId)).subscribe(data => {
      localStorage.removeItem("notyId");
      this.listDiscussion = data;
      if(this.listDiscussion.length>0){
        this.listDiscussion.forEach(element => {
          element.shortName =this.getAskedByShortName(element.askedBy);
          this.dataService.getComments(element.id).subscribe(data => {
            this.listComment = data;
            element.totalAns = this.listComment.length;         
            this.listComment.sort((a, b) => parseFloat(b.id) - parseFloat(a.id));
            if(!questionId || !showMoreComment){
              if(this.listComment.length >this.loadComment)
              element.showAllComment = true;
              else
            element.showAllComment = false;
              this.listFewComments =this.listComment.slice(0, this.loadComment); 
              element.ansList = this.listFewComments; 
            }
            else{
              if(questionId ===element.id){
                element.ansList = this.listComment; 
                element.showAllComment = false;              
              }else{              
                this.listFewComments =this.listComment.slice(0, 2); 
                element.ansList = this.listFewComments; 
                if(this.listFewComments >this.loadComment)
                element.showAllComment = true;
                else
                element.showAllComment = false;
              }
  
            }   
          }); 
          if(liked && liked === true && element.id === questionId){
            const likedObj ={
              "totalLikes" : element.totalLikes + 1,
              "id" : questionId
            }          
            element.totalLikes = element.totalLikes + 1
            this.dataService.updatedPost(likedObj).subscribe(data => {
            });
          }
          this.dataService.getLikedPost(element.id,this.userInfo.userName).subscribe(data => {
            this.listLikes = data;
            if(this.listLikes.length>0)
            element.liked = true;
          });
        });      
      }   
      this.listDiscussion.sort((a, b) => parseFloat(b.id) - parseFloat(a.id));    
    });

  }
  
}
deleteFile(discussion){
  this.dataService.deleteDiscussion(discussion.id).subscribe(data => { 
    this.getDiscussion();
    });
}
public loadmore(){
  this.loadCount = this.loadCount + 2;
}
public loadMoreComment(questionId:number){
  this.loadComment = this.loadComment+2;
  this.getDiscussion(questionId,true);
}
public willReply(discussionId:number){
  this.isPencilCicked = true;
  this.discussionId = discussionId
}

public addComment(discussionId:number,owner:string){
  const commentObj = {
    questionid: discussionId,
    content: this.comment,
    name: this.userInfo.userName,
    shortName: this.getShortName(this.userInfo),
    role :this.userInfo.role,
    Date: new Date().getDate() +"/"+new Date().getMonth() +"/"+new Date().getFullYear()
  };
  this.dataService.addComment(commentObj).subscribe(data => {   
    const noty={
      fromname:this.userInfo.userName,
      fromrole : this.userInfo.role,
      date: new Date().getDate() +"/"+new Date().getMonth() +"/"+new Date().getFullYear(),
      tousername :owner,
      body : this.userInfo.fName +' '+this.userInfo.lName +' has commented on your discussion',
      questionid : discussionId
    }
    this.dataService.postNoty(noty).subscribe(data=>{         
      this.getDiscussion();
    });
  });
}
public getShortName(userInfo){
return userInfo.fName[0] + userInfo.lName[0]
}
public getAskedByShortName(fullName){
  var shortName = fullName.split(" ");
  return (shortName[0]?shortName[0][0] :' ') + (shortName[1]? shortName[1][0]:' ');
}
translate(discussionId:number){
  this.listDiscussion.forEach(element => {
    if(element.id===discussionId){
      element.isTranslate = true
    }
  });
}
public likePost(discussionId:number,owner:string){
  const likeObj = {
    questionid: discussionId,
    userName: this.userInfo.userName
  };
  this.dataService.likePost(likeObj).subscribe(data => { 
    if(data){ 
      const noty={
        fromname:this.userInfo.userName,
        fromrole : this.userInfo.role,
        date: new Date().getDate() +"/"+new Date().getMonth() +"/"+new Date().getFullYear(),
        tousername :owner,
        body : this.userInfo.fName +' '+this.userInfo.lName +' has Liked your discussion',
        questionid : discussionId
      }
      this.dataService.postNoty(noty).subscribe(data=>{
      this.getDiscussion(discussionId,false,true);
      }); 
    }  
  });
}

}


