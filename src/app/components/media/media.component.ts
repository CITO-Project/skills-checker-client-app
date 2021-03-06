import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { VgApiService, VgMediaDirective } from '@videogular/ngx-videogular/core';

import { CommonService } from 'src/app/services/common.service';
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
  @Input() texts: string[];

  @Output() ready = new EventEmitter<VgApiService>();

  private vgApi: VgApiService;
  private videoFinished = false;

  public resourceFile: string;
  public subtitleFile: string;
  public supportedVideo = ['mp4', 'webm', 'ogg'];
  public supportedImages = ['apng', 'bmp', 'gif', 'ico', 'cur', 'jpg', 'jpeg', 'jfif', 'pjpej', 'pjp', 'png', 'svg', 'tif', 'tiff', 'webp'];

  constructor(
    private commonService: CommonService,
    private googleAnalyticsService: GoogleAnalyticsService
    ) { }

  ngOnInit() {
    this.loadResource();
    const el = document.getElementById('media');
    if (!!this.height) {
      el.style.height = this.height;
      el.style.width = 'auto';
    }
  }

  ngOnChanges() {
    this.loadResource();
  }

  loadResource() {
    if (this.resource === undefined || !this.resource) {
      this.resourceFile = 'default.mp4';
    } else {
      switch (this.getType()) {
        case 'video':
          this.resourceFile = this.commonService.getResourcePath(`videos/${this.resource}`);
          this.loadSubtitles();
          if (!!this.vgApi) {
            (this.vgApi.getDefaultMedia() as VgMediaDirective).loadMedia();
            (this.vgApi.getDefaultMedia() as VgMediaDirective).play();
          }
          break;
        case 'image':
          this.resourceFile = this.commonService.getResourcePath(`images/${this.resource}`);
      }
    }
  }

  getExtension(): string {
    return this.resource.split('.').pop();
  }

  loadSubtitles(): void {
    const fileName = this.resource.split('.').slice(0, -1).join();
    this.subtitleFile = this.commonService.getResourcePath(`subtitles/${fileName}.vtt`);
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

  onPlayerReady(vgAPI: VgApiService): void {
    this.vgApi = vgAPI;
    this.addListenersToVideo();
    this.ready.emit(this.vgApi);
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
