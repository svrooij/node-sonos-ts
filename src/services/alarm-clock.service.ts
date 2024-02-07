/**
 * Sonos AlarmClock service
 *
 * Stephan van Rooij
 * https://svrooij.io
 *
 * This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 */
import BaseService from './base-service';
import { SonosUpnpError } from '../models/sonos-upnp-error';
import SonosUpnpErrors from './sonos-upnp-errors';
import {
  PlayMode, Track,
} from '../models';

/**
 * Control the sonos alarms and times
 *
 * @export
 * @class AlarmClockServiceBase
 * @extends {BaseService}
 */
export class AlarmClockServiceBase extends BaseService<AlarmClockServiceEvent> {
  readonly serviceNane: string = 'AlarmClock';

  readonly controlUrl: string = '/AlarmClock/Control';

  readonly eventSubUrl: string = '/AlarmClock/Event';

  readonly scpUrl: string = '/xml/AlarmClock1.xml';

  /**
   * Default errors and service specific errors
   *
   * @type {SonosUpnpError[]}
   * @remarks See https://svrooij.io/sonos-api-docs/#manual-documentation-file
   */
  readonly errors: SonosUpnpError[] = [
    ...SonosUpnpErrors.defaultErrors,
    { code: 801, description: 'Duplicate alarm time' },
  ];

  // #region actions
  /**
   * Create a single alarm, all properties are required
   *
   * @param {string} input.StartLocalTime - The start time as `hh:mm:ss`
   * @param {string} input.Duration - The duration as `hh:mm:ss`
   * @param {string} input.Recurrence - Repeat this alarm on [ 'ONCE' / 'WEEKDAYS' / 'WEEKENDS' / 'DAILY' ]
   * @param {boolean} input.Enabled - Alarm enabled after creation
   * @param {string} input.RoomUUID - The UUID of the speaker you want this alarm for
   * @param {string} input.ProgramURI - The sound uri
   * @param {Track | string} input.ProgramMetaData - The sound metadata, can be empty string
   * @param {PlayMode} input.PlayMode - Alarm play mode [ 'NORMAL' / 'REPEAT_ALL' / 'SHUFFLE_NOREPEAT' / 'SHUFFLE' ]
   * @param {number} input.Volume - Volume between 0 and 100
   * @param {boolean} input.IncludeLinkedZones - Should grouped players also play the alarm?
   */
  async CreateAlarm(input: { StartLocalTime: string; Duration: string; Recurrence: string; Enabled: boolean; RoomUUID: string; ProgramURI: string; ProgramMetaData: Track | string; PlayMode: PlayMode; Volume: number; IncludeLinkedZones: boolean }):
  Promise<CreateAlarmResponse> { return await this.SoapRequestWithBody<typeof input, CreateAlarmResponse>('CreateAlarm', input); }

  /**
   * Delete an alarm
   *
   * @param {number} input.ID - The Alarm ID from ListAlarms
   */
  async DestroyAlarm(input: { ID: number }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('DestroyAlarm', input); }

  async GetDailyIndexRefreshTime():
  Promise<GetDailyIndexRefreshTimeResponse> { return await this.SoapRequest<GetDailyIndexRefreshTimeResponse>('GetDailyIndexRefreshTime'); }

  async GetFormat():
  Promise<GetFormatResponse> { return await this.SoapRequest<GetFormatResponse>('GetFormat'); }

  async GetHouseholdTimeAtStamp(input: { TimeStamp: string }):
  Promise<GetHouseholdTimeAtStampResponse> { return await this.SoapRequestWithBody<typeof input, GetHouseholdTimeAtStampResponse>('GetHouseholdTimeAtStamp', input); }

  async GetTimeNow():
  Promise<GetTimeNowResponse> { return await this.SoapRequest<GetTimeNowResponse>('GetTimeNow'); }

  async GetTimeServer():
  Promise<GetTimeServerResponse> { return await this.SoapRequest<GetTimeServerResponse>('GetTimeServer'); }

  async GetTimeZone():
  Promise<GetTimeZoneResponse> { return await this.SoapRequest<GetTimeZoneResponse>('GetTimeZone'); }

  async GetTimeZoneAndRule():
  Promise<GetTimeZoneAndRuleResponse> { return await this.SoapRequest<GetTimeZoneAndRuleResponse>('GetTimeZoneAndRule'); }

  async GetTimeZoneRule(input: { Index: number }):
  Promise<GetTimeZoneRuleResponse> { return await this.SoapRequestWithBody<typeof input, GetTimeZoneRuleResponse>('GetTimeZoneRule', input); }

  /**
   * Get the AlarmList as XML
   * @remarks Some libraries also provide a ListAndParseAlarms where the alarm list xml is parsed
   */
  async ListAlarms():
  Promise<ListAlarmsResponse> { return await this.SoapRequest<ListAlarmsResponse>('ListAlarms'); }

