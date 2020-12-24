export default class JsonHelper {
  static TryParse(input: string): string | unknown {
    try {
      return JSON.parse(input) as unknown;
    } catch {
      return input;
    }
  }
}
