import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONST } from '@app/app.constant';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserLoggedIn {

  private userLoggedIn = new Subject<boolean>();

  constructor(private http: HttpClient) {
    this.userLoggedIn.next(false);  }

  setUserLoggedIn(userLoggedIn: boolean) {
    this.userLoggedIn.next(userLoggedIn);
  }
  swipeOut(object){
    return this.http.patch(APP_CONST.API_URL + '/timesheets', object);
  }
  getSwipeIn(userName:string,today:string) {    
    return this.http.get(APP_CONST.API_URL + '/timesheets?filter={"where":{"today":"'+today+'","username":"'+userName+'"}}')
  }

  getUserLoggedIn(): Observable<boolean> {
    return this.userLoggedIn.asObservable();
  }
}
