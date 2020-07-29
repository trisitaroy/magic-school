import { Component, OnInit } from '@angular/core';
import {
  Router
} from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { UserLoggedIn} from '@core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
idleState = 'Not started.';
timedOut = false;
lastPing?: Date = null;
loginObj:any;
title = 'Magic School';

constructor( private router: Router,
  private idle: Idle,
   private keepalive: Keepalive,
   private userLoggedIn: UserLoggedIn ) {
  // sets an idle timeout of 5 seconds, for testing purposes.
  idle.setIdle(600);
  // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
  idle.setTimeout(5);
  // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
  idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

  idle.onIdleEnd.subscribe(() => { 
    this.idleState = 'No longer idle.'
    console.log(this.idleState);
    this.reset();
  });
  
  idle.onTimeout.subscribe(() => {
    this.idleState = 'Timed out!';
    this.timedOut = true;
    console.log(this.idleState);    
    this.loginObj = JSON.parse(localStorage.getItem('loginObj'));
    const swipeOut ={
      "logout" : new Date().toISOString().replace('T', ' ').substring(0, 11) + new Date().toTimeString().substring(0, 8),
      "id" :this.loginObj.id
    }  
    this.userLoggedIn.swipeOut(swipeOut).subscribe(data => { 
      localStorage.removeItem("userInfo");   
      localStorage.setItem('loginObj',JSON.stringify(data)); 
      this.userLoggedIn.setUserLoggedIn(false);
      this.router.navigate(['/login']);    
      location.reload();
    });   
  });
  
  idle.onIdleStart.subscribe(() => {
      this.idleState = 'You\'ve gone idle!'
      console.log(this.idleState);
  });
  
  idle.onTimeoutWarning.subscribe((countdown) => {
    this.idleState = 'You will time out in ' + countdown + ' seconds!'
    console.log(this.idleState);
  });

  // sets the ping interval to 15 seconds
  keepalive.interval(15);

  keepalive.onPing.subscribe(() => this.lastPing = new Date());

  this.userLoggedIn.getUserLoggedIn().subscribe(userLoggedIn => {
    if (userLoggedIn) {
      idle.watch()
      this.timedOut = false;
    } else {
      idle.stop();
    }
  })

}

reset() {
  this.idle.watch();
  this.idleState = 'Started.';
  this.timedOut = false;
}
ngOnInit() {
  this.userLoggedIn.getUserLoggedIn().subscribe(userLoggedIn => {
    if (userLoggedIn) {
      this.idle.watch()
      this.timedOut = false;
    } else {
      this.idle.stop();
    }
  })
}
ngOnDestroy() {
}
}
