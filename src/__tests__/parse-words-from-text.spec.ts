import { ParseWordsFromText } from "../use-cases/parse-words-from-text";

function createParseText() {
  return new ParseWordsFromText();
}

describe("Parse Text", () => {
  it("should return empty list on empty string passed", () => {
    const parseText: ParseWordsFromText = createParseText();
    expect(parseText.parse("").uniqueWordsRes).toEqual([]);
  });
  it("should return list with one WordCount on string when one word passed", () => {
    const parseText: ParseWordsFromText = createParseText();
    const res = parseText.parse("sea").uniqueWordsRes;
    expect(res.length).toBe(1);
    expect(res[0].word.text).toBe("sea");
    expect(res[0].count).toBe(1);
  });
  it("should return list with two WordCount when two words passed", () => {
    const parseText: ParseWordsFromText = createParseText();
    const res = parseText.parse("sea salt").uniqueWordsRes;
    const texts = res.map((el) => el.word.text);
    expect(res.length).toBe(2);
    expect(texts.includes("sea")).toBeTruthy();
    expect(texts.includes("salt")).toBeTruthy();
  });
  it("should return list with one WordCount when one word typed twice passed", () => {
    const parseText: ParseWordsFromText = createParseText();
    const res = parseText.parse("buffalo buffalo").uniqueWordsRes;
    expect(res.length).toBe(1);
    expect(res[0].word.text).toBe("buffalo");
    expect(res[0].count).toBe(2);
  });
  it("should return list with one WordCount with count 3 when one word typed three times passed", () => {
    const parseText: ParseWordsFromText = createParseText();
    const res = parseText.parse("police police police").uniqueWordsRes;
    expect(res.length).toBe(1);
    expect(res[0].word.text).toBe("police");
    expect(res[0].count).toBe(3);
  });
  it('should return list with two WordCount where word "second" goes first when "test second second" passed', () => {
    const parseText: ParseWordsFromText = createParseText();
    const res = parseText.parse("test second second").uniqueWordsRes;
    expect(res.length).toBe(2);
    expect(res[0].word.text).toBe("second");
    expect(res[0].count).toBe(2);
  });
});
