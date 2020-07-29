import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { OverlayConfig } from '@core/index';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public isShowPrivacyPolicyOverlay = false;
  public isShowTermsOfUseOverlay = false;
  public overlayOptions: OverlayConfig = {
    backdropClose: true,
    showFooter: false,
  };
  constructor(
    private router: Router
  ) { }

  ngOnInit() {

  }

  public showOverlayFor(overlayFor: string): void {
    switch (overlayFor) {
      case 'privacyPolicy':
        this.isShowPrivacyPolicyOverlay = true;
        break;
      case 'termsOfUse':
        this.isShowTermsOfUseOverlay = true;
        break;
    }
  }

  public closeOverlayFor(value: boolean, overlayFor: string): void {
    switch (overlayFor) {
      case 'privacyPolicy':
        this.isShowPrivacyPolicyOverlay = !value;
        break;
      case 'termsOfUse':
        this.isShowTermsOfUseOverlay = !value;
        break;
    }
  }
}
