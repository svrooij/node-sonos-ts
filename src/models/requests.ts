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
   * Want to know when the notification played?
   */
  notificationFired?: NotificationFired;

  /**
   * Should the notification only be played when the player is currently playing music
   *
   * @type {boolean}
   * @memberof PlayNotificationOptionsBase
   */
  onlyWhenPlaying?: boolean;

  /**
   * Number of seconds to return back to the original source of playback.
   *
   * @type {number}
   * @memberof PlayNotificationOptionsBase
   * @remarks Notifications use events from sonos to know when to switch back to the original playback source.
   * Should be approx notification length plus 2 seconds for best results
   */
  timeout?: number;

  /**
   * If included the volume will be changed before playing the notification and reverted back afterwards.
   *
   * @type {number}
   * @memberof PlayNotificationOptionsBase
   */
  volume?: number;

  /**
   * 
   * @deprecated Experimental feature, please dont depend on this
   */
  resolveAfterRevert?: boolean;


  /**
   * In case no other timeout given this will result in 30 Minutes Default Timeout for Playing time only
   * @deprecated Experimental feature, please dont depend on this
   */
  defaultTimeout?: number;

  /**
   * This timeout starts as soon as this item is played next in the queue.
   * Thus in case of an error resolving the PlayNotificationCall with false.
   *
   * @deprecated Experimental feature, please dont depend on this
   */
  specificTimeout?: number;

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
  /**
   * Name of the voice, used in some implementations.
   *
   * @type {string}
   * @memberof PlayTtsOptions
   */
  name?: string;
}

export interface TtsResponse {
  uri: string;
  cdnUri: string;
}

declare type NotificationFired = (played: boolean) => void;
