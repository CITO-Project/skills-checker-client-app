import { Component, OnInit } from '@angular/core';
import { DataLogService } from 'src/app/services/data-log.service';
import { DataProcessingService } from 'src/app/services/data-processing.service';
import { CommonService } from 'src/app/services/common.service';
import { CoursesService } from 'src/app/services/courses.service';
import { Course } from 'src/app/models/course';

@Component({
  selector: 'app-results-screen',
  templateUrl: './results-screen.component.html',
  styleUrls: ['./results-screen.component.scss']
})
export class ResultsScreenComponent implements OnInit {

  public courses: Course[];

  constructor(
    private commonService: CommonService,
    private dataLogService: DataLogService,
    private coursesService: CoursesService,
    private dataProcessingService: DataProcessingService) { }

  ngOnInit() {
    const results = this.dataProcessingService.getResults({
      "product":
        {
          "id": 1,
          "name": "nala",
          "description": 'null'
        }
      ,
      "category": {
        "id": 4,
        "name": "community",
        "text": "Community",
        "colour": "red",
        "resource": "meeting.svg",
        "description": null,
        "product": 1
      },
      "interest": {
        "id": 3,
        "product": 1,
        "name": "static_interest",
        "text": "Static interest. Change afterwards"
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
          "answers": [
            "Very difficult",
            "Difficult",
            "Middling",
            "Easy"
          ],
          "description": "Description for numeracy 1",
          "product": 1,
          "scenario": 1
        },
        {
          "id": 2,
          "type": "multiple",
          "pedagogical_type": "challenging_skill",
          "question": "The most challenging aspect in this scenario is (Select all that apply):",
          "answers": [
            "Reading words in the weather forecast",
            "Recognising the numbers",
            "Finding the weather information on my phone"
          ],
          "description": "Description for digital skills 1",
          "product": 1,
          "scenario": 1
        },
        {
          "id": 3,
          "type": "single",
          "pedagogical_type": "dimension_independence",
          "question": "How difficult do you find this task?",
          "answers": [
            "Without help",
            "With help"
          ],
          "description": "Description for literacy 1",
          "product": 1,
          "scenario": 1
        },
        {
          "id": 4,
          "type": "single",
          "pedagogical_type": "dimension_confidence",
          "question": "How confident are you performing this task?",
          "answers": [
            "In public",
            "When no one is watching"
          ],
          "description": "Description for literacy 2",
          "product": 1,
          "scenario": 1
        },
        {
          "id": 5,
          "type": "single",
          "pedagogical_type": "dimension_fluency",
          "question": "How long do you think I may take you?",
          "answers": [
            "It takes me 5 minutes",
            "It takes me 30 minutes"
          ],
          "description": "Description for numeracy 2",
          "product": 1,
          "scenario": 1
        },
        {
          "id": 6,
          "type": "slider",
          "pedagogical_type": "task_question",
          "question": "For me, sending a message on WhatsApp to invite friends to a birthday party is",
          "answers": [
            "Very difficult",
            "Difficult",
            "Middling",
            "Easy"
          ],
          "description": "Description for digital skills 2",
          "product": 1,
          "scenario": 2
        },
        {
          "id": 7,
          "type": "multiple",
          "pedagogical_type": "challenging_skill",
          "question": "The most challenging aspect in this scenario is (Select all that apply):",
          "answers": [
            "Typing the invitation text",
            "Writing the date, start time and end time",
            "Using applications such as WhatsApp to send and receive messages"
          ],
          "description": "Description for literacy 3",
          "product": 1,
          "scenario": 2
        },
        {
          "id": 3,
          "type": "single",
          "pedagogical_type": "dimension_independence",
          "question": "How difficult do you find this task?",
          "answers": [
            "Without help",
            "With help"
          ],
          "description": "Description for literacy 1",
          "product": 1,
          "scenario": 2
        },
        {
          "id": 4,
          "type": "single",
          "pedagogical_type": "dimension_confidence",
          "question": "How confident are you performing this task?",
          "answers": [
            "In public",
            "When no one is watching"
          ],
          "description": "Description for literacy 2",
          "product": 1,
          "scenario": 2
        },
        {
          "id": 5,
          "type": "single",
          "pedagogical_type": "dimension_fluency",
          "question": "How long do you think I may take you?",
          "answers": [
            "It takes me 5 minutes",
            "It takes me 30 minutes"
          ],
          "description": "Description for numeracy 2",
          "product": 1,
          "scenario": 2
        },
        {
          "id": 8,
          "type": "slider",
          "pedagogical_type": "task_question",
          "question": "For me, using the online loan calculator is",
          "answers": [
            "Very difficult",
            "Difficult",
            "Middling",
            "Easy"
          ],
          "description": "Description for numeracy 3",
          "product": 1,
          "scenario": 3
        },
        {
          "id": 9,
          "type": "multiple",
          "pedagogical_type": "challenging_skill",
          "question": "The most challenging aspect in this scenario is (Select all that apply):",
          "answers": [
            "Reading the information required to use the online loan calculator",
            "Selecting a suitable monthly repayment option based on my income and expenses",
            "Accesing and using the online loan calculator"
          ],
          "description": "Description for digital skills 3",
          "product": 1,
          "scenario": 3
        },
        {
          "id": 3,
          "type": "single",
          "pedagogical_type": "dimension_independence",
          "question": "How difficult do you find this task?",
          "answers": [
            "Without help",
            "With help"
          ],
          "description": "Description for literacy 1",
          "product": 1,
          "scenario": 3
        },
        {
          "id": 4,
          "type": "single",
          "pedagogical_type": "dimension_confidence",
          "question": "How confident are you performing this task?",
          "answers": [
            "In public",
            "When no one is watching"
          ],
          "description": "Description for literacy 2",
          "product": 1,
          "scenario": 3
        },
        {
          "id": 5,
          "type": "single",
          "pedagogical_type": "dimension_fluency",
          "question": "How long do you think I may take you?",
          "answers": [
            "It takes me 5 minutes",
            "It takes me 30 minutes"
          ],
          "description": "Description for numeracy 2",
          "product": 1,
          "scenario": 3
        },
        {
          "id": 10,
          "type": "slider",
          "pedagogical_type": "task_question",
          "question": "For me, calculating the interest I will be charged on this amount is",
          "answers": [
            "Very difficult",
            "Difficult",
            "Middling",
            "Easy"
          ],
          "description": "Description for numeracy 4",
          "product": 1,
          "scenario": 4
        },
        {
          "id": 11,
          "type": "multiple",
          "pedagogical_type": "challenging_skill",
          "question": "The most challenging aspect in this scenario is (Select all that apply):",
          "answers": [
            "Reading the text in the video",
            "Calculating the interest charged",
            "Using the calculator on my phone"
          ],
          "description": "Description for literacy 4",
          "product": 1,
          "scenario": 4
        },
        {
          "id": 3,
          "type": "single",
          "pedagogical_type": "dimension_independence",
          "question": "How difficult do you find this task?",
          "answers": [
            "Without help",
            "With help"
          ],
          "description": "Description for literacy 1",
          "product": 1,
          "scenario": 4
        },
        {
          "id": 4,
          "type": "single",
          "pedagogical_type": "dimension_confidence",
          "question": "How confident are you performing this task?",
          "answers": [
            "In public",
            "When no one is watching"
          ],
          "description": "Description for literacy 2",
          "product": 1,
          "scenario": 4
        },
        {
          "id": 5,
          "type": "single",
          "pedagogical_type": "dimension_fluency",
          "question": "How long do you think I may take you?",
          "answers": [
            "It takes me 5 minutes",
            "It takes me 30 minutes"
          ],
          "description": "Description for numeracy 2",
          "product": 1,
          "scenario": 4
        }
      ],
      "answers": [
        0,
        1,
        1,
        -1,
        -1,
        3,
        -1,
        -1,
        -1,
        -1,
        2,
        6,
        1,
        -1,
        -1,
        0,
        7,
        1,
        -1,
        -1
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
    });

    console.log(results);
    // if (
    //   this.dataLogService.getProduct() === null ||
    //   this.dataLogService.getCategory() === null ||
    //   this.dataLogService.getInterest() === null
    // ) {
    //   this.commonService.goTo('');
    // }
    this.coursesService.loadCourses(
      results['literacy'],
      results['numeracy'],
      results['digital_skills']
      ).subscribe( (courses: Course[]) => {
        // this.courses = this.coursesService.getCourses();
        this.courses = courses;
        console.log(courses);
    });
  }

  loadLink(link: string): void {
    this.commonService.loadLink(link);
  }

  showAll(): void {
    this.commonService.goTo('localization');
  }

  selectNewInterest(): void {
    this.dataLogService.initializeLog();
    this.commonService.goTo('categories');
  }

  getPath(name: string): string {
    return this.commonService.getImagePath(name);
  }

  getCourses() {

  }

}
