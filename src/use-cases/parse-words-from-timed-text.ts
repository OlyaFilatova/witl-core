import { ParseWordsFromText } from "./parse-words-from-text";

export class ParseWordsFromTimedText extends ParseWordsFromText {
  private timestampStart = 0;
  private timestampEnd = 0;

  constructor(startTime: string, endTime: string) {
    super();

    this.setupTimestamps(startTime, endTime);
  }

  private setupTimestamps(startTime: string, endTime: string) {
    const [from_hours, from_minutes, from_seconds] = startTime.split(":");
    const [to_hours, to_minutes, to_seconds] = endTime.split(":");

    this.timestampStart =
      1000 * (+from_seconds + 60 * (+from_minutes + 60 * +from_hours));

    this.timestampEnd =
      1000 * (+to_seconds + 60 * (+to_minutes + 60 * +to_hours));
  }

  private getTextEventsInRange(timedtextJson: any) {
    return timedtextJson.events.filter(
      (el: any) =>
        el.tStartMs >= this.timestampStart && el.tStartMs <= this.timestampEnd
    );
  }

  private extractTextsFromEvents(events: any) {
    return events.map((el: any) =>
      el.segs.map((seg: any) => seg.utf8).join(" ")
    );
  }

  protected toSimpleText(timedtext: string) {
    const timedtextJson = JSON.parse(timedtext);

    const eventsToParse = this.getTextEventsInRange(timedtextJson);

    const textsToParse = this.extractTextsFromEvents(eventsToParse);

    const textToParse = textsToParse.join(" ");

    return super.toSimpleText(textToParse);
  }
}
