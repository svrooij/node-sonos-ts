/**
 * SonosDeviceNotifications is an alternative implementation of a notification queue
 * See: https://github.com/svrooij/node-sonos-ts/issues/119 and https://github.com/svrooij/node-sonos-ts/pull/117/files
 */
import TypedEmitter from 'typed-emitter';
import debug, { Debugger } from 'debug';
import AsyncHelper from './helpers/async-helper';
import MetadataHelper from './helpers/metadata-helper';
import { PlayNotificationOptions, SonosEvents, TransportState } from './models';
import {
  NotificationQueue, NotificationQueueItem, NotificationQueueTimeoutItem, PlayNotificationTwoOptions,
} from './models/notificationQueue';
import {
  AVTransportService, GetMediaInfoResponse, GetPositionInfoResponse, RenderingControlService,
} from './services';
import { StrongSonosEvents } from './models/strong-sonos-events';

/**
 * This class has all the logic for a second notification queue implementation
 *
 * @export
 * @class SonosDeviceNotifications
 * @remarks Automatically initialized from the SonosDevice, if needed. Don't use manually.
 */
export default class SonosDeviceNotifications {
  private readonly AVTransportService: AVTransportService;

  private readonly RenderingControlService: RenderingControlService;

  private readonly Events: TypedEmitter<StrongSonosEvents>;

  private debugger?: Debugger;

  private notificationQueue: NotificationQueue = new NotificationQueue();

  protected get debug(): Debugger {
    if (this.debugger === undefined) {
      this.debugger = debug(`sonos:notifications:${this.AVTransportService.Host}`);
    }
    return this.debugger;
  }

  constructor(av: AVTransportService, render: RenderingControlService, events: TypedEmitter<StrongSonosEvents>) {
    this.AVTransportService = av;
    this.RenderingControlService = render;
    this.Events = events;
  }

  /**
   * A second implementation of PlayNotification.
   *
   * @param {PlayNotificationOptions} options The options
   * @param {string} [options.trackUri] The uri of the sound to play as notification, can be every supported sonos uri.
   * @param {string|Track} [options.metadata] The metadata of the track to play, will be guesses if undefined.
   * @param {number} [options.delayMs] Delay in ms between commands, for better notification playback stability. Use 100 to 800 for best results
   * @param {boolean} [options.onlyWhenPlaying] Only play a notification if currently playing music. You don't have to check if the user is home ;)
   * @param {number} [options.timeout] Number of seconds the notification should play, as a fallback if the event doesn't come through.
   * @param {number} [options.volume] Change the volume for the notification and revert afterwards.
   * @param {boolean} [options.resolveAfterRevert]
   * @param {number} [options.defaultTimeout]
   * @param {number} [options.specificTimeout]
   * @param {boolean} [options.catchQueueErrors]
   *
   * @deprecated This is experimental, do not depend on this. (missing the jsdocs experimental descriptor)
   * @remarks This is just added to be able to test the two implementations next to each other. This will probably be removed in feature.
   */
  public async PlayNotificationTwo(options: PlayNotificationTwoOptions): Promise<boolean> {
    const resolveAfterRevert = options.resolveAfterRevert === undefined ? true : options.resolveAfterRevert;

    this.debug('PlayNotificationTwo(%o)', options);

    if (options.delayMs !== undefined && (options.delayMs < 1 || options.delayMs > 4000)) {
      throw new Error('Delay (if specified) should be between 1 and 4000');
    }
    const promise = new Promise<boolean>((resolve, reject) => {
      this.addToNotificationQueue(options, resolve, reject, resolveAfterRevert);
    });
    return promise;
  }

