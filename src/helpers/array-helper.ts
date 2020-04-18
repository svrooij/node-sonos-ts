export default class ArrayHelper {
  static ForceArray<TResponse>(input: TResponse | Array<TResponse>): Array<TResponse> {
    return Array.isArray(input) ? input : [input];
  }
}
