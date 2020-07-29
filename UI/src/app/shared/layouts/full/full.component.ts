import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routeAnimation } from 'assets/animations/animations';

@Component({
  selector: 'app-full-layout',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss'],
  animations: [routeAnimation],
})
export class FullComponent implements OnInit, OnDestroy {

  isShowHeaderFooter = true;
  isSideNavOpen = true;

  constructor(
  ) { }

  ngOnInit() {

  }

  onActivate(outlet: RouterOutlet): void {
    if (outlet && outlet.activatedRouteData && outlet.activatedRouteData['isShowHeaderFooter'] !== undefined) {
      this.isShowHeaderFooter = outlet && outlet.activatedRouteData && outlet.activatedRouteData['isShowHeaderFooter'];
    } else {
      this.isShowHeaderFooter = true;
    }
  }

  outletData(outlet: RouterOutlet): string | undefined {
    const isIE = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
    const isSafari = /.*Version.*Safari.*/.test(navigator.userAgent);
    if (!isIE && !isSafari) {
      return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
    }
    return;
  }

  public toggleSideNav() {
    this.isSideNavOpen = !this.isSideNavOpen;
  }

  public onRouteAnimationCompletion(outlet: RouterOutlet) {
    this.onActivate(outlet);
  }

  ngOnDestroy() {

  }
}
