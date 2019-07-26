import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Environment} from "@app/core";
import {TranslateService} from "@ngx-translate/core";
import {V2GenericService} from "@app/core/serviceV2/generic.service";


@Injectable({
  providedIn: 'root'
})
export class V2ApplicationEnvironmentService extends V2GenericService<Environment> {

  constructor(
    http: HttpClient,
    translate: TranslateService
  ) {
    super(http, translate, "/applications/@{applicationId}/environments")
  }

}
