import { Word } from "../entities/word";
import { WordCount } from "../entities/word-count";

export class ParseStorageString {
  public createWordsSting(
    uniqueWords: WordCount[],
    wordsDelimiter: string,
    wordInfoDelimiter: string
  ): string {
    return uniqueWords
      .map((r) => r.getWord().getText() + wordInfoDelimiter + r.getCount())
      .join(wordsDelimiter);
  }

  public stringToBookWords(
    wordsString: string,
    wordsDelimiter: string,
    wordInfoDelimiter: string
  ) {
    const words = wordsString.split(wordsDelimiter);
    const bookWords: WordCount[] = [];
    words.forEach((value) => {
      const word = value.split(wordInfoDelimiter);

      const wordCount = new WordCount(new Word(word[0]));
      wordCount.setCount(+word[1]);
      bookWords.push(wordCount);
    });

    bookWords.sort((wc1: WordCount, wc2: WordCount) => wc2.count - wc1.count);
    return bookWords;
  }
}
