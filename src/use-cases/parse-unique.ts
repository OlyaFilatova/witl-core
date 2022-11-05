export class ParseUnique {
  private static suffixes = [
    "ism",
    "s",
    "ed",
    "er",
    "est",
    "ment",
    "ness",
    "less",
    "ship",
    "able",
    "ing",
    "dom",
    "ize",
    "ise",
    "ish",
  ];

  public static removeRootDoubles(
    wordCounter: Record<string, number>,
    uniqueWords: string[]
  ) {
    uniqueWords.forEach((word) => {
      const possibleCopies = this.getPossibleCopies(word);

      const alternativeWordToReplaceWith =
        this.getAlternativeWordToReplaceWith(word);

      if (!alternativeWordToReplaceWith) return;

      const smallesWord = this.ensureSmallestWordIsUsed(
        word,
        possibleCopies,
        wordCounter,
        alternativeWordToReplaceWith
      );

      const mentionsCount = this.removeCopies(possibleCopies, wordCounter);

      wordCounter[smallesWord] += mentionsCount;
    });
  }

  private static getPossibleCopies(word: string) {
    const possibleCopies = [
      ...this.suffixes.map((ending) => word.slice(0, word.length - 1) + ending),
      ...this.suffixes.map((ending) => word + ending),
      ...this.suffixes.map((ending) => word + word.slice(-1) + ending),
    ];

    const hasIesEnding = word.slice(word.length - 3) === "ies";
    const hasIedEnding = word.slice(word.length - 3) === "ied";

    if (hasIesEnding || hasIedEnding) {
      possibleCopies.push(word.slice(0, word.length - 3) + "y");
    }

    return Array.from(new Set(possibleCopies));
  }

  private static getAlternativeWordToReplaceWith(word: string) {
    let alternativeWordToReplaceWith;
    for (const ending of this.suffixes) {
      if (word.endsWith(ending)) {
        alternativeWordToReplaceWith = word.slice(
          0,
          word.length - ending.length
        );
      }
    }
    return alternativeWordToReplaceWith;
  }

  private static ensureSmallestWordIsUsed(
    word: string,
    possibleCopies: string[],
    wordCounter: Record<string, number>,
    alternativeWordToReplaceWith: string
  ) {
    if (possibleCopies.includes(alternativeWordToReplaceWith)) {
      possibleCopies.splice(
        possibleCopies.indexOf(alternativeWordToReplaceWith),
        1
      );
    }

    if (wordCounter.hasOwnProperty(alternativeWordToReplaceWith)) {
      possibleCopies.push(word);
      word = alternativeWordToReplaceWith;
    }
    return word;
  }

  private static removeCopies(
    possibleCopies: string[],
    wordCounter: Record<string, number>
  ) {
    let mentionsCount = 0;
    for (const possible of possibleCopies) {
      mentionsCount += this.removeWord(wordCounter, possible);
    }
    return mentionsCount;
  }

  private static removeWord(
    wordCounter: Record<string, number>,
    wordToRemove: string
  ) {
    let addCount;
    if (wordCounter.hasOwnProperty(wordToRemove)) {
      addCount = wordCounter[wordToRemove];
      delete wordCounter[wordToRemove];
    }
    if (!addCount) {
      addCount = 0;
    }
    return addCount;
  }
}
