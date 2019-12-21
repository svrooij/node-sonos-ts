export class JsonHelper {
  static TryParse(input: string): string | object {
    try {
      return JSON.parse(input) as object;
    } catch {
      return input;
    }
  }
}
