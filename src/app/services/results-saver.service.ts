import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { Course } from '../models/course';

@Injectable({
  providedIn: 'root'
})
export class ResultsSaverService {

  private readonly IMG_WIDTH = 700;
  private IMG_HEIGHT = 400;


  private canvas: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas')
    this.canvas.height = this.IMG_HEIGHT;
    this.canvas.width = this.IMG_WIDTH;
    this.canvas.setAttribute('download', 'MintyPaper.png');

    this.canvasContext = this.canvas.getContext('2d');
  }

  generateImage(
    graphDataURI: string,
    resultsText: string,
    learningPathwayDescription: string,
    learningPathway: Course[]
    ) {
      const _image = new Image();
      _image.onload = ( () => {
        // Drawing background
        this.canvasContext.fillStyle = 'red';
        this.canvasContext.rect(0, 0, this.IMG_WIDTH, 400);
        this.canvasContext.fill()

        // Drawing graph
        this.canvasContext.fillStyle = 'green';
        this.canvasContext.rect(10, 10, 700, 700);
        this.canvasContext.fill()
        this.canvasContext.drawImage(_image, 10, 10, 350, 350);

        // Writing results text
        this.canvasContext.fillStyle = 'black'
        this.canvasContext.textBaseline = 'middle'
        this.canvasContext.font = '20px Raleway'


        // Test
        resultsText = 'An example of some additional text beside the balloons... in this space here!'

// TODO
// Need to split text in multiple lines dynamically



        const _resultTextSplitter =  resultsText.split(' ')
        const WORDS_PER_LINE = 5
        for(let i = 0; i < _resultTextSplitter.length; i + WORDS_PER_LINE) {

        }
        this.canvasContext.fillText(resultsText, 350, 350);


        // Generating PNG and downloading
        const _temp = this.canvas.toDataURL('image/png').replace("image/png", "image/octet-stream")
        saveAs(_temp, 'results.png')
      })
      _image.src = graphDataURI;
  }
}
