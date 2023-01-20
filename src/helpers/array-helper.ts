/**
 * Array helper is to convert objects to single item arrays.
 */
export default class ArrayHelper {
  static ForceArray<TResponse>(input: TResponse | Array<TResponse>): Array<TResponse> {
    if (input === undefined) {
      return [];
    }
    return Array.isArray(input) ? input : [input];
  }
}
