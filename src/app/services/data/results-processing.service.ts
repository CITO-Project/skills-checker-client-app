import { Injectable } from '@angular/core';

import { Log } from 'src/app/models/log';

@Injectable({
  providedIn: 'root'
})
export class ResultsProcessingService {

  constructor() { }

  generateText(log: Log): string {
    return 'An example of some additional text beside the balloons... in this space here!'
  }

}
