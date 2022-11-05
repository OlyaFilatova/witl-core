import { Word } from "./word";

export class WordCount {
  word: Word;
  count: number = 0;
  show = true;

  constructor(word: Word) {
    this.word = word;
  }

  setCount(count: number) {
    this.count = count;
  }

  public getWord() {
    return this.word;
  }

  public getCount() {
    return this.count;
  }
}
