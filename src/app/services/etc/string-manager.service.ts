import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringManagerService {

  private readonly DICTIONARY = {
    my: 'your',
    me: 'you',
    I: 'you'
  };
  private readonly SEPARATORS = ['-', '_'];

  public readonly TEXTS = {
    literacy: $localize`:@@skill-reading-and-writing:reading and writing`,
    numeracy: $localize`:@@skill-maths:maths`,
    digital_skills: $localize`:@@skill-computers:computers`,
    fluency: $localize`:@@dimension-fluency:faster`,
    confidence: $localize`:@@dimension-confidence:more confidently`,
    independence: $localize`:@@dimension-independence:without help`
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

      if( endIndex === 0 ) {
        endIndex++;
      }

      r.push(text.slice(0, endIndex).trim());
      text = text.slice(endIndex);
      splittedText = text.split('');
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

  concatenateText(texts: string[]): string {
    if (texts.length > 2) {
      return `${texts[0]}, ${this.concatenateText(texts.slice(1))}`;
    } else {
      switch (texts.length) {
        case 0:
          return '';
        case 1:
          return texts[0];
        case 2:
          return texts[0] + ' ' + $localize`and` + ' ' + texts[1];
      }
    }
  }

  lowerCaseFirst(text: string): string {
    return text.slice(0, 1).toLowerCase() + text.slice(1);
  }

  correctText(text: string): string {
    const words = text.split(' ');
    Object.entries(this.DICTIONARY).forEach(
      ( value: [ string, string ]) => {
        const index = words.findIndex( (word: string) => word === value[0]);
        if (index >= 0) {
          words[index] = value[1];
        }
      });
    return words.join(' ');
  }

  normalizeText(text: string): string {
    if (!text) {
      return '';
    }
    const textSplitted = text.split('');
    textSplitted[0] = textSplitted[0].toUpperCase();
    textSplitted.forEach( (char: string, index: number) => {
      if (this.SEPARATORS.includes(char)) {
        textSplitted[index] = ' ';
      }
    });
    text = textSplitted.join('');
    return text;
  }

}
