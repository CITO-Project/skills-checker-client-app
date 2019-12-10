import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category';
import { DataLogService } from 'src/app/services/data-log.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-categories-screen',
  templateUrl: './categories-screen.component.html',
  styleUrls: ['./categories-screen.component.scss']
})
export class CategoriesScreenComponent implements OnInit {

  public categories: Category[];

  constructor(
    private categoryService: CategoryService,
    private dataLogService: DataLogService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.categoryService.getCategories().subscribe( (data: Category[]) => {
      this.categories = data;
    });
  }

  selectCategory(category: Category): void {
    this.dataLogService.setCategory(category);
    if (this.dataLogService.getCategory().id === category.id) {
      this.commonService.goTo('interests');
    }
  }

}
