import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataLogService } from 'src/app/services/data-log.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private dataLogService: DataLogService) { }

  ngOnInit() { }

  goToIndex() {
    this.router.navigate(['']);
  }

  showMore() {
    console.log(this.dataLogService.getAll());
  }

}
