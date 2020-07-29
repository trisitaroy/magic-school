import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blank-layout',
  templateUrl: './blank.component.html',
  styles: [
    `
    :host {
      z-index: 1;
    }
    `
  ]
})
export class BlankComponent implements OnInit, OnDestroy {

  isShowHeaderFooter = false;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    
  }

  onActivate(outlet: RouterOutlet): void {
    if (outlet && outlet.activatedRouteData && outlet.activatedRouteData['isShowHeaderFooter'] !== undefined) {
      this.isShowHeaderFooter = outlet && outlet.activatedRouteData && outlet.activatedRouteData['isShowHeaderFooter'];
    }
  }

  ngOnDestroy() {
    
  }
}
