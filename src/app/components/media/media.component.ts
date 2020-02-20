import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { VgAPI } from 'videogular2/compiled/core';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit, OnChanges {

  @Input() height: string;
  @Input() resource: string;
  @Input() replay: boolean;

  private vgApi: VgAPI;
  private videoFinished = false;

  public resourceFile: string;
  public subtitleFile: string;
  public supportedVideo = ['mp4', 'webm', 'ogg'];
  public supportedImages = ['apng', 'bmp', 'gif', 'ico', 'cur', 'jpg', 'jpeg', 'jfif', 'pjpej', 'pjp', 'png', 'svg', 'tif', 'tiff', 'webp'];

  constructor(private commonService: CommonService, private googleAnalyticsService: GoogleAnalyticsService) { }

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
      console.error('Need to provide resource to show > ', this.resource);
    } else {
      this.resourceFile = this.commonService.getResourcePath(this.resource);
      if (this.getType() === 'video') {
        this.loadSubtitles();
      }
    }
  }

  getExtension(): string {
    return this.resource.split('.').pop();
  }

  loadSubtitles() {
    const r = this.resourceFile.split('.').slice(0, -1);
    r.push('.vtt');
    this.subtitleFile = r.join('');
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

  onPlayerReady(vgAPI: VgAPI): void {
    this.vgApi = vgAPI;
    this.addListenersToVideo();
    this.googleAnalyticsService.addCounter('count_plays_per_scenario');
  }

  addListenersToVideo(): void {
    this.vgApi.getDefaultMedia().subscriptions.ended.subscribe( () => {
      this.videoFinished = true;
    });
    this.vgApi.getDefaultMedia().subscriptions.playing.subscribe( () => {
      if (!!this.videoFinished) {
        this.googleAnalyticsService.addCounter('count_plays_per_scenario');
      }
    });
  }

}
