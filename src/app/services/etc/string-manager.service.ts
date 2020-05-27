import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringManagerService {

  private readonly DICTIONARY = {
    my: 'your'
  };

  constructor() { }

  splitTextInLines(text: string, charsPerLine: number): string[] {
    const r = [];
    let splittedText = text.split('');
    let endIndex = 0;
    while (text !== '') {
      if (text.length > charsPerLine) {
        if (splittedText[charsPerLine] !== ' ') {
          endIndex = text.slice(0, charsPerLine).lastIndexOf(' ');
        } else {
          endIndex = charsPerLine;
        }
      } else {
        endIndex = text.length;
      }
      r.push(text.slice(0, endIndex).trim());
      splittedText = text.split('');
      text = text.slice(endIndex);
    }
    return r;
  }

  ellipsisText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.slice(0, maxLength - 3) + '...' : text;
  }

  addZeros(value: string, nZeros: number = 2): string {
    if (value.length >= nZeros) {
      return value;
    } else {
      return this.addZeros('0' + value, nZeros);
    }
  }

  concatenateText(texts: string[], text: string = ''): string {
    if (texts.length === 0) {
      return '';
    }
    if (texts.length > 1) {
      return this.concatenateText(texts.slice(1), text + texts[0] + ', ');
    } else {
      return `${text.slice(0, -2)} and ${texts[0]}`;
    }
  }

  lowerCaseFirst(text: string): string {
    return text.slice(0, 1).toLowerCase() + text.slice(1);
  }

  correctText(text: string): string {
    Object.entries(this.DICTIONARY).forEach( ( value: [ string, string ]) => text = text.replace(value[0], value[1]));
    return text;
  }

}
