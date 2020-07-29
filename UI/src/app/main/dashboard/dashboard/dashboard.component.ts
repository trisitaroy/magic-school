import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APP_CONST } from '@app/app.constant';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private router: Router) { }

  ngOnInit() {
  }

  public redirectToCreateDiscussion() {
    this.router.navigate([
      `${APP_CONST.routes.discussion}/${APP_CONST.routes.create}`
    ])
  }
  
  
}
