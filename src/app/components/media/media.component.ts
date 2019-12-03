import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {

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

  loadResource() {
    if (this.type !== undefined && this.resource === undefined) {
      this.type = '';
      console.error('Need to provide resource to show');
    } else {
      switch (this.type) {
        case 'image':
          this.resourceFile = this.RESOURCE_PATH + this.resource + '.png';
          console.log(this.resourceFile);
          break;
        case 'video':
          console.log('type video');
          break;
      }
    }
  }

  ngChange() {
    console.log('change');
  }

}
