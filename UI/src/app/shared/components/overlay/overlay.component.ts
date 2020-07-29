import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, TemplateRef, HostListener } from '@angular/core';

import { slideInOutAnimation } from 'assets/animations/animations';
import { OverlayConfig } from '@core/index';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
  animations: [slideInOutAnimation]
})
export class OverlayComponent implements OnInit, OnChanges {

  @Input() isShowOverlay = false;
  @Input() template: TemplateRef<any>;
  @Input() overlayOptions: OverlayConfig = {
    backdropClose: true
  };
  @Output() closedOverlay = new EventEmitter<boolean>();
  public overlayHeight: number = window.innerHeight;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isShowOverlay'] && changes['isShowOverlay'].currentValue) {
      this.isShowOverlay = changes['isShowOverlay'].currentValue;
    }
    if (changes['template'] && changes['template'].currentValue) {
      this.template = changes['template'].currentValue;
    }
    if (changes['overlayOptions'] && changes['overlayOptions'].currentValue) {
      this.overlayOptions = changes['overlayOptions'].currentValue;
    }
    if (this.isShowOverlay) {
      document.querySelector('body').classList.add('overlay-open');
      if (document.querySelector('#HBFullLayoutSection2 .hb-collapsable-sidenav-content-container')) {
        document.querySelector('#HBFullLayoutSection2 .hb-collapsable-sidenav-content-container').setAttribute('style', 'z-index: 0');
      }
      if (document.querySelector('#HBFullLayoutHeader header')) {
        document.querySelector('#HBFullLayoutHeader header').setAttribute('style', 'z-index: 1');
      }
    }
  }

  ngOnInit() {

  }

  public backdropClicked() {
    if (this.overlayOptions.backdropClose) {
      this.closeOverlay();
    }
  }

  public closeOverlay() {
    this.closedOverlay.emit(true);
  }

  @HostListener('window:resize')
  onResize() {
    this.overlayHeight = window.innerHeight;
  }

  public onAnimationCompletion() {
    if (!this.isShowOverlay) {
      document.querySelector('body').classList.remove('overlay-open');
      if (document.querySelector('#HBFullLayoutSection2 .hb-collapsable-sidenav-content-container')) {
        document.querySelector('#HBFullLayoutSection2 .hb-collapsable-sidenav-content-container').removeAttribute('style');
      }
      if (document.querySelector('#HBFullLayoutHeader header')) {
        document.querySelector('#HBFullLayoutHeader header').removeAttribute('style');
      }
    }
  }
}
