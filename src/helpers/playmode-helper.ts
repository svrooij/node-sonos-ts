import { PlayMode, Repeat } from '../models';

/**
 * PlayModeHelper helps splitting and computing PlayMode
 */
export default class PlayModeHelper {
  /**
   * Combine Shuffle and Repeat to new playmode
   * @param shuffle Shuffle on or off
   * @param repeat Repeat value
   * @returns {PlayMode} Computed PlayMode based on inputs
   */
  public static ComputePlayMode(shuffle: boolean, repeat: Repeat): PlayMode {
    switch (repeat) {
      case Repeat.Off:
        return shuffle ? PlayMode.ShuffleNoRepeat : PlayMode.Normal;
      case Repeat.RepeatAll:
        return shuffle ? PlayMode.Shuffle : PlayMode.RepeatAll;
      case Repeat.RepeatOne:
        return shuffle ? PlayMode.ShuffleRepeatOne : PlayMode.RepeatOne;
      default:
        throw new Error('Repeat not set in switch');
    }
  }

  private static repeatMap: { [key in PlayMode]: Repeat } = {
    [PlayMode.RepeatAll]: Repeat.RepeatAll,
    [PlayMode.Shuffle]: Repeat.RepeatAll,
    [PlayMode.RepeatOne]: Repeat.RepeatOne,
    [PlayMode.ShuffleRepeatOne]: Repeat.RepeatOne,
    [PlayMode.Normal]: Repeat.Off,
    [PlayMode.ShuffleNoRepeat]: Repeat.Off,
  };

  /**
   * Get the Repeat part from PlayMode
   * @param playmode Current PlayMode
   * @returns {Repeat} Repeat part of playmode
   */
  public static ComputeRepeat(playmode: PlayMode): Repeat {
    return this.repeatMap[playmode];
  }

  private static shuffleOn = [PlayMode.Shuffle, PlayMode.ShuffleNoRepeat, PlayMode.ShuffleRepeatOne];

  /**
   * Get the shuffle part of playmode
   * @param playmode Current PlayMode
   * @returns {boolean} Shuffle on or off
   */
  public static ComputeShuffle(playmode: PlayMode): boolean {
    return this.shuffleOn.some((s) => playmode === s);
  }
}
