import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit, OnChanges {

  private RESOURCE_PATH = '/assets/resources/';

  @Input() height: string;
  @Input() type: string;
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
    if (this.type !== undefined && this.resource === undefined) {
      console.error('Need to provide resource to show.', 'Type: ', this.type, ' > ', this.resource);
      this.type = '';
    } else {
      switch (this.type) {
        case 'image':
          this.resourceFile = this.RESOURCE_PATH + this.resource + '.png';
          break;
        case 'video':
          this.resourceFile = this.RESOURCE_PATH + this.resource + '.mp4';
          const video = document.getElementById('video');
          if (!!video) {
            video.children[0].setAttribute('src', this.resourceFile);
          }
          break;
      }
    }
  }

}
