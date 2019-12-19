import { Track } from "./index";

export interface PlayNotificationOptions {
  /**
   * Uri of the notification you wish to play.
   *
   * @type {string}
   * @memberof PlayNotificationOptions
   */
  trackUri: string;
  /**
   * Specify the metadata, it will be guessed if empty.
   * To support urls, currently not supported by the MetadataHelper.
   *
   * @type {(string | Track)}
   * @memberof PlayNotificationOptions
   */
  metadata?: string | Track;
  /**
   * Should the notification only be played when the player is currently playing music
   *
   * @type {boolean}
   * @memberof PlayNotificationOptions
   */
  onlyWhenPlaying?: boolean;
  /**
   * If included the volume will be changed before playing the notification and reverted back afterwards.
   *
   * @type {number}
   * @memberof PlayNotificationOptions
   */
  volume?: number;
  /**
   * If listening for events doesn't work you can set a timeout after which playback is reverted to the state before the notification.
   *
   * @type {number}
   * @memberof PlayNotificationOptions
   */
  timeout?: number;
}
