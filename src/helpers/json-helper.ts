export default class JsonHelper {
  static TryParse(input: string): string | any {
    try {
      return JSON.parse(input) as any;
    } catch {
      return input;
    }
  }
}
