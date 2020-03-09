import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Course } from 'src/app/models/course';
import { Result } from 'src/app/models/result';

import { DataProcessingService } from 'src/app/services/data-processing.service';
import { CommonService } from 'src/app/services/common.service';
import { CoursesService } from 'src/app/services/courses.service';
import { DataLogService } from 'src/app/services/data-log.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@Component({
  selector: 'app-results-screen',
  templateUrl: './results-screen.component.html',
  styleUrls: ['./results-screen.component.scss']
})
export class ResultsScreenComponent implements OnInit {

  public courses: Course[];
  public results: Result;

  constructor(
    private commonService: CommonService,
    private dataLogService: DataLogService,
    private coursesService: CoursesService,
    private dataProcessingService: DataProcessingService,
    private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    // if (
    //   this.dataLogService.getProduct() === null ||
    //   this.dataLogService.getCategory() === null ||
    //   this.dataLogService.getInterest() === null
    // ) {
    //   this.commonService.goTo('');
    // }
    // this.results = this.dataProcessingService.getResults(this.dataLogService.getAll());
    this.results = this.dataProcessingService.getResults({
      "product": {
        "id": 1,
        "name": "nala",
        "description": null
      },
      "category": {
        "id": 4,
        "name": "social",
        "text": "Social",
        "colour": "red",
        "resource": "meeting.svg",
        "description": null,
        "product": 1
      },
      "interest": {
        "id": 22,
        "name": "participate-activities",
        "text": "Be able to participate in local activities and events with friends and peers",
        "resource": "webpage-people.svg",
        "description": null,
        "product": 1,
        "category": 4
      },
      "scenarios": [
        {
          "id": 60,
          "name": "look_train_timetable",
          "text": "Look train timetable",
          "level": 1,
          "resource": "select-train-time.mp4",
          "description": "You are meeting a friend at Dublin Connolly at 3.00 PM. You have to take the train from Malahide to Dublin Connolly. You have the train timetable saved on your phone as an offline file. Look at the train timetable on your phone and decide if you can select the train that will allow you to arrive at Dublin Connolly a few minutes before 3.00 PM",
          "product": 1,
          "interest": 22
        },
        {
          "id": 61,
          "name": "check_rain_for_holidays",
          "text": "Check rain for holidays",
          "level": 2,
          "resource": "select-month-least-rain.mp4",
          "description": "You would like to go to Rome, Italy for your summer holiday with two friends. Decide if you can find weather information for Rome online and then look at the weather forecast graph and decide if you can select the month with no chance of rain.",
          "product": 1,
          "interest": 22
        },
        {
          "id": 62,
          "name": "calculate_recipe",
          "text": "Calculate recipe",
          "level": 3,
          "resource": "calculate-quantities-cooking.mp4",
          "description": "Your friends are coming to your house for dinner. You want to make spaghetti carbonara for them and want to check if anyone is allergic to any of the ingredients. Read the recipe and decide if you can text your friends the ingredients. Then, decide if you can adjust the quantities in the recipe so as to serve 8 people.",
          "product": 1,
          "interest": 22
        },
        {
          "id": 63,
          "name": "create_fish_pond",
          "text": "Create fish pond",
          "level": 4,
          "resource": "calculate-area-pond.mp4",
          "description": "You are creating a community garden with a circular fish pond in the centre. The fish pond is 6 m in diameter. Decide if you can calculate the area of the fish pond. You also want to share pictures of the garden with your neighbours on Facebook.",
          "product": 1,
          "interest": 22
        }
      ],
      "questions": [
        {
          "id": 114,
          "type": "slider",
          "pedagogical_type": "task_question",
          "question": "For me, selecting the train that will allow me to arrive in Dublin just a few minutes before 3.00 PM is",
          "description": null,
          "product": 1,
          "scenario": 60
        },
        {
          "id": 113,
          "type": "multiple",
          "pedagogical_type": "challenging_skill",
          "question": "The most challenging aspect in this scenario is:",
          "description": null,
          "product": 1,
          "scenario": 60
        },
        {
          "id": 3,
          "type": "single",
          "pedagogical_type": "dimension_independence_1",
          "question": "Would you find this task easier with help?",
          "description": null,
          "product": 1,
          "scenario": 60
        },
        {
          "id": 4,
          "type": "single",
          "pedagogical_type": "dimension_confidence_1",
          "question": "Would you feel comfortable doing this task in public?",
          "description": null,
          "product": 1,
          "scenario": 60
        },
        {
          "id": 13,
          "type": "single",
          "pedagogical_type": "dimension_confidence_2",
          "question": "Would you feel more comfortable doing this task in private?",
          "description": null,
          "product": 1,
          "scenario": 60
        },
        {
          "id": 5,
          "type": "single",
          "pedagogical_type": "dimension_fluency_1",
          "question": "Would it take you less than 5 minutes to complete this task?",
          "description": null,
          "product": 1,
          "scenario": 60
        },
        {
          "id": 14,
          "type": "single",
          "pedagogical_type": "dimension_fluency_2",
          "question": "Would it take you more than 30 minutes to complete this task?",
          "description": null,
          "product": 1,
          "scenario": 60
        },
        {
          "id": 115,
          "type": "slider",
          "pedagogical_type": "task_question",
          "question": "For me, selecting the month with no chance of rain by looking at the weather forecast graph is",
          "description": null,
          "product": 1,
          "scenario": 61
        },
        {
          "id": 116,
          "type": "multiple",
          "pedagogical_type": "challenging_skill",
          "question": "The most challenging aspect in this scenario is:",
          "description": null,
          "product": 1,
          "scenario": 61
        },
        {
          "id": 3,
          "type": "single",
          "pedagogical_type": "dimension_independence_1",
          "question": "Would you find this task easier with help?",
          "description": null,
          "product": 1,
          "scenario": 61
        },
        {
          "id": 4,
          "type": "single",
          "pedagogical_type": "dimension_confidence_1",
          "question": "Would you feel comfortable doing this task in public?",
          "description": null,
          "product": 1,
          "scenario": 61
        },
        {
          "id": 13,
          "type": "single",
          "pedagogical_type": "dimension_confidence_2",
          "question": "Would you feel more comfortable doing this task in private?",
          "description": null,
          "product": 1,
          "scenario": 61
        },
        {
          "id": 5,
          "type": "single",
          "pedagogical_type": "dimension_fluency_1",
          "question": "Would it take you less than 5 minutes to complete this task?",
          "description": null,
          "product": 1,
          "scenario": 61
        },
        {
          "id": 14,
          "type": "single",
          "pedagogical_type": "dimension_fluency_2",
          "question": "Would it take you more than 30 minutes to complete this task?",
          "description": null,
          "product": 1,
          "scenario": 61
        },
        {
          "id": 118,
          "type": "slider",
          "pedagogical_type": "task_question",
          "question": "For me, texting the ingredients to my friends and adjusting the quantities in the recipe to serve 8 people is",
          "description": null,
          "product": 1,
          "scenario": 62
        },
        {
          "id": 117,
          "type": "multiple",
          "pedagogical_type": "challenging_skill",
          "question": "The most challenging aspect in this scenario is:",
          "description": null,
          "product": 1,
          "scenario": 62
        },
        {
          "id": 3,
          "type": "single",
          "pedagogical_type": "dimension_independence_1",
          "question": "Would you find this task easier with help?",
          "description": null,
          "product": 1,
          "scenario": 62
        },
        {
          "id": 4,
          "type": "single",
          "pedagogical_type": "dimension_confidence_1",
          "question": "Would you feel comfortable doing this task in public?",
          "description": null,
          "product": 1,
          "scenario": 62
        },
        {
          "id": 13,
          "type": "single",
          "pedagogical_type": "dimension_confidence_2",
          "question": "Would you feel more comfortable doing this task in private?",
          "description": null,
          "product": 1,
          "scenario": 62
        },
        {
          "id": 5,
          "type": "single",
          "pedagogical_type": "dimension_fluency_1",
          "question": "Would it take you less than 5 minutes to complete this task?",
          "description": null,
          "product": 1,
          "scenario": 62
        },
        {
          "id": 14,
          "type": "single",
          "pedagogical_type": "dimension_fluency_2",
          "question": "Would it take you more than 30 minutes to complete this task?",
          "description": null,
          "product": 1,
          "scenario": 62
        },
        {
          "id": 120,
          "type": "slider",
          "pedagogical_type": "task_question",
          "question": "For me, calculating the area of the fish pond and uploading photos of the garden to Facebook to share with members of my community is",
          "description": null,
          "product": 1,
          "scenario": 63
        },
        {
          "id": 119,
          "type": "multiple",
          "pedagogical_type": "challenging_skill",
          "question": "The most challenging aspect in this scenario is:",
          "description": null,
          "product": 1,
          "scenario": 63
        },
        {
          "id": 3,
          "type": "single",
          "pedagogical_type": "dimension_independence_1",
          "question": "Would you find this task easier with help?",
          "description": null,
          "product": 1,
          "scenario": 63
        },
        {
          "id": 4,
          "type": "single",
          "pedagogical_type": "dimension_confidence_1",
          "question": "Would you feel comfortable doing this task in public?",
          "description": null,
          "product": 1,
          "scenario": 63
        },
        {
          "id": 13,
          "type": "single",
          "pedagogical_type": "dimension_confidence_2",
          "question": "Would you feel more comfortable doing this task in private?",
          "description": null,
          "product": 1,
          "scenario": 63
        },
        {
          "id": 5,
          "type": "single",
          "pedagogical_type": "dimension_fluency_1",
          "question": "Would it take you less than 5 minutes to complete this task?",
          "description": null,
          "product": 1,
          "scenario": 63
        },
        {
          "id": 14,
          "type": "single",
          "pedagogical_type": "dimension_fluency_2",
          "question": "Would it take you more than 30 minutes to complete this task?",
          "description": null,
          "product": 1,
          "scenario": 63
        }
      ],
      "question_answers": [
        [
          {
            "id": 568,
            "text": "Reading the words",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 113
          },
          {
            "id": 569,
            "text": "Recognising the numbers",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 113
          },
          {
            "id": 570,
            "text": "Finding the train timetable file on my phone",
            "value": 2,
            "order": 2,
            "special": null,
            "product": 1,
            "question": 113
          },
          {
            "id": 571,
            "text": "None",
            "value": -1,
            "order": 3,
            "special": "none",
            "product": 1,
            "question": 113
          }
        ],
        [
          {
            "id": 572,
            "text": "Very difficult",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 114
          },
          {
            "id": 573,
            "text": "Difficult",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 114
          },
          {
            "id": 574,
            "text": "A little difficult",
            "value": 2,
            "order": 2,
            "special": null,
            "product": 1,
            "question": 114
          },
          {
            "id": 575,
            "text": "Easy",
            "value": 3,
            "order": 3,
            "special": null,
            "product": 1,
            "question": 114
          }
        ],
        [
          {
            "id": 8,
            "text": "Yes",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 3
          },
          {
            "id": 9,
            "text": "No",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 3
          }
        ],
        [
          {
            "id": 10,
            "text": "Yes",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 4
          },
          {
            "id": 11,
            "text": "No",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 4
          }
        ],
        [
          {
            "id": 12,
            "text": "Yes",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 5
          },
          {
            "id": 13,
            "text": "No",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 5
          }
        ],
        [
          {
            "id": 39,
            "text": "Yes",
            "value": 0,
            "order": 0,
            "special": "none",
            "product": 1,
            "question": 13
          },
          {
            "id": 40,
            "text": "No",
            "value": 1,
            "order": 1,
            "special": "none",
            "product": 1,
            "question": 13
          }
        ],
        [
          {
            "id": 41,
            "text": "Yes",
            "value": 0,
            "order": 0,
            "special": "none",
            "product": 1,
            "question": 14
          },
          {
            "id": 42,
            "text": "No",
            "value": 1,
            "order": 1,
            "special": "none",
            "product": 1,
            "question": 14
          }
        ],
        [
          {
            "id": 576,
            "text": "Very difficult",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 115
          },
          {
            "id": 577,
            "text": "Difficult",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 115
          },
          {
            "id": 578,
            "text": "A little difficult",
            "value": 2,
            "order": 2,
            "special": null,
            "product": 1,
            "question": 115
          },
          {
            "id": 579,
            "text": "Easy",
            "value": 3,
            "order": 3,
            "special": null,
            "product": 1,
            "question": 115
          }
        ],
        [
          {
            "id": 580,
            "text": "Reading the text",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 116
          },
          {
            "id": 581,
            "text": "Interpreting the graph",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 116
          },
          {
            "id": 582,
            "text": "Finding weather information for Rome online",
            "value": 2,
            "order": 2,
            "special": null,
            "product": 1,
            "question": 116
          },
          {
            "id": 583,
            "text": "None",
            "value": -1,
            "order": 3,
            "special": "none",
            "product": 1,
            "question": 116
          }
        ],
        [
          {
            "id": 8,
            "text": "Yes",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 3
          },
          {
            "id": 9,
            "text": "No",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 3
          }
        ],
        [
          {
            "id": 10,
            "text": "Yes",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 4
          },
          {
            "id": 11,
            "text": "No",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 4
          }
        ],
        [
          {
            "id": 12,
            "text": "Yes",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 5
          },
          {
            "id": 13,
            "text": "No",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 5
          }
        ],
        [
          {
            "id": 39,
            "text": "Yes",
            "value": 0,
            "order": 0,
            "special": "none",
            "product": 1,
            "question": 13
          },
          {
            "id": 40,
            "text": "No",
            "value": 1,
            "order": 1,
            "special": "none",
            "product": 1,
            "question": 13
          }
        ],
        [
          {
            "id": 41,
            "text": "Yes",
            "value": 0,
            "order": 0,
            "special": "none",
            "product": 1,
            "question": 14
          },
          {
            "id": 42,
            "text": "No",
            "value": 1,
            "order": 1,
            "special": "none",
            "product": 1,
            "question": 14
          }
        ],
        [
          {
            "id": 584,
            "text": "Reading the recipe",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 117
          },
          {
            "id": 585,
            "text": "Adjusting the quantities",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 117
          },
          {
            "id": 586,
            "text": "Texting the ingredients to my friends",
            "value": 2,
            "order": 2,
            "special": null,
            "product": 1,
            "question": 117
          },
          {
            "id": 587,
            "text": "None",
            "value": -1,
            "order": 3,
            "special": "none",
            "product": 1,
            "question": 117
          }
        ],
        [
          {
            "id": 588,
            "text": "Very difficult",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 118
          },
          {
            "id": 589,
            "text": "Difficult",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 118
          },
          {
            "id": 590,
            "text": "A little difficult",
            "value": 2,
            "order": 2,
            "special": null,
            "product": 1,
            "question": 118
          },
          {
            "id": 591,
            "text": "Easy",
            "value": 3,
            "order": 3,
            "special": null,
            "product": 1,
            "question": 118
          }
        ],
        [
          {
            "id": 8,
            "text": "Yes",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 3
          },
          {
            "id": 9,
            "text": "No",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 3
          }
        ],
        [
          {
            "id": 10,
            "text": "Yes",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 4
          },
          {
            "id": 11,
            "text": "No",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 4
          }
        ],
        [
          {
            "id": 12,
            "text": "Yes",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 5
          },
          {
            "id": 13,
            "text": "No",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 5
          }
        ],
        [
          {
            "id": 39,
            "text": "Yes",
            "value": 0,
            "order": 0,
            "special": "none",
            "product": 1,
            "question": 13
          },
          {
            "id": 40,
            "text": "No",
            "value": 1,
            "order": 1,
            "special": "none",
            "product": 1,
            "question": 13
          }
        ],
        [
          {
            "id": 41,
            "text": "Yes",
            "value": 0,
            "order": 0,
            "special": "none",
            "product": 1,
            "question": 14
          },
          {
            "id": 42,
            "text": "No",
            "value": 1,
            "order": 1,
            "special": "none",
            "product": 1,
            "question": 14
          }
        ],
        [
          {
            "id": 592,
            "text": "Reading the text",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 119
          },
          {
            "id": 593,
            "text": "Calculating the area of the fish pond",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 119
          },
          {
            "id": 594,
            "text": "Uploading pictures to Facebook and sharing them with specific friends",
            "value": 2,
            "order": 2,
            "special": null,
            "product": 1,
            "question": 119
          },
          {
            "id": 595,
            "text": "None",
            "value": -1,
            "order": 3,
            "special": "none",
            "product": 1,
            "question": 119
          }
        ],
        [
          {
            "id": 596,
            "text": "Very difficult",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 120
          },
          {
            "id": 597,
            "text": "Difficult",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 120
          },
          {
            "id": 598,
            "text": "A little difficult",
            "value": 2,
            "order": 2,
            "special": null,
            "product": 1,
            "question": 120
          },
          {
            "id": 599,
            "text": "Easy",
            "value": 3,
            "order": 3,
            "special": null,
            "product": 1,
            "question": 120
          }
        ],
        [
          {
            "id": 8,
            "text": "Yes",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 3
          },
          {
            "id": 9,
            "text": "No",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 3
          }
        ],
        [
          {
            "id": 10,
            "text": "Yes",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 4
          },
          {
            "id": 11,
            "text": "No",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 4
          }
        ],
        [
          {
            "id": 12,
            "text": "Yes",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 5
          },
          {
            "id": 13,
            "text": "No",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 5
          }
        ],
        [
          {
            "id": 39,
            "text": "Yes",
            "value": 0,
            "order": 0,
            "special": "none",
            "product": 1,
            "question": 13
          },
          {
            "id": 40,
            "text": "No",
            "value": 1,
            "order": 1,
            "special": "none",
            "product": 1,
            "question": 13
          }
        ],
        [
          {
            "id": 41,
            "text": "Yes",
            "value": 0,
            "order": 0,
            "special": "none",
            "product": 1,
            "question": 14
          },
          {
            "id": 42,
            "text": "No",
            "value": 1,
            "order": 1,
            "special": "none",
            "product": 1,
            "question": 14
          }
        ]
      ],
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
      ],
      "answers": [
        3,
        0,
        0,
        0,
        -1,
        0,
        -1,

        2,
        6,
        0,
        0,
        -1,
        1,
        0,

        1,
        7,
        1,
        1,
        0,
        0,
        -1,

        0,
        7,
        1,
        1,
        1,
        1,
        1
      ]
    }
    );
    this.loadCourses(this.results).subscribe( (courses: Course[]) => {
      this.courses = courses;
      this.googleAnalyticsService.stopTimer('time_answer_interest');
      this.googleAnalyticsService.stopTimer('time_answer_scenario');
      this.googleAnalyticsService.stopTimer('time_answer_question');
      this.googleAnalyticsService.stopCounter('count_corrected_questions_per_scenario');
      this.googleAnalyticsService.stopCounter('count_plays_per_scenario');

      this.googleAnalyticsService.startTimer('time_review_results', '' + this.dataLogService.getInterest().id);
    });
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
    this.commonService.goTo('categories');
  }

  getPath(name: string): string {
    return this.commonService.getImagePath(name);
  }

  getCourses(priority: string): Course[] {
    if (!this.courses) {
      return [];
    }
    return this.courses.filter( course => course.priority === priority);
  }

}
