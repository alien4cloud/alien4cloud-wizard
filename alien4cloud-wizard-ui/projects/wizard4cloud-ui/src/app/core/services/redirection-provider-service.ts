import {RedirectionProviderService} from "@alien4cloud/wizard4cloud-commons/lib/core/services/redirection-provider-service";
import {Router} from "@angular/router";

export class WizardRedirectionProviderService implements RedirectionProviderService {

  constructor(private router: Router) {
  }

  homeRedirect() {
    this.router.navigateByUrl('');
  }

  settingsRedirect() {
    this.router.navigateByUrl('/settings');
  }

}

