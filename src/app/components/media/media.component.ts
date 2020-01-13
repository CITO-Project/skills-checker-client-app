import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit, OnChanges {

  private RESOURCE_PATH = 'assets/resources/';

  @Input() height: string;
  @Input() resource: string;

  public resourceFile: string;
  public supportedVideo = ['mp4', 'webm', 'ogg'];
  public supportedImages = ['apng', 'bmp', 'gif', 'ico', 'cur', 'jpg', 'jpeg', 'jfif', 'pjpej', 'pjp', 'png', 'svg', 'tif', 'tiff', 'webp'];

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
    const extension = this.getExtension();
    if (this.resource === undefined) {
      console.error('Need to provide resource to show > ', this.resource);
    } else {
      switch (extension) {
        case 'png':
          this.resourceFile = this.RESOURCE_PATH + this.resource;
          break;
        case 'mp4':
          this.resourceFile = this.RESOURCE_PATH + this.resource;
          const video = document.getElementById('video');
          if (!!video) {
            video.children[0].setAttribute('src', this.resourceFile);
          }
          break;
      }
    }
  }

  getExtension(): string {
    return this.resource.split('.').pop();
  }

  getType(): string {
    if (this.supportedImages.includes(this.getExtension())) {
      return 'image';
    } else if (this.supportedVideo.includes(this.getExtension())) {
      return 'video';
    } else {
      return '';
    }
  }

}
