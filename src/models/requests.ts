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

export interface PlayTtsOptions {
  /**
   *Text to convert to Speech
   *
   * @type {string}
   * @memberof PlayTtsOptions
   */
  text: string;
  /**
   * Supported language (see server supported languages)
   *
   * @type {string}
   * @memberof PlayTtsOptions
   */
  lang: string;
  /**
   * The URI to use for TTS, a post is send to this uri with text, lang and gender. It should return json with the uri (or cdnUri) of the speech file.
   *
   * @type {string}
   * @memberof PlayTtsOptions
   */
  endpoint?: string;
  /**
   * Male/Female choice is supported
   *
   * @type {string}
   * @memberof PlayTtsOptions
   */
  gender?: string;
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

export interface TtsResponse {
  uri: string;
  cdnUri: string;
}
