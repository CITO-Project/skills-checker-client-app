import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit, OnChanges {

  private RESOURCE_PATH = '/assets/resources/';

  @Input() height: string;
  @Input() resource: string;

  public resourceFile: string;

  constructor() { }

  ngOnInit() {
    this.loadResource();
    const el = document.getElementById('media');
    el.style.height = this.height;
  }

  ngOnChanges() {
    this.loadResource();
  }

  loadResource() {
    if (this.resource === undefined) {
      console.error('Need to provide resource to show. > ', this.resource);
    } else {
      const extension = this.resource.split('.').pop();
      switch (extension) {
        case '.png':
          this.resourceFile = this.RESOURCE_PATH + this.resource;
          break;
        case '.mp4':
          this.resourceFile = this.RESOURCE_PATH + this.resource;
          const video = document.getElementById('video');
          if (!!video) {
            video.children[0].setAttribute('src', this.resourceFile);
          }
          break;
      }
    }
  }

}
