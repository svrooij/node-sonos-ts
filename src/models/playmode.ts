export enum PlayMode {
  Normal = 'NORMAL',
  RepeatAll = 'REPEAT_ALL',
  RepeatOne = 'REPEAT_ONE',
  Shuffle = 'SHUFFLE',
  ShuffleNoRepeat = 'SHUFFLE_NOREPEAT',
  ShuffleRepeatOne = 'SHUFFLE_REPEAT_ONE',
  /**
   * @deprecated Typ-o replaced by ShuffleRepeatOne
   */
  SuffleRepeatOne = 'SHUFFLE_REPEAT_ONE',
}

export enum Repeat {
  Off = 'Off',
  RepeatAll = 'RepeatAll',
  RepeatOne = 'RepeatOne',
}
