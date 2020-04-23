import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Course } from 'src/app/models/course';
import { Result } from 'src/app/models/result';

import { DataProcessingService } from 'src/app/services/data/data-processing.service';
import { CommonService } from 'src/app/services/common.service';
import { CoursesService } from 'src/app/services/api-call/courses.service';
import { DataLogService } from 'src/app/services/data/data-log.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { ResultsSaverService } from 'src/app/services/data/results-saver.service';
import { ResultsVisualizationService } from 'src/app/services/data/results-visualization.service';
import { ResultsProcessingService } from 'src/app/services/data/results-processing.service';
import { Log } from 'src/app/models/log';

@Component({
  selector: 'app-results-screen',
  templateUrl: './results-screen.component.html',
  styleUrls: ['./results-screen.component.scss']
})
export class ResultsScreenComponent implements OnInit {

  public resultsText;
  public readonly HEADER = 'Check-In Take-Off'
  public readonly SUBTITLE = 'My Learning Pathway'
  public readonly LEARNING_PATHWAY_HEADER = 'My Learning Pathway'
  public readonly LEARNING_PATHWAY = 'If you want to develop your digital skills, try one of these courses below:'

  public courses: Course[];
  public results: Result;
  public resultsImage

  constructor(
    private commonService: CommonService,
    private dataLogService: DataLogService,
    private coursesService: CoursesService,
    private dataProcessingService: DataProcessingService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private resultsSaverService: ResultsSaverService,
    private resultsVisualizationService: ResultsVisualizationService,
    private resultsProcessingService: ResultsProcessingService) { }