  private async playQueue(originalState?: TransportState): Promise<boolean> {
    this.debug('playQueue: Called, current Queue length: %d', this.notificationQueue.queue.length);
    if (this.notificationQueue.queue.length === 0) {
      throw new Error('Queue is already empty');
    }

    const currentItem = this.notificationQueue.queue[0];
    const currentName = currentItem.options.trackUri;

    if (currentItem.generalTimeout !== undefined && currentItem.generalTimeout.timeLeft() < 0) {
      this.debug('General timeout for Notification ("%s") fired already current Timestamp: %o, FireTime: %o', currentName, (new Date()).getTime(), currentItem.generalTimeout.fireTime);
      // The Timeout already fired so play next item
      return await this.playNextQueueItem(originalState);
    }

    const currentOptions = currentItem.options;
    if (currentOptions.onlyWhenPlaying === true && !(originalState === TransportState.Playing || originalState === TransportState.Transitioning)) {
      this.debug('playQueue: Notification ("%s") cancelled, player not playing', currentName);

      await this.resolvePlayingQueueItem(currentItem, false);

      return await this.playNextQueueItem(originalState);
    }

    if (currentItem.options.specificTimeout) {
      const fireTime = (new Date()).getTime() + currentItem.options.specificTimeout * 1000;
      this.debug('Play notification ("%s") timeout will fire at %o', currentName, fireTime);
      const timeout = setTimeout(() => {
        if (currentItem.generalTimeout) {
          clearTimeout(currentItem.generalTimeout.timeout);
        }
        this.debug('Specific timeout for Notification ("%s") fired already current Timestamp: %o, FireTime: %o', currentName, (new Date()).getTime(), currentItem.individualTimeout?.fireTime);

        this.resolvePlayingQueueItem(currentItem, false);
      }, currentItem.options.specificTimeout * 1000);
      currentItem.individualTimeout = new NotificationQueueTimeoutItem(timeout, fireTime);
    }

    this.debug('playQueue: Going to play next notification ("")', currentName);
    // this.jestDebug.push(`${(new Date()).getTime()}: playQueue: Set next Transport URL, Queue Length: ${this.notificationQueue.queue.length}`);

    // Generate metadata if needed
    if (currentOptions.metadata === undefined) {
      const guessedMetaData = MetadataHelper.GuessMetaDataAndTrackUri(currentOptions.trackUri);
      currentOptions.metadata = guessedMetaData.metadata;
      currentOptions.trackUri = guessedMetaData.trackUri;
    }

    this.notificationQueue.anythingPlayed = true;

    // Start the notification
    const setAvResult: boolean | void = await this.AVTransportService.SetAVTransportURI(
      { InstanceID: 0, CurrentURI: currentOptions.trackUri, CurrentURIMetaData: currentOptions.metadata ?? '' },
    ).catch((reason) => {
      this.debug('Failed to set Transport URL for next notification. %o', reason);
    });
    if (typeof setAvResult !== 'boolean') {
      this.resolvePlayingQueueItem(currentItem, false);
      return await this.playNextQueueItem(originalState);
    }
    if (currentOptions.volume !== undefined) {
      this.notificationQueue.volumeChanged = true;
      this.debug('playQueue: Changing Volume to %o', currentOptions.volume);
      await this.RenderingControlService.SetVolume({ InstanceID: 0, Channel: 'Master', DesiredVolume: currentOptions.volume })
        .catch((reason) => {
          this.debug('Error, while setting desired volume for notification. %o', reason);
        });
      if (currentOptions.delayMs !== undefined) {
        await AsyncHelper.Delay(currentOptions.delayMs);
      }
    }

    if (currentItem.individualTimeout !== undefined && currentItem.individualTimeout.timeLeft() < 0) {
      this.debug('Specific timeout for Notification ("") fired already current Timestamp: %o, FireTime: %o', currentName, (new Date()).getTime(), currentItem.individualTimeout?.fireTime);
      return await this.playNextQueueItem(originalState);
    }

    if (currentItem.generalTimeout !== undefined && currentItem.generalTimeout.timeLeft() < 0) {
      // The Timeout already fired so play next item
      if (currentItem.individualTimeout) {
        clearTimeout(currentItem.individualTimeout.timeout);
      }
      this.debug('General timeout for Notification ("%s") fired already current Timestamp: %o, FireTime: %o', currentName, (new Date()).getTime(), currentItem.individualTimeout?.fireTime);
      return await this.playNextQueueItem(originalState);
    }

    this.debug('playQueue: Initiating notification playing for current Queue Item ("%s").', currentName);
    // this.jestDebug.push(`${(new Date()).getTime()}: playQueue: Execute Play, Queue Length: ${this.notificationQueue.queue.length}`);
    await this.AVTransportService.Play({ InstanceID: 0, Speed: '1' })
      .catch((err) => { this.debug('Play threw error, wrong url? %o', err); });

    // Wait for event (or timeout)
    // this.jestDebug.push(`${(new Date()).getTime()}: playQueue: Wait for PlaybackStopped Event, Queue Length: ${this.notificationQueue.queue.length}`);
    let remainingTime: number = currentItem.options.defaultTimeout === undefined
      ? 1800
      : currentItem.options.defaultTimeout; // 30 Minutes Default Timeout

    if (currentItem.generalTimeout) {
      remainingTime = Math.max(remainingTime, currentItem.generalTimeout.timeLeft() / 1000);
    }

    if (currentItem.individualTimeout) {
      remainingTime = Math.min(remainingTime, currentItem.individualTimeout.timeLeft() / 1000);
    }

    this.debug('playQueue: Notification("%s") --> Maximum wait time for PlayBackStopped Event %d s.', currentName, remainingTime);

    // Timeout + 1 to ensure the timeout action fired already
    await AsyncHelper.AsyncEvent<unknown>(this.Events, SonosEvents.PlaybackStopped, remainingTime + 5).catch((err) => this.debug(err));

    this.debug('Received Playback Stop Event or Timeout for current PlayNotification("%s")', currentName);

    if (currentItem.individualTimeout === undefined) {
      if (currentOptions.delayMs !== undefined) await AsyncHelper.Delay(currentOptions.delayMs);
      this.debug('Playing notification("%s") finished successfully', currentName);
      this.resolvePlayingQueueItem(currentItem, true);
      return await this.playNextQueueItem(originalState);
    }

    const timeLeft = currentItem.individualTimeout.timeLeft();
    if (timeLeft > 0) {
      clearTimeout(currentItem.individualTimeout.timeout);
      this.resolvePlayingQueueItem(currentItem, true);
    }

    if (currentOptions.delayMs !== undefined) await AsyncHelper.Delay(currentOptions.delayMs);
    this.debug('Playing notification("%s") finished with %d ms left on specific timeout', currentName, timeLeft);

    return await this.playNextQueueItem(originalState);
  }

