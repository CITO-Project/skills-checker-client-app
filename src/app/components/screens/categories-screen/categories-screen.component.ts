import { Component, OnInit } from '@angular/core';

import { Category } from 'src/app/models/category';

import { CategoryService } from 'src/app/services/category.service';
import { DataLogService } from 'src/app/services/data-log.service';
import { CommonService } from 'src/app/services/common.service';
import { noUndefined } from '@angular/compiler/src/util';

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
    const product = this.dataLogService.getProduct();
    if (product === null || product === undefined) {
      this.commonService.goTo('');
    }
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
