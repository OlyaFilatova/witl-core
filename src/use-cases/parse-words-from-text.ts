import { WordCount } from "../entities/word-count";
import { Word } from "../entities/word";
import { ParseResult } from "../entities/parse-result";

import { ParseUnique } from "./parse-unique";

export class ParseWordsFromText {
  public parse(
    text: string,
    knownWords: string[] = [],
    cleanRootDoubles = false
  ): ParseResult {
    text = this.toSimpleText(text).toLowerCase();
    const textWords = this.toList(text);

    const uniqueWordsRes = this.getUniqueWordsList(textWords, cleanRootDoubles);

    const knownAndUnknownWords = this.separateToKnownAndUnknown(
      uniqueWordsRes,
      knownWords
    );

    return {
      uniqueWordsRes: knownAndUnknownWords.uniqueWordsRes,
      knownWords: knownAndUnknownWords.knownWords,
    };
  }

  protected toSimpleText(text: string) {
    return this.removeYoutubeTimedTextKeys(text)
      .replace(/\n/g, " ")
      .replace(/([^a-zA-Z '-])+/g, " ")
      .replace(/' /g, " ")
      .replace(/ '/g, " ")
      .replace(/- /g, " ")
      .replace(/ -/g, " ");
  }

  protected removeYoutubeTimedTextKeys(text: string) {
    return text
      .replace(/wireMagic/g, " ")
      .replace(/\"pens\"/g, " ")
      .replace(/wsWinStyles/g, " ")
      .replace(/wpWinPositions/g, " ")
      .replace(/\"events\"/g, " ")
      .replace(/\"utf8\"/g, " ")
      .replace(/tStartMs/g, " ")
      .replace(/dDurationMs/g, " ")
      .replace(/segs/g, " ");
  }

  private toList(text: string) {
    let words = text.split(" ");
    words = words.filter((value) => value !== "");
    return words;
  }

  private getUniqueWordsList(textWords: string[], cleanRootDoubles = false) {
    const uniqueWordsRes: WordCount[] = [];
    const uniqueWords: string[] = [];
    const wordCounter: Record<string, number> = {};

    this.countWords(textWords, wordCounter, uniqueWords);

    this.removeDoubles(cleanRootDoubles, wordCounter, uniqueWords);

    this.addWordsToArray(wordCounter, uniqueWordsRes);

    this.sortByText(uniqueWordsRes);

    return uniqueWordsRes;
  }

  private countWords(
    textWords: string[],
    wordCounter: Record<string, number>,
    uniqueWords: string[]
  ) {
    textWords.forEach((word: string) => {
      if (word.length <= 2) {
        return;
      }
      this.addWordToCounter(wordCounter, uniqueWords, word);
      wordCounter[word] += 1;
    });
  }

  private removeDoubles(
    cleanRootDoubles: boolean,
    wordCounter: Record<string, number>,
    uniqueWords: string[]
  ) {
    if (cleanRootDoubles) {
      ParseUnique.removeRootDoubles(wordCounter, uniqueWords);
    }
  }

  private addWordsToArray(
    wordCounter: Record<string, number>,
    uniqueWordsRes: WordCount[]
  ) {
    Object.keys(wordCounter).forEach((word) => {
      const wordCount = new WordCount(new Word(word));
      wordCount.setCount(wordCounter[word]);
      uniqueWordsRes.push(wordCount);
    });
  }

  private sortByText(uniqueWordsRes: WordCount[]) {
    uniqueWordsRes.sort((wc1: WordCount, wc2: WordCount) => {
      if (wc1.getWord().getText() < wc2.getWord().getText()) {
        return -1;
      }
      if (wc1.getWord().getText() > wc2.getWord().getText()) {
        return 1;
      }
      return 0;
    });
  }

  private addWordToCounter(
    wordCounter: Record<string, number>,
    uniqueWords: string[],
    word: string
  ) {
    if (!wordCounter.hasOwnProperty(word) && word.length > 2) {
      uniqueWords.push(word);
      wordCounter[word] = 0;
    }
  }

  public separateToKnownAndUnknown(
    uniqueWordsRes: WordCount[],
    knownWords: string[]
  ) {
    let existingKnownWords = [];
    let unknownWords = [];

    existingKnownWords = uniqueWordsRes.filter(
      (element) => knownWords.indexOf(element.getWord().getText()) !== -1
    );
    unknownWords = uniqueWordsRes
      .filter(
        (element) => knownWords.indexOf(element.getWord().getText()) === -1
      )
      .sort((a, b) => b.count - a.count);

    return {
      uniqueWordsRes: unknownWords,
      knownWords: existingKnownWords,
    };
  }
}
