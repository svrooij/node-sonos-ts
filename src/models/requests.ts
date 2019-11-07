import { Track } from "./index";
import { MetadataHelper } from '../helpers/metadata-helper'

export class PlayNotificationOptions {
  public MetaData: string;
  /**
   * Creates an instance of PlayNotificationOptions.
   * @param {string} TrackUri The URL you want to play
   * @param {boolean} OnlyWhenPlaying Should this sound also play is player is currently not playing.
   * @param {(string | Track)} [MetaData] Specify the metadata, will be guessed if not supplied
   * @param {number} [Volume] Specify the volume for the notification
   * @param {number} [Timeout=20] Specify a timeout after which the state should return to normal (in case the notifications don't work)
   * @memberof PlayNotificationOptions
   */
  constructor(public TrackUri: string, public OnlyWhenPlaying: boolean, MetaData?: string | Track, public Volume?: number, public Timeout = 20) {
    if (typeof MetaData === 'string') {
      this.MetaData = MetaData
    } else if (MetaData === undefined) {
      this.MetaData = MetadataHelper.TrackToMetaData(MetadataHelper.GuessTrack(TrackUri))
    } else {
      this.MetaData = MetadataHelper.TrackToMetaData(MetaData)
    }
  }
}