  async SetDailyIndexRefreshTime(input: { DesiredDailyIndexRefreshTime: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('SetDailyIndexRefreshTime', input); }

  async SetFormat(input: { DesiredTimeFormat: string; DesiredDateFormat: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('SetFormat', input); }

  async SetTimeNow(input: { DesiredTime: string; TimeZoneForDesiredTime: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('SetTimeNow', input); }

  async SetTimeServer(input: { DesiredTimeServer: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('SetTimeServer', input); }

  async SetTimeZone(input: { Index: number; AutoAdjustDst: boolean }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('SetTimeZone', input); }

  /**
   * Update an alarm, all parameters are required.
   *
   * @param {number} input.ID - The ID of the alarm see ListAlarms
   * @param {string} input.StartLocalTime - The start time as `hh:mm:ss`
   * @param {string} input.Duration - The duration as `hh:mm:ss`
   * @param {string} input.Recurrence - Repeat this alarm on [ 'ONCE' / 'WEEKDAYS' / 'WEEKENDS' / 'DAILY' ]
   * @param {boolean} input.Enabled - Alarm enabled after creation
   * @param {string} input.RoomUUID - The UUID of the speaker you want this alarm for
   * @param {string} input.ProgramURI - The sound uri
   * @param {Track | string} input.ProgramMetaData - The sound metadata, can be empty string
   * @param {PlayMode} input.PlayMode - Alarm play mode [ 'NORMAL' / 'REPEAT_ALL' / 'SHUFFLE_NOREPEAT' / 'SHUFFLE' ]
   * @param {number} input.Volume - Volume between 0 and 100
   * @param {boolean} input.IncludeLinkedZones - Should grouped players also play the alarm?
   * @remarks Some libraries support PatchAlarm where you can update a single parameter
   */
  async UpdateAlarm(input: { ID: number; StartLocalTime: string; Duration: string; Recurrence: string; Enabled: boolean; RoomUUID: string; ProgramURI: string; ProgramMetaData: Track | string; PlayMode: PlayMode; Volume: number; IncludeLinkedZones: boolean }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('UpdateAlarm', input); }
  // #endregion

  protected responseProperties(): { [key: string]: string } {
    return {
      AssignedID: 'number',
      CurrentDailyIndexRefreshTime: 'string',
      CurrentTimeFormat: 'string',
      CurrentDateFormat: 'string',
      HouseholdUTCTime: 'string',
      CurrentUTCTime: 'string',
      CurrentLocalTime: 'string',
      CurrentTimeZone: 'string',
      CurrentTimeGeneration: 'number',
      CurrentTimeServer: 'string',
      Index: 'number',
      AutoAdjustDst: 'boolean',
      TimeZone: 'string',
      CurrentAlarmList: 'string',
      CurrentAlarmListVersion: 'string',
    };
  }

  // Event properties from service description.
  protected eventProperties(): { [key: string]: string } {
    return {
      AlarmListVersion: 'string',
      DailyIndexRefreshTime: 'string',
      DateFormat: 'string',
      TimeFormat: 'string',
      TimeGeneration: 'number',
      TimeServer: 'string',
      TimeZone: 'string',
    };
  }
}

// Generated responses
export interface CreateAlarmResponse {
  AssignedID: number;
}

export interface GetDailyIndexRefreshTimeResponse {
  CurrentDailyIndexRefreshTime: string;
}

export interface GetFormatResponse {
  CurrentTimeFormat: string;
  CurrentDateFormat: string;
}

export interface GetHouseholdTimeAtStampResponse {
  HouseholdUTCTime: string;
}

export interface GetTimeNowResponse {
  CurrentUTCTime: string;
  CurrentLocalTime: string;
  CurrentTimeZone: string;
  CurrentTimeGeneration: number;
}

export interface GetTimeServerResponse {
  CurrentTimeServer: string;
}

export interface GetTimeZoneResponse {
  Index: number;
  AutoAdjustDst: boolean;
}

export interface GetTimeZoneAndRuleResponse {
  Index: number;
  AutoAdjustDst: boolean;
  CurrentTimeZone: string;
}

export interface GetTimeZoneRuleResponse {
  TimeZone: string;
}

export interface ListAlarmsResponse {
  CurrentAlarmList: string;
  CurrentAlarmListVersion: string;
}

// Strong type event
export interface AlarmClockServiceEvent {
  AlarmListVersion?: string;
  DailyIndexRefreshTime?: string;
  DateFormat?: string;
  TimeFormat?: string;
  TimeGeneration?: number;
  TimeServer?: string;
  TimeZone?: string;
}
