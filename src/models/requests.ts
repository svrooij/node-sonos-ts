import { Track } from './track';

export interface PlayNotificationOptionsBase {
  /**
   * Sometimes sonos needs some extra time to play the notification. Set this to a value between 100 and 500 to wait that number of milliseconds to wait before sending the next command.
   *
   * @type {number}
   * @memberof PlayNotificationOptionsBase
   */
  delayMs?: number;

  /**
   * Should the notification only be played when the player is currently playing music
   *
   * @type {boolean}
   * @memberof PlayNotificationOptionsBase
   */
  onlyWhenPlaying?: boolean;

  /**
   * If listening for events doesn't work you can set a timeout after which playback is reverted to the state before the notification.
   *
   * @type {number}
   * @memberof PlayNotificationOptionsBase
   */
  timeout?: number;

  /**
   * If included the volume will be changed before playing the notification and reverted back afterwards.
   *
   * @type {number}
   * @memberof PlayNotificationOptionsBase
   */
  volume?: number;
}

export interface PlayNotificationOptions extends PlayNotificationOptionsBase {
  /**
   * Uri of the notification you wish to play.
   *
   * @type {string}
   * @memberof PlayNotificationOptions
   */
  trackUri: string;
  /**
   * Specify the metadata, it will be guessed if empty.
   * So you can play any uri currently unsupported by the metadata helper
   *
   * @type {(string | Track)}
   * @memberof PlayNotificationOptions
   */
  metadata?: string | Track;
}

export interface PlayTtsOptions extends PlayNotificationOptionsBase {
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
  lang?: string;
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
}

export interface TtsResponse {
  uri: string;
  cdnUri: string;
}
