import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringManagerService {

  constructor() { }
  
  splitTextInLines(text: string, charsPerLine: number): string[] {
    const r = [];
    let splittedText = text.split('');
    let endIndex: number = 0;
    while (text !== '') {
      if (text.length > charsPerLine) {
        if (splittedText[charsPerLine] !== ' ') {
          endIndex = text.slice(0, charsPerLine).lastIndexOf(' ')
        } else {
          endIndex = charsPerLine
        }
      } else {
        endIndex = text.length
      }
      r.push(text.slice(0, endIndex).trim())
      splittedText = text.split('')
      text = text.slice(endIndex)
    }
    return r;
  }
  
  ellipsisText(text: string, maxLength: number) : string {
    return text.length > maxLength ? text.slice(0, maxLength - 3) + '...' : text
  }

  addZeros(value: string, nZeros: number = 2): string {
    if (value.length >= nZeros) {
      return value;
    } else {
      return this.addZeros('0' + value, nZeros);
    }
  }
  
}
