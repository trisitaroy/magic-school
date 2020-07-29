import { Component, OnChanges, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Location } from '@angular/common';
import {DataService} from '../../service/data.service';
import { Router } from '@angular/router';
import { APP_CONST } from '@app/app.constant';

@Component({
  selector: 'app-my-feed-overlay',
  templateUrl: './my-feed-overlay.component.html',
  styleUrls: ['./my-feed-overlay.component.scss']
})
export class MyFeedOverlayComponent implements OnChanges, OnInit {

  @Input() fromHeader: boolean = false;
  @Input() sectionWidth: number = 500;
  @Output() _closeOverlay = new EventEmitter<boolean>(); 
  userInfo :any;
  notyList:any=[];  
  routes = APP_CONST.routes;
  isShowFileImportPopup = false;

  constructor(private location: Location,
    private dataService:DataService,
    private router: Router) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sectionWidth'] && changes['sectionWidth'].currentValue) {
      this.sectionWidth = changes['sectionWidth'].currentValue;
    }
  }

  ngOnInit() {   
    this.getNoty();
  }

  getNoty(){     
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if(this.userInfo){
      this.dataService.getNoty(this.userInfo.userName).subscribe(data=>{
        this.notyList = data;  
        this.notyList=  this.notyList.filter(x=>x.fromname!==this.userInfo.userName)
        this.notyList.sort((a, b) => parseFloat(b.id) - parseFloat(a.id));      
      })
    }
  }
  openDiscussion(id:number){
   localStorage.setItem('notyId',id.toString())
   this.closeOverlay();
  }
  public closeOverlay() {
    this._closeOverlay.emit(true);
    if(!this.fromHeader) {           
    this.router.navigate([this.routes.home]);
    }  
   // this.location.back();
  }

  showorHideFileImportPopup() {
    this.isShowFileImportPopup = !this.isShowFileImportPopup;
  }

}
