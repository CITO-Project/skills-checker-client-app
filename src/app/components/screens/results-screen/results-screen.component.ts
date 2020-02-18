import { Component, OnInit } from '@angular/core';
import { DataLogService } from 'src/app/services/data-log.service';
import { DataProcessingService } from 'src/app/services/data-processing.service';
import { CommonService } from 'src/app/services/common.service';
import { CoursesService } from 'src/app/services/courses.service';
import { Course } from 'src/app/models/course';
import { Observable } from 'rxjs';
import { Result } from 'src/app/models/result';

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
    private dataProcessingService: DataProcessingService) { }

  ngOnInit() {
    if (
      this.dataLogService.getProduct() === null ||
      this.dataLogService.getCategory() === null ||
      this.dataLogService.getInterest() === null
    ) {
      // this.commonService.goTo('');
    }
    this.results = this.dataProcessingService.getResults({
      "product": {
        "id": 1,
        "name": "nala",
        "description": null
      },
      "category": {
        "id": 1,
        "name": "personal",
        "text": "Personal",
        "colour": "green",
        "resource": "person-laptop.svg",
        "description": null,
        "product": 1
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
          "text": "School trip Scenario",
          "level": 1,
          "resource": "first_scenario.mp4",
          "description": "Look at tomorrow's weather forecast on your phone and decide if you can select appropiate clothing for your child",
          "product": 1,
          "interest": 3
        },
        {
          "id": 2,
          "name": "birthday_party",
          "text": "Birthday party Scenario",
          "level": 2,
          "resource": "second_scenario.mp4",
          "description": "You want to type and send a short message on WhatsApp to invite your friends to the party",
          "product": 1,
          "interest": 3
        },
        {
          "id": 3,
          "name": "buying_car",
          "text": "Buying a car Scenario",
          "level": 3,
          "resource": "third_scenario.mp4",
          "description": "You want to use the online loan calculator to find out how much you can borrow and what monthly repayment you can afford",
          "product": 1,
          "interest": 3
        },
        {
          "id": 4,
          "name": "credit_card",
          "text": "Credit card Scenario",
          "level": 4,
          "resource": "forth_scenario.mp4",
          "description": "Work out the interest charged on this amount using the calculator on your phone",
          "product": 1,
          "interest": 3
        }
      ],
      "questions": [
        {
          "id": 1,
          "type": "slider",
          "pedagogical_type": "task_question",
          "question": "For me, selecting appropriate clothes fro my child after looking at the weather forecast on my phone is",
          "description": "Description for numeracy 1",
          "product": 1,
          "scenario": 1
        },
        {
          "id": 2,
          "type": "multiple",
          "pedagogical_type": "challenging_skill",
          "question": "The most challenging aspect in this scenario is:",
          "description": "Description for digital skills 1",
          "product": 1,
          "scenario": 1
        },
        {
          "id": 3,
          "type": "single",
          "pedagogical_type": "dimension_independence",
          "question": "How difficult do you find this task?",
          "description": "Description for literacy 1",
          "product": 1,
          "scenario": 1
        },
        {
          "id": 4,
          "type": "single",
          "pedagogical_type": "dimension_confidence",
          "question": "How confident are you performing this task?",
          "description": "Description for literacy 2",
          "product": 1,
          "scenario": 1
        },
        {
          "id": 5,
          "type": "single",
          "pedagogical_type": "dimension_fluency",
          "question": "How long do you think I may take you?",
          "description": "Description for numeracy 2",
          "product": 1,
          "scenario": 1
        },
        {
          "id": 6,
          "type": "slider",
          "pedagogical_type": "task_question",
          "question": "For me, sending a message on WhatsApp to invite friends to a birthday party is",
          "description": "Description for digital skills 2",
          "product": 1,
          "scenario": 2
        },
        {
          "id": 7,
          "type": "multiple",
          "pedagogical_type": "challenging_skill",
          "question": "The most challenging aspect in this scenario is:",
          "description": "Description for literacy 3",
          "product": 1,
          "scenario": 2
        },
        {
          "id": 3,
          "type": "single",
          "pedagogical_type": "dimension_independence",
          "question": "How difficult do you find this task?",
          "description": "Description for literacy 1",
          "product": 1,
          "scenario": 2
        },
        {
          "id": 4,
          "type": "single",
          "pedagogical_type": "dimension_confidence",
          "question": "How confident are you performing this task?",
          "description": "Description for literacy 2",
          "product": 1,
          "scenario": 2
        },
        {
          "id": 5,
          "type": "single",
          "pedagogical_type": "dimension_fluency",
          "question": "How long do you think I may take you?",
          "description": "Description for numeracy 2",
          "product": 1,
          "scenario": 2
        },
        {
          "id": 8,
          "type": "slider",
          "pedagogical_type": "task_question",
          "question": "For me, using the online loan calculator is",
          "description": "Description for numeracy 3",
          "product": 1,
          "scenario": 3
        },
        {
          "id": 9,
          "type": "multiple",
          "pedagogical_type": "challenging_skill",
          "question": "The most challenging aspect in this scenario is:",
          "description": "Description for digital skills 3",
          "product": 1,
          "scenario": 3
        },
        {
          "id": 3,
          "type": "single",
          "pedagogical_type": "dimension_independence",
          "question": "How difficult do you find this task?",
          "description": "Description for literacy 1",
          "product": 1,
          "scenario": 3
        },
        {
          "id": 4,
          "type": "single",
          "pedagogical_type": "dimension_confidence",
          "question": "How confident are you performing this task?",
          "description": "Description for literacy 2",
          "product": 1,
          "scenario": 3
        },
        {
          "id": 5,
          "type": "single",
          "pedagogical_type": "dimension_fluency",
          "question": "How long do you think I may take you?",
          "description": "Description for numeracy 2",
          "product": 1,
          "scenario": 3
        },
        {
          "id": 10,
          "type": "slider",
          "pedagogical_type": "task_question",
          "question": "For me, calculating the interest I will be charged on this amount is",
          "description": "Description for numeracy 4",
          "product": 1,
          "scenario": 4
        },
        {
          "id": 11,
          "type": "multiple",
          "pedagogical_type": "challenging_skill",
          "question": "The most challenging aspect in this scenario is:",
          "description": "Description for literacy 4",
          "product": 1,
          "scenario": 4
        },
        {
          "id": 3,
          "type": "single",
          "pedagogical_type": "dimension_independence",
          "question": "How difficult do you find this task?",
          "description": "Description for literacy 1",
          "product": 1,
          "scenario": 4
        },
        {
          "id": 4,
          "type": "single",
          "pedagogical_type": "dimension_confidence",
          "question": "How confident are you performing this task?",
          "description": "Description for literacy 2",
          "product": 1,
          "scenario": 4
        },
        {
          "id": 5,
          "type": "single",
          "pedagogical_type": "dimension_fluency",
          "question": "How long do you think I may take you?",
          "description": "Description for numeracy 2",
          "product": 1,
          "scenario": 4
        }
      ],
      "answers": [
        2,
        3,
        1,
        0,
        1,
        1,
        6,
        0,
        1,
        0,
        3,
        0,
        0,
        0,
        0,
        0,
        7,
        1,
        1,
        1
      ],
      "question_answers": [
        [
          {
            "id": 1,
            "text": "Very diffucult",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 1
          },
          {
            "id": 2,
            "text": "Difficult",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 1
          },
          {
            "id": 3,
            "text": "Middling",
            "value": 2,
            "order": 2,
            "special": null,
            "product": 1,
            "question": 1
          },
          {
            "id": 4,
            "text": "Easy",
            "value": 3,
            "order": 3,
            "special": null,
            "product": 1,
            "question": 1
          }
        ],
        [
          {
            "id": 5,
            "text": "Reading words in the weather forecast",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 2
          },
          {
            "id": 6,
            "text": "Recognising the numbers",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 2
          },
          {
            "id": 7,
            "text": "Finding the weather information on my phone",
            "value": 2,
            "order": 2,
            "special": null,
            "product": 1,
            "question": 2
          },
          {
            "id": 35,
            "text": "None",
            "value": -1,
            "order": 3,
            "special": "none",
            "product": 1,
            "question": 2
          }
        ],
        [
          {
            "id": 8,
            "text": "Without help",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 3
          },
          {
            "id": 9,
            "text": "With help",
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
            "text": "In public",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 4
          },
          {
            "id": 11,
            "text": "When no one is watching",
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
            "text": "It takes me 5 minutes",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 5
          },
          {
            "id": 13,
            "text": "It takes me 30 minutes",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 5
          }
        ],
        [
          {
            "id": 8,
            "text": "Without help",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 3
          },
          {
            "id": 9,
            "text": "With help",
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
            "text": "In public",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 4
          },
          {
            "id": 11,
            "text": "When no one is watching",
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
            "text": "It takes me 5 minutes",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 5
          },
          {
            "id": 13,
            "text": "It takes me 30 minutes",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 5
          }
        ],
        [
          {
            "id": 14,
            "text": "Very difficult",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 6
          },
          {
            "id": 15,
            "text": "Difficult",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 6
          },
          {
            "id": 16,
            "text": "Middling",
            "value": 2,
            "order": 2,
            "special": null,
            "product": 1,
            "question": 6
          },
          {
            "id": 17,
            "text": "Easy",
            "value": 3,
            "order": 3,
            "special": null,
            "product": 1,
            "question": 6
          }
        ],
        [
          {
            "id": 18,
            "text": "Typing the invitation text",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 7
          },
          {
            "id": 19,
            "text": "Writing the date, start time and end time",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 7
          },
          {
            "id": 20,
            "text": "Using applications such as WhatsApp to send and receive messages",
            "value": 2,
            "order": 2,
            "special": null,
            "product": 1,
            "question": 7
          },
          {
            "id": 36,
            "text": "None",
            "value": -1,
            "order": 3,
            "special": "none",
            "product": 1,
            "question": 7
          }
        ],
        [
          {
            "id": 8,
            "text": "Without help",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 3
          },
          {
            "id": 9,
            "text": "With help",
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
            "text": "In public",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 4
          },
          {
            "id": 11,
            "text": "When no one is watching",
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
            "text": "It takes me 5 minutes",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 5
          },
          {
            "id": 13,
            "text": "It takes me 30 minutes",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 5
          }
        ],
        [
          {
            "id": 21,
            "text": "Very difficult",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 8
          },
          {
            "id": 22,
            "text": "Difficult",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 8
          },
          {
            "id": 23,
            "text": "Middling",
            "value": 2,
            "order": 2,
            "special": null,
            "product": 1,
            "question": 8
          },
          {
            "id": 24,
            "text": "Easy",
            "value": 3,
            "order": 3,
            "special": null,
            "product": 1,
            "question": 8
          }
        ],
        [
          {
            "id": 25,
            "text": "Reading the information required to use the online loan calculator",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 9
          },
          {
            "id": 26,
            "text": "Selecting a suitable monthly repayment option based on my income and expenses",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 9
          },
          {
            "id": 27,
            "text": "Accessing and using the online loan calculator",
            "value": 2,
            "order": 2,
            "special": null,
            "product": 1,
            "question": 9
          },
          {
            "id": 37,
            "text": "None",
            "value": -1,
            "order": 3,
            "special": "none",
            "product": 1,
            "question": 9
          }
        ],
        [
          {
            "id": 8,
            "text": "Without help",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 3
          },
          {
            "id": 9,
            "text": "With help",
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
            "text": "In public",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 4
          },
          {
            "id": 11,
            "text": "When no one is watching",
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
            "text": "It takes me 5 minutes",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 5
          },
          {
            "id": 13,
            "text": "It takes me 30 minutes",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 5
          }
        ],
        [
          {
            "id": 28,
            "text": "Very difficult",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 10
          },
          {
            "id": 29,
            "text": "Difficult",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 10
          },
          {
            "id": 30,
            "text": "Middling",
            "value": 2,
            "order": 2,
            "special": null,
            "product": 1,
            "question": 10
          },
          {
            "id": 31,
            "text": "Easy",
            "value": 3,
            "order": 3,
            "special": null,
            "product": 1,
            "question": 10
          }
        ],
        [
          {
            "id": 32,
            "text": "Reading the text in the video",
            "value": 0,
            "order": 0,
            "special": null,
            "product": 1,
            "question": 11
          },
          {
            "id": 33,
            "text": "Calculating the interest charged",
            "value": 1,
            "order": 1,
            "special": null,
            "product": 1,
            "question": 11
          },
          {
            "id": 34,
            "text": "Using the calculator on my phone",
            "value": 2,
            "order": 2,
            "special": null,
            "product": 1,
            "question": 11
          },
          {
            "id": 38,
            "text": "None",
            "value": -1,
            "order": 3,
            "special": "none",
            "product": 1,
            "question": 11
          }
        ]
      ],
      "question_order": [
        "task_question",
        "challenging_skill",
        "dimension_independence",
        "dimension_confidence",
        "dimension_fluency"
      ],
      "challenging_order": [
        "literacy",
        "numeracy",
        "digital_skills"
      ]
    }
    
    );
    this.loadCourses(this.results).subscribe( (courses: Course[]) => {
      this.courses = courses;
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
