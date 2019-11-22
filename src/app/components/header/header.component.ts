import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TestResultsService } from 'src/app/services/test-results.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private testResultsService: TestResultsService) { }

  ngOnInit() { }

  goToIndex() {
    this.router.navigate(['']);
  }

  showMore() {
    console.log(this.testResultsService.getAll());
  }

}
