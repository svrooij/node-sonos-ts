import { Track } from "./index";
import { MetadataHelper } from '../helpers/metadata-helper'

export class PlayNotificationOptions {
  public MetaData: Track | string;
  /**
   * Creates an instance of PlayNotificationOptions.
   * @param {string} TrackUri The URL you want to play
   * @param {boolean} OnlyWhenPlaying Should this sound also play is player is currently not playing.
   * @param {(string | Track)} [MetaData] Specify the metadata, will be guessed if not supplied
   * @param {number} [Volume] Specify the volume for the notification
   * @param {number} [Timeout=20] Specify a timeout after which the state should return to normal (in case the notifications don't work)
   * @memberof PlayNotificationOptions
   */
  constructor(public TrackUri: string, public OnlyWhenPlaying = false, public Volume: number | undefined = undefined, public Timeout = 20) {
    const guessedMetaData = MetadataHelper.GuessMetaDataAndTrackUri(TrackUri);
    this.TrackUri = guessedMetaData.trackUri;
    this.MetaData = guessedMetaData.metedata;
  }
}