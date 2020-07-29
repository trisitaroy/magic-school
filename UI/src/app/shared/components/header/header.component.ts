import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Router } from '@angular/router';
import {DataService} from '../../service/data.service';
import { UserLoggedIn } from '@core/services';
import {
  slideInOutAnimation,
  showHideAnimation
} from 'assets/animations/animations';

import { APP_CONST } from '@app/app.constant';
import { DropdownOption } from '@app/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [slideInOutAnimation, showHideAnimation]
})
export class HeaderComponent implements OnInit, OnChanges {

  @Input() isBeforeLogin = true;
  isMobileNavOpen = false;
  isShowSearchBox = false;
  isShowUserDropdown = false;
  isShowMyFeed = false;
  routes = APP_CONST.routes;
  public activeNav: string;
  public listSearchOptions: DropdownOption[] = [
    {
      label: 'Transactions',
      value: 'Transactions'
    },
    {
      label: 'Documents',
      value: 'Documents'
    },
    {
      label: 'Contacts',
      value: 'Contacts'
    },
    {
      label: 'Trident Import',
      value: 'TridentImport'
    }
  ];
  public placeholderText = 'Transaction Address Line 1';
  public selectedSearchOption = this.listSearchOptions[0].value;

  
  userInfo :any;
  loginObj:any;
  shortName :string;  
  constructor(private router: Router,
    private dataService:DataService,    
    private userLoggedIn: UserLoggedIn) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isBeforeLogin'] && changes['isBeforeLogin'].currentValue) {
      this.isBeforeLogin = changes['isBeforeLogin'].currentValue;
    }
  }

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if(this.userInfo)
    this.getShortName(this.userInfo);
   }

   changeOverlay(event) {
   this.isShowMyFeed=false;
   window.location.reload(); 
   }
  public getShortName(userInfo){
    this.shortName = userInfo.fName[0] + userInfo.lName[0]
  }

  public navigateToPage(page: string) {
    this.isMobileNavOpen = false;
    switch (page) {
      case 'home':
        this.router.navigate([this.routes.home]);
        break;
      case 'documents':
        this.router.navigate([this.routes.document]);
        break;
      case 'inbox':
        this.router.navigate([this.routes.inbox]);
        break;
      case 'login':
        this.router.navigate([this.routes.login]);
        break;
        case 'covid':
        this.router.navigate([this.routes.covid]);
        break;
        case 'schoolbot':
          this.router.navigate([this.routes.schoolbot]);
          break;
        case 'topics':
        this.router.navigate([this.routes.topics]);
        break;
        case 'createquiz':
          this.router.navigate([this.routes.topics]);
          break;
      case 'profile':
        this.router.navigate([this.routes.profile]);
        break;
        case 'noty':
          this.router.navigate([this.routes.noty]);
          break;
    }
  }

  public toggleMobileNavbar() {
    this.isMobileNavOpen = !this.isMobileNavOpen;
  }

  public toggleSearchBox() {
    this.isShowSearchBox = !this.isShowSearchBox;
  }

  public toggleMyFeed() {
    this.isShowMyFeed = !this.isShowMyFeed;
  }
  public toggleUserDropDown() {
    this.isShowUserDropdown = !this.isShowUserDropdown;
  }


  public logout() {    
    this.loginObj = JSON.parse(localStorage.getItem('loginObj'));
    const swipeOut ={
      "logout" : new Date().toISOString().replace('T', ' ').substring(0, 11) + new Date().toTimeString().substring(0, 8),
      "id" :this.loginObj.id
    }  
    this.dataService.swipeOut(swipeOut).subscribe(data => {      
    this.isShowUserDropdown = false;
    localStorage.removeItem('userInfo');
    localStorage.setItem('loginObj',JSON.stringify(data));
    this.userLoggedIn.setUserLoggedIn(false);
    this.navigateToPage(this.routes.login);
    });
  }
  public navigateMyProfile() {
    this.isShowUserDropdown = false;
    this.navigateToPage(this.routes.profile);
  }
   public editRole(){
    this.isShowUserDropdown = false;
    this.router.navigate([
      `${APP_CONST.routes.profile}`,
      { roleChange: true }
    ])
   }

  public selectedValueChange(event: any) {
    this.selectedSearchOption = event;
    if (this.selectedSearchOption === this.listSearchOptions[0].value || this.selectedSearchOption === this.listSearchOptions[1].value) {
      this.placeholderText = 'Transaction Address Line 1';
    } else if (this.selectedSearchOption === this.listSearchOptions[2].value) {
      this.placeholderText = 'Contact Name';
    } else if (this.selectedSearchOption === this.listSearchOptions[3].value) {
      this.placeholderText = 'Street Name';
    }
  }

}
