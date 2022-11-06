import { WordCount } from "../entities";

export function createClipboardString(words: WordCount[]) {
  return words.map((word) => word.getWord().getText()).join("\n");
}