  private resolvePlayingQueueItem(currentItem: NotificationQueueItem, resolveValue: boolean) {
    if (!currentItem.resolveAfterRevert) {
      if (currentItem.generalTimeout !== undefined && currentItem.generalTimeout.timeLeft() > 0) {
        clearTimeout(currentItem.generalTimeout.timeout);
      }
      currentItem.resolve(resolveValue);
    } else {
      this.notificationQueue.promisesToResolve.push(
        { promise: currentItem.resolve, value: resolveValue, timeout: currentItem.generalTimeout },
      );
    }
    return true;
  }

  private async playNextQueueItem(originalState?: TransportState) {
    this.notificationQueue.queue.shift();

    if (this.notificationQueue.queue.length > 0) {
      this.debug('There are some items left in the queue --> play them');
      return await this.playQueue(originalState);
    }

    this.debug('There are no items left in the queue --> Resolve Play Queue promise');
    return true;
  }

  private addToNotificationQueue(
    options: PlayNotificationOptions,
    resolve: (resolve: boolean | PromiseLike<boolean>) => void,
    reject: (reject: boolean | PromiseLike<boolean>) => void,
    resolveAfterRevert: boolean,
  ): void {
    const queueItem: NotificationQueueItem = {
      options,
      resolve,
      reject,
      resolveAfterRevert,
    };

    if (options.timeout) {
      const fireTime = (new Date()).getTime() + options.timeout * 1000;
      this.debug('Play notification timeout will fire at %d', fireTime);
      const timeout = setTimeout(() => {
        this.debug('Notification timeout fired --> resolve(false)');
        // this.jestDebug.push(`Notification timeout fired (Firetime: ${fireTime})`);
        resolve(false);
      }, options.timeout * 1000);

      queueItem.generalTimeout = new NotificationQueueTimeoutItem(timeout, fireTime);
    }

    this.notificationQueue.queue.push(queueItem);

    if (!this.notificationQueue.playing) {
      this.notificationQueue.playing = true;
      setTimeout(async () => {
        await this.startQueue(options).catch((reason) => {
          reject(reason);
        });
      });
    }
  }

