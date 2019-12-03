import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataLogService } from 'src/app/services/data-log.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() text: string;

  constructor(private router: Router, private dataLogService: DataLogService) { }

  ngOnInit() {
    if (this.text === undefined) {
      this.text = 'SkillsChecker';
    }
  }

  goToIndex() {
    this.router.navigate(['']);
  }

  showMore() {
    console.log(this.dataLogService.getAll());
  }

}
