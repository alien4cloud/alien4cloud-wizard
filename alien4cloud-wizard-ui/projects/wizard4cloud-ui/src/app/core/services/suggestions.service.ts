import {Inject, Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BOOTSTRAP_SETTINGS, BootstrapSettings, GenericService} from "@alien4cloud/wizard4cloud-commons";
import {Suggestion, SuggestionRequestContext} from "@app/core/models";

@Injectable({
  providedIn: 'root'
})
export class SuggestionService extends GenericService {

  constructor(
    http: HttpClient,
    translate: TranslateService,
    @Inject(BOOTSTRAP_SETTINGS) protected bootstrapSettings: BootstrapSettings
  ) { super(http, translate, bootstrapSettings) }

  getMatchedSuggestions(suggestionId: string, input: string) {
    let urlParams = {suggestionId: suggestionId};
    let url = this.baseUrl + this.getParametrizedUrl("/suggestions/@{suggestionId}/values", urlParams);
    let params = {input: input};
    return this.handleResult<Suggestion[]>(this.http.get(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
      params: params}));
  }

  getMatchedSuggestionsContextual(suggestionId: string, input: string, context: SuggestionRequestContext) {
    let urlParams = {suggestionId: suggestionId};
    let url = this.baseUrl + this.getParametrizedUrl("/suggestions/@{suggestionId}/values", urlParams);
    let params = {input: input};
    return this.handleResult<Suggestion[]>(this.http.post(url, context, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
      params: params}));
  }

}