  private async startQueue(options: PlayNotificationTwoOptions): Promise<boolean> {
    let originalState: TransportState | undefined;
    await this.AVTransportService.GetTransportInfo()
      .then((result) => {
        originalState = result.CurrentTransportState as TransportState;
      })
      .catch((reason) => {
        this.debug('Error retrieving Original Transport Info, but this shouldn\'t stop the queue:  %o', reason);
      });

    this.debug('Current state is %s', originalState);

    if (!(originalState === TransportState.Playing || originalState === TransportState.Transitioning)) {
      // TH 01.01.2021 Check if we only got items in queue which should only play, currently playing
      let onlyItemsWithOnlyWhenPlaying = true;
      this.notificationQueue.queue.forEach((element) => {
        if (!onlyItemsWithOnlyWhenPlaying || element.options.onlyWhenPlaying === true) {
          return;
        }
        onlyItemsWithOnlyWhenPlaying = false;
      });

      if (onlyItemsWithOnlyWhenPlaying) {
        /*
           * TH 01.01.2021: We have only items in the queue which are only to be played if any items in queue
           *                --> directly resolve and exit
           */
        this.notificationQueue.queue.forEach((element) => {
          element.resolve(false);
        });
        this.notificationQueue.queue = [];
        this.notificationQueue.playing = false;
        return false;
      }
    }

    let originalVolume: number | undefined;
    await this.RenderingControlService.GetVolume({
      InstanceID: 0,
      Channel: 'Master',
    })
      .then((result) => {
        originalVolume = result.CurrentVolume;
      })
      .catch((reason) => {
        this.debug('Error retrieving volume, but this shouldn\'t stop the queue:  %o', reason);
      });

    const originalMediaInfoResponse: GetMediaInfoResponse | void = await this.AVTransportService.GetMediaInfo()
      .catch((reason) => {
        this.debug('Error retrieving initial Media info, but this shouldn\'t stop playing the queue:  %o', reason);
      });
    const originalMediaInfo: GetMediaInfoResponse | undefined = (typeof originalMediaInfoResponse === 'object') ? originalMediaInfoResponse : undefined;

    const originalPositionInfoResponse: GetPositionInfoResponse | void = await this.AVTransportService.GetPositionInfo()
      .catch((reason) => {
        this.debug('Error retrieving initial position info, but this shouldn\'t stop the queue:  %o', reason);
      });
    const originalPositionInfo: GetPositionInfoResponse | undefined = (typeof originalPositionInfoResponse === 'object') ? originalPositionInfoResponse : undefined;

    this.debug('Starting Notification Queue');
    // this.jestDebug.push(`${(new Date()).getTime()}: Start Queue playing`);
    try {
      await this.playQueue(originalState);
    } catch (e) {
      this.debug('Error playing the notification queue:  %o', e);
      if (!options.catchQueueErrors) {
        throw e;
      } else if (this.notificationQueue.queue.length > 0) {
        // We should remove the failed item, to prevent infinite loop;
        this.notificationQueue.queue.shift();
      }
    }
    this.debug('Notification Queue finished');

    if (this.notificationQueue.anythingPlayed) {
      // Revert everything back
      this.debug('Reverting everything back to normal');
      let isBroadcast = false;
      if (originalMediaInfo !== undefined
          && originalMediaInfo.CurrentURIMetaData !== undefined
          && typeof originalMediaInfo.CurrentURIMetaData !== 'string' // Should not happen, is parsed in the service
          && originalMediaInfo.CurrentURIMetaData.UpnpClass === 'object.item.audioItem.audioBroadcast' // This UpnpClass should for sure be skipped.
      ) {
        isBroadcast = true;
      }

      if (originalVolume !== undefined && this.notificationQueue.volumeChanged) {
        this.debug('This Queue changed the volume so revert it');
        await this.RenderingControlService.SetVolume({
          InstanceID: 0,
          Channel: 'Master',
          DesiredVolume: originalVolume,
        }).catch((reason) => {
          this.debug('Error restoring the volume, but this shouldn\'t stop the queue:  %o', reason);
        });
        if (options.delayMs !== undefined) await AsyncHelper.Delay(options.delayMs);
        this.notificationQueue.volumeChanged = false;
      }

      if (originalMediaInfo !== undefined) {
        this.debug('We have original Media Info --> Restoring now');
        await this.AVTransportService.SetAVTransportURI(
          {
            InstanceID: 0,
            CurrentURI: originalMediaInfo.CurrentURI,
            CurrentURIMetaData: originalMediaInfo.CurrentURIMetaData,
          },
        ).catch((reason) => {
          this.debug('Error settingAVTransportURI, but this shouldn\'t stop the queue:  %o', reason);
        });
        if (options.delayMs !== undefined) await AsyncHelper.Delay(options.delayMs);

        if (originalPositionInfo !== undefined) {
          if (originalPositionInfo.Track > 1
              && originalMediaInfo.NrTracks > 1) {
            this.debug('Selecting track %d', originalPositionInfo.Track);
            await this.AVTransportService.Seek({ InstanceID: 0, Unit: 'TRACK_NR', Target: originalPositionInfo.Track.toString() })
              .catch((reason) => {
                this.debug('Error selecting track, happens with some music services:  %o', reason);
              });
          }

          if (originalPositionInfo.RelTime && originalMediaInfo.MediaDuration !== '0:00:00' && !isBroadcast) {
            this.debug('Setting back time to %s', originalPositionInfo.RelTime);
            await this.AVTransportService.Seek({ InstanceID: 0, Unit: 'REL_TIME', Target: originalPositionInfo.RelTime })
              .catch((reason) => {
                this.debug('everting back track time failed, happens for some music services (radio or stream). %o', reason);
              });
          }
        }

        if (originalState === TransportState.Playing || originalState === TransportState.Transitioning) {
          this.debug('Before Queue Sonos was playing --> Resume');
          await this.AVTransportService.Play({
            InstanceID: 0,
            Speed: '1',
          }).catch((reason) => {
            this.debug('Reverting back track time failed, happens for some music services (radio or stream). %o', reason);
          });
        }
      }
    }

    // this.jestDebug.push(`${(new Date()).getTime()}: Resolve all remaining promises`);
    this.notificationQueue.promisesToResolve.forEach((element) => {
      if (element.timeout === undefined) {
        element.promise(element.value);
        return;
      }

      if (element.timeout.timeLeft() > 0) {
        clearTimeout(element.timeout.timeout);
        element.promise(element.value);
      }
    });

    this.notificationQueue.anythingPlayed = false;
    this.notificationQueue.promisesToResolve = [];
    if (this.notificationQueue.queue.length > 0) {
      const promise = new Promise<boolean>((resolve, reject) => {
        setTimeout(async () => {
          await this.startQueue(options).catch((reason) => reject(reason));
          resolve(true);
        });
      });
      return promise;
    }

    this.notificationQueue.playing = false;
    return true;
  }
}