  ngOnInit() {
    if (
      this.dataLogService.getProduct() === null ||
      this.dataLogService.getCategory() === null ||
      this.dataLogService.getInterest() === null
    ) {
      // this.commonService.goTo('');
    }
    // DELETE this
    // this.results = this.dataProcessingService.getResults(this.dataLogService.getAll());
    const deleteThisLog: Log = {
      "product": {
        "id": 1,
        "name": "nala",
        "description": null
      },
      "interest": {
        "id": 3,
        "name": "help_children",
        "text": "Help with my children's learning",
        "resource": "task-list-checked.svg",
        "description": null,
        "product": 1,
        "category": 1
      },
      "scenarios": [
        {
          "id": 1,
          "name": "school_trip",
          "text": "School trip",
          "level": 1,
          "resource": "choose-clothes-for-child.mp4",
          "description": "Your child is going on school trip tomorrow. You want to choose the clothes your child willwear. Look at tomorrow’s weather forecast on your phone and decide if you can select appropriate clothing foryour child",
          "product": 1,
          "interest": 3
        },
        {
          "id": 2,
          "name": "birthday_party",
          "text": "Birthday party",
          "level": 2,
          "resource": "organize-party-via-whatsapp.mp4",
          "description": "It’s your partner’s birthday. You are organising a party for them at a local restaurant and want to invite your friends. Decide if you can type and send a short message on WhatsApp to invite your friends to the party.",
          "product": 1,
          "interest": 3
        },
        {
          "id": 3,
          "name": "car_loan",
          "text": "Calculate car loan",
          "level": 3,
          "resource": "use-online-loan-calculator.mp4",
          "description": "You are thinking of buying a car and you would like to know how much you could borrow from the bank. Look at the online loan calculator and decide if you can find out how much you can borrow and what monthly repayments would be.",
          "product": 1,
          "interest": 3
        },
        {
          "id": 23,
          "name": "credit_card_interest",
          "text": "Credit card interest",
          "level": 4,
          "resource": "calculate-interest.mp4",
          "description": "Your credit card bill is €500. Your credit card monthly interest rate is 4.5%. After you have made a minimum payment of €5, your balance owed is €495. Decide if you can work out the interest charged on this amount using the calculator on your phone.",
          "product": 1,
          "interest": 3
        }
      ],
      "questions": [
        {
          "id": 1,
          "type": "slider",
          "pedagogical_type": "task_question",
          "question": "In this task, selecting appropriate clothes for my child after looking at the weather forecast on my phone is",
          "description": null,
          "product": 1,
          "scenario": 1,
          "answers": [
            {
              "id": 1,
              "text": "Very diffucult",
              "value": 0,
              "order": 0,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 1
            },
            {
              "id": 2,
              "text": "Difficult",
              "value": 1,
              "order": 1,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 1
            },
            {
              "id": 3,
              "text": "A little difficult",
              "value": 2,
              "order": 2,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 1
            },
            {
              "id": 4,
              "text": "Easy",
              "value": 3,
              "order": 3,
              "special": null,
              "skipTo": "nextScenario",
              "product": 1,
              "question": 1
            }
          ]
        },
        {
          "id": 2,
          "type": "multiple",
          "pedagogical_type": "challenging_skill",
          "question": "The most challenging aspect in this scenario is:",
          "description": null,
          "product": 1,
          "scenario": 1,
          "answers": [
            {
              "id": 5,
              "text": "Reading the words in the weather forecast",
              "value": 0,
              "order": 0,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 2
            },
            {
              "id": 6,
              "text": "Recognising the numbers",
              "value": 1,
              "order": 1,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 2
            },
            {
              "id": 7,
              "text": "Finding the weather information on my phone",
              "value": 2,
              "order": 2,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 2
            },
            {
              "id": 35,
              "text": "None",
              "value": -1,
              "order": 3,
              "special": "none",
              "skipTo": null,
              "product": 1,
              "question": 2
            }
          ]
        },
        {
          "id": 3,
          "type": "single",
          "pedagogical_type": "dimension_independence_1",
          "question": "Would you find this task easier with help?",
          "description": null,
          "product": 1,
          "scenario": 0,
          "answers": [
            {
              "id": 8,
              "text": "Yes",
              "value": 0,
              "order": 0,
              "special": null,
              "skipTo": "nextScenario",
              "product": 1,
              "question": 3
            },
            {
              "id": 9,
              "text": "No",
              "value": 1,
              "order": 1,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 3
            }
          ]
        },
        {
          "id": 4,
          "type": "single",
          "pedagogical_type": "dimension_confidence_1",
          "question": "Would you feel comfortable doing this task in public?",
          "description": null,
          "product": 1,
          "scenario": 0,
          "answers": [
            {
              "id": 10,
              "text": "Yes",
              "value": 0,
              "order": 0,
              "special": null,
              "skipTo": "dimension_fluency_1",
              "product": 1,
              "question": 4
            },
            {
              "id": 11,
              "text": "No",
              "value": 1,
              "order": 1,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 4
            }
          ]
        },
        {
          "id": 13,
          "type": "single",
          "pedagogical_type": "dimension_confidence_2",
          "question": "Would you feel more comfortable doing this task in private?",
          "description": null,
          "product": 1,
          "scenario": 0,
          "answers": [
            {
              "id": 39,
              "text": "Yes",
              "value": 0,
              "order": 0,
              "special": "none",
              "skipTo": null,
              "product": 1,
              "question": 13
            },
            {
              "id": 40,
              "text": "No",
              "value": 1,
              "order": 1,
              "special": "none",
              "skipTo": "nextScenario",
              "product": 1,
              "question": 13
            }
          ]
        },
        {
          "id": 5,
          "type": "single",
          "pedagogical_type": "dimension_fluency_1",
          "question": "Would it take you less than 5 minutes to complete this task?",
          "description": null,
          "product": 1,
          "scenario": 0,
          "answers": [
            {
              "id": 12,
              "text": "Yes",
              "value": 0,
              "order": 0,
              "special": null,
              "skipTo": "nextScenario",
              "product": 1,
              "question": 5
            },
            {
              "id": 13,
              "text": "No",
              "value": 1,
              "order": 1,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 5
            }
          ]
        },
        {
          "id": 14,
          "type": "single",
          "pedagogical_type": "dimension_fluency_2",
          "question": "Would it take you more than 30 minutes to complete this task?",
          "description": null,
          "product": 1,
          "scenario": 0,
          "answers": [
            {
              "id": 41,
              "text": "Yes",
              "value": 0,
              "order": 0,
              "special": "none",
              "skipTo": null,
              "product": 1,
              "question": 14
            },
            {
              "id": 42,
              "text": "No",
              "value": 1,
              "order": 1,
              "special": "none",
              "skipTo": null,
              "product": 1,
              "question": 14
            }
          ]
        },
        {
          "id": 6,
          "type": "slider",
          "pedagogical_type": "task_question",
          "question": "In this task, sending a message on WhatsApp to invite friends to a birthday party is",
          "description": null,
          "product": 1,
          "scenario": 2,
          "answers": [
            {
              "id": 14,
              "text": "Very difficult",
              "value": 0,
              "order": 0,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 6
            },
            {
              "id": 15,
              "text": "Difficult",
              "value": 1,
              "order": 1,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 6
            },
            {
              "id": 16,
              "text": "A little difficult",
              "value": 2,
              "order": 2,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 6
            },
            {
              "id": 17,
              "text": "Easy",
              "value": 3,
              "order": 3,
              "special": null,
              "skipTo": "nextScenario",
              "product": 1,
              "question": 6
            }
          ]
        },
        {
          "id": 7,
          "type": "multiple",
          "pedagogical_type": "challenging_skill",
          "question": "The most challenging aspect in this scenario is:",
          "description": null,
          "product": 1,
          "scenario": 2,
          "answers": [
            {
              "id": 18,
              "text": "Typing the invitation text",
              "value": 0,
              "order": 0,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 7
            },
            {
              "id": 19,
              "text": "Writing the date, start time and end time",
              "value": 1,
              "order": 1,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 7
            },
            {
              "id": 20,
              "text": "Using applications such as WhatsApp to send and receive messages",
              "value": 2,
              "order": 2,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 7
            },
            {
              "id": 36,
              "text": "None",
              "value": -1,
              "order": 3,
              "special": "none",
              "skipTo": null,
              "product": 1,
              "question": 7
            }
          ]
        },
        {
          "id": 3,
          "type": "single",
          "pedagogical_type": "dimension_independence_1",
          "question": "Would you find this task easier with help?",
          "description": null,
          "product": 1,
          "scenario": 0,
          "answers": [
            {
              "id": 8,
              "text": "Yes",
              "value": 0,
              "order": 0,
              "special": null,
              "skipTo": "nextScenario",
              "product": 1,
              "question": 3
            },
            {
              "id": 9,
              "text": "No",
              "value": 1,
              "order": 1,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 3
            }
          ]
        },
        {
          "id": 4,
          "type": "single",
          "pedagogical_type": "dimension_confidence_1",
          "question": "Would you feel comfortable doing this task in public?",
          "description": null,
          "product": 1,
          "scenario": 0,
          "answers": [
            {
              "id": 10,
              "text": "Yes",
              "value": 0,
              "order": 0,
              "special": null,
              "skipTo": "dimension_fluency_1",
              "product": 1,
              "question": 4
            },
            {
              "id": 11,
              "text": "No",
              "value": 1,
              "order": 1,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 4
            }
          ]
        },
        {
          "id": 13,
          "type": "single",
          "pedagogical_type": "dimension_confidence_2",
          "question": "Would you feel more comfortable doing this task in private?",
          "description": null,
          "product": 1,
          "scenario": 0,
          "answers": [
            {
              "id": 39,
              "text": "Yes",
              "value": 0,
              "order": 0,
              "special": "none",
              "skipTo": null,
              "product": 1,
              "question": 13
            },
            {
              "id": 40,
              "text": "No",
              "value": 1,
              "order": 1,
              "special": "none",
              "skipTo": "nextScenario",
              "product": 1,
              "question": 13
            }
          ]
        },
        {
          "id": 5,
          "type": "single",
          "pedagogical_type": "dimension_fluency_1",
          "question": "Would it take you less than 5 minutes to complete this task?",
          "description": null,
          "product": 1,
          "scenario": 0,
          "answers": [
            {
              "id": 12,
              "text": "Yes",
              "value": 0,
              "order": 0,
              "special": null,
              "skipTo": "nextScenario",
              "product": 1,
              "question": 5
            },
            {
              "id": 13,
              "text": "No",
              "value": 1,
              "order": 1,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 5
            }
          ]
        },
        {
          "id": 14,
          "type": "single",
          "pedagogical_type": "dimension_fluency_2",
          "question": "Would it take you more than 30 minutes to complete this task?",
          "description": null,
          "product": 1,
          "scenario": 0,
          "answers": [
            {
              "id": 41,
              "text": "Yes",
              "value": 0,
              "order": 0,
              "special": "none",
              "skipTo": null,
              "product": 1,
              "question": 14
            },
            {
              "id": 42,
              "text": "No",
              "value": 1,
              "order": 1,
              "special": "none",
              "skipTo": null,
              "product": 1,
              "question": 14
            }
          ]
        },
        {
          "id": 8,
          "type": "slider",
          "pedagogical_type": "task_question",
          "question": "In this task, using the online loan calculator is",
          "description": null,
          "product": 1,
          "scenario": 3,
          "answers": [
            {
              "id": 21,
              "text": "Very difficult",
              "value": 0,
              "order": 0,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 8
            },
            {
              "id": 22,
              "text": "Difficult",
              "value": 1,
              "order": 1,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 8
            },
            {
              "id": 23,
              "text": "A little difficult",
              "value": 2,
              "order": 2,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 8
            },
            {
              "id": 24,
              "text": "Easy",
              "value": 3,
              "order": 3,
              "special": null,
              "skipTo": "nextScenario",
              "product": 1,
              "question": 8
            }
          ]
        },
        {
          "id": 9,
          "type": "multiple",
          "pedagogical_type": "challenging_skill",
          "question": "The most challenging aspect in this scenario is:",
          "description": null,
          "product": 1,
          "scenario": 3,
          "answers": [
            {
              "id": 25,
              "text": "Reading the information needed to use the online loan calculator",
              "value": 0,
              "order": 0,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 9
            },
            {
              "id": 26,
              "text": "Selecting a suitable monthly repayment option",
              "value": 1,
              "order": 1,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 9
            },
            {
              "id": 27,
              "text": "Accessing and using the online loan calculator",
              "value": 2,
              "order": 2,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 9
            },
            {
              "id": 37,
              "text": "None",
              "value": -1,
              "order": 3,
              "special": "none",
              "skipTo": null,
              "product": 1,
              "question": 9
            }
          ]
        },
        {
          "id": 3,
          "type": "single",
          "pedagogical_type": "dimension_independence_1",
          "question": "Would you find this task easier with help?",
          "description": null,
          "product": 1,
          "scenario": 0,
          "answers": [
            {
              "id": 8,
              "text": "Yes",
              "value": 0,
              "order": 0,
              "special": null,
              "skipTo": "nextScenario",
              "product": 1,
              "question": 3
            },
            {
              "id": 9,
              "text": "No",
              "value": 1,
              "order": 1,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 3
            }
          ]
        },
        {
          "id": 4,
          "type": "single",
          "pedagogical_type": "dimension_confidence_1",
          "question": "Would you feel comfortable doing this task in public?",
          "description": null,
          "product": 1,
          "scenario": 0,
          "answers": [
            {
              "id": 10,
              "text": "Yes",
              "value": 0,
              "order": 0,
              "special": null,
              "skipTo": "dimension_fluency_1",
              "product": 1,
              "question": 4
            },
            {
              "id": 11,
              "text": "No",
              "value": 1,
              "order": 1,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 4
            }
          ]
        },
        {
          "id": 13,
          "type": "single",
          "pedagogical_type": "dimension_confidence_2",
          "question": "Would you feel more comfortable doing this task in private?",
          "description": null,
          "product": 1,
          "scenario": 0,
          "answers": [
            {
              "id": 39,
              "text": "Yes",
              "value": 0,
              "order": 0,
              "special": "none",
              "skipTo": null,
              "product": 1,
              "question": 13
            },
            {
              "id": 40,
              "text": "No",
              "value": 1,
              "order": 1,
              "special": "none",
              "skipTo": "nextScenario",
              "product": 1,
              "question": 13
            }
          ]
        },
        {
          "id": 5,
          "type": "single",
          "pedagogical_type": "dimension_fluency_1",
          "question": "Would it take you less than 5 minutes to complete this task?",
          "description": null,
          "product": 1,
          "scenario": 0,
          "answers": [
            {
              "id": 12,
              "text": "Yes",
              "value": 0,
              "order": 0,
              "special": null,
              "skipTo": "nextScenario",
              "product": 1,
              "question": 5
            },
            {
              "id": 13,
              "text": "No",
              "value": 1,
              "order": 1,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 5
            }
          ]
        },
        {
          "id": 14,
          "type": "single",
          "pedagogical_type": "dimension_fluency_2",
          "question": "Would it take you more than 30 minutes to complete this task?",
          "description": null,
          "product": 1,
          "scenario": 0,
          "answers": [
            {
              "id": 41,
              "text": "Yes",
              "value": 0,
              "order": 0,
              "special": "none",
              "skipTo": null,
              "product": 1,
              "question": 14
            },
            {
              "id": 42,
              "text": "No",
              "value": 1,
              "order": 1,
              "special": "none",
              "skipTo": null,
              "product": 1,
              "question": 14
            }
          ]
        },
        {
          "id": 37,
          "type": "slider",
          "pedagogical_type": "task_question",
          "question": "In this task, calculating the interest I will be charged on this amount is",
          "description": null,
          "product": 1,
          "scenario": 23,
          "answers": [
            {
              "id": 221,
              "text": "Very difficult",
              "value": 0,
              "order": 0,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 37
            },
            {
              "id": 222,
              "text": "Difficult",
              "value": 1,
              "order": 1,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 37
            },
            {
              "id": 223,
              "text": "A little difficult",
              "value": 2,
              "order": 2,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 37
            },
            {
              "id": 224,
              "text": "Easy",
              "value": 3,
              "order": 3,
              "special": null,
              "skipTo": "nextScenario",
              "product": 1,
              "question": 37
            }
          ]
        },
        {
          "id": 38,
          "type": "multiple",
          "pedagogical_type": "challenging_skill",
          "question": "The most challenging aspect in this scenario is:",
          "description": null,
          "product": 1,
          "scenario": 23,
          "answers": [
            {
              "id": 225,
              "text": "Reading the text in the video",
              "value": 0,
              "order": 0,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 38
            },
            {
              "id": 226,
              "text": "Calculating the interest charged",
              "value": 1,
              "order": 1,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 38
            },
            {
              "id": 227,
              "text": "Using the calculator on my phone",
              "value": 2,
              "order": 2,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 38
            },
            {
              "id": 228,
              "text": "None",
              "value": -1,
              "order": 3,
              "special": "none",
              "skipTo": null,
              "product": 1,
              "question": 38
            }
          ]
        },
        {
          "id": 3,
          "type": "single",
          "pedagogical_type": "dimension_independence_1",
          "question": "Would you find this task easier with help?",
          "description": null,
          "product": 1,
          "scenario": 0,
          "answers": [
            {
              "id": 8,
              "text": "Yes",
              "value": 0,
              "order": 0,
              "special": null,
              "skipTo": "nextScenario",
              "product": 1,
              "question": 3
            },
            {
              "id": 9,
              "text": "No",
              "value": 1,
              "order": 1,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 3
            }
          ]
        },
        {
          "id": 4,
          "type": "single",
          "pedagogical_type": "dimension_confidence_1",
          "question": "Would you feel comfortable doing this task in public?",
          "description": null,
          "product": 1,
          "scenario": 0,
          "answers": [
            {
              "id": 10,
              "text": "Yes",
              "value": 0,
              "order": 0,
              "special": null,
              "skipTo": "dimension_fluency_1",
              "product": 1,
              "question": 4
            },
            {
              "id": 11,
              "text": "No",
              "value": 1,
              "order": 1,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 4
            }
          ]
        },
        {
          "id": 13,
          "type": "single",
          "pedagogical_type": "dimension_confidence_2",
          "question": "Would you feel more comfortable doing this task in private?",
          "description": null,
          "product": 1,
          "scenario": 0,
          "answers": [
            {
              "id": 39,
              "text": "Yes",
              "value": 0,
              "order": 0,
              "special": "none",
              "skipTo": null,
              "product": 1,
              "question": 13
            },
            {
              "id": 40,
              "text": "No",
              "value": 1,
              "order": 1,
              "special": "none",
              "skipTo": "nextScenario",
              "product": 1,
              "question": 13
            }
          ]
        },
        {
          "id": 5,
          "type": "single",
          "pedagogical_type": "dimension_fluency_1",
          "question": "Would it take you less than 5 minutes to complete this task?",
          "description": null,
          "product": 1,
          "scenario": 0,
          "answers": [
            {
              "id": 12,
              "text": "Yes",
              "value": 0,
              "order": 0,
              "special": null,
              "skipTo": "nextScenario",
              "product": 1,
              "question": 5
            },
            {
              "id": 13,
              "text": "No",
              "value": 1,
              "order": 1,
              "special": null,
              "skipTo": null,
              "product": 1,
              "question": 5
            }
          ]
        },
        {
          "id": 14,
          "type": "single",
          "pedagogical_type": "dimension_fluency_2",
          "question": "Would it take you more than 30 minutes to complete this task?",
          "description": null,
          "product": 1,
          "scenario": 0,
          "answers": [
            {
              "id": 41,
              "text": "Yes",
              "value": 0,
              "order": 0,
              "special": "none",
              "skipTo": null,
              "product": 1,
              "question": 14
            },
            {
              "id": 42,
              "text": "No",
              "value": 1,
              "order": 1,
              "special": "none",
              "skipTo": null,
              "product": 1,
              "question": 14
            }
          ]
        }
      ],
      "answers": [
        2,
        6,
        -1,
        -1,
        -1,
        -1,
        -1,
        0,
        1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1
      ],
      "question_answers": [],
      "question_order": [
        "task_question",
        "challenging_skill",
        "dimension_independence_1",
        "dimension_confidence_1",
        "dimension_confidence_2",
        "dimension_fluency_1",
        "dimension_fluency_2"
      ],
      "challenging_order": [
        "literacy",
        "numeracy",
        "digital_skills"
      ]
    }
    this.results = this.dataProcessingService.getResults(deleteThisLog)
    this.resultsVisualizationService.generateGraph(deleteThisLog, data => this.resultsImage = data)
    this.loadCourses(this.results).subscribe( (courses: Course[]) => {
      this.courses = courses;
      this.googleAnalyticsService.stopTimer('time_answer_interest');
      this.googleAnalyticsService.stopTimer('time_answer_scenario');
      this.googleAnalyticsService.stopTimer('time_answer_question');
      this.googleAnalyticsService.stopCounter('count_corrected_questions_per_scenario');
      this.googleAnalyticsService.stopCounter('count_plays_per_scenario');

      this.googleAnalyticsService.startTimer('time_review_results', '' + this.dataLogService.getInterest().id);
    });
    this.resultsText = this.resultsProcessingService.generateText(deleteThisLog)
  }

  loadCourses(results: Result): Observable<Course[]> {
    return this.coursesService.retrieveCourses(results);
  }

  loadLink(link: string): void {
    this.commonService.loadLink(link);
  }

  chooseArea(): void {
    this.commonService.goTo('localization', this.results);
  }

  selectNewInterest(): void {
    this.dataLogService.initializeLog();
    this.googleAnalyticsService.stopTimer('time_review_results');
    this.commonService.goTo('interests');
  }

  getPath(name: string): string {
    return this.commonService.getImagePath(name);
  }

  saveResults(): void {
    this.resultsSaverService.generateImage(
      this.resultsVisualizationService.imageToDataURI(this.resultsImage),
      this.HEADER,
      this.resultsText,
      this.LEARNING_PATHWAY_HEADER,
      this.LEARNING_PATHWAY,
      this.courses)
  }

  getCourses(priority: string): Course[] {
    if (!this.courses) {
      return [];
    }
    return this.courses.filter( course => course.priority === priority);
  }

  getResultsImage(): string {
    let r = '';
    r = this.resultsVisualizationService.imageToDataURI(this.resultsImage)
    return r;
  }

}
