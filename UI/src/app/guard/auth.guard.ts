import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot,Router, RouterStateSnapshot, UrlTree,CanActivate } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements  CanActivate  {
  private isloggedIn: boolean = false;
  userInfo:any;
  constructor(public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!this.userInfo && this.userInfo==null) {
      this.router.navigate(['/login']);
      return false;
    }
    else {
      return true;
    }
  }
  setUser(user?){
    this.isloggedIn = true; 
  }
}
