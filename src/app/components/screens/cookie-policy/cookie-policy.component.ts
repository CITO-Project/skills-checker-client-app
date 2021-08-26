import { Component, OnInit } from '@angular/core';

import { HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cookie-policy',
  templateUrl: './cookie-policy.component.html',
  styleUrls: ['./cookie-policy.component.scss']
})
export class CookiePolicyComponent implements OnInit {

  env = environment;

  constructor() { }

  ngOnInit(): void {
  }

  getReadSpeakerURL(readid: string): string {

    const baseURL = environment.readspeaker.baseurl;

    const params = new HttpParams()
                          .set( 'customerid', environment.readspeaker.id.toString() )
                          .set( 'lang', environment.readspeaker.lang )
                          .set( 'voice', environment.readspeaker.voice )
                          .set( 'readid', readid)
                          .set( 'url', encodeURIComponent(environment.api.host + '/updates/'));

    return `${baseURL}?${params.toString()}`;
  }

}
