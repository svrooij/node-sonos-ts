
import { Alarm, PatchAlarm } from '../models'
import { XmlHelper } from '../helpers/xml-helper';
import { MetadataHelper } from '../helpers/metadata-helper';
import { ArrayHelper } from '../helpers/array-helper';

/**
 * Extended AlarmClockService
 *
 * @export
 * @class AlarmClockService
 * @extends {AlarmClockServiceBase}
 */
export class AlarmClockService extends AlarmClockServiceBase {

  /**
   * Get a parsed list of all alarms.
   *
   * @returns {Promise<Alarm[]>}
   * @memberof SonosDevice
   */
  public async ListAndParseAlarms(): Promise<Alarm[]> {
    const alarmList = await super.ListAlarms()
    const parsedList = XmlHelper.DecodeAndParseXml(alarmList.CurrentAlarmList, '')
    const alarms = ArrayHelper.ForceArray<any>(parsedList.Alarms.Alarm)
    alarms.forEach(alarm => {
      alarm.Enabled = alarm.Enabled === '1'
      alarm.ID = parseInt(alarm.ID)
      alarm.IncludeLinkedZones = alarm.IncludeLinkedZones === '1'
      alarm.Volume = parseInt(alarm.Volume)
      // Alarm response has StartTime, but updates expect StartLocalTime, why??
      alarm.StartLocalTime = alarm.StartTime
      delete alarm.StartTime
      if(typeof alarm.ProgramMetaData === 'string')
        alarm.ProgramMetaData = MetadataHelper.ParseDIDLTrack(XmlHelper.DecodeAndParseXml(alarm.ProgramMetaData), this.host, this.port);
      alarm.ProgramURI = XmlHelper.DecodeTrackUri(alarm.ProgramURI)
    });
    return alarms;
  }

    /**
   * Patch a single alarm. Only the ID and one property you want to change are required.
   *
   * @param {PatchAlarm} [options]
   * @param {number} options.ID The ID of the alarm to update
   * @param {string | undefined} options.StartLocalTime The time the alarm has to start 'hh:mm:ss'
   * @param {string | undefined} options.Duration The duration of the alarm 'hh:mm:ss'
   * @param {string | undefined} options.Recurrence What should the recurrence be ['DAILY','ONCE','WEEKDAYS']
   * @param {boolean | undefined} options.Enabled Should this alarm be enabled
   * @param {PlayMode | undefined} options.PlayMode What playmode should be used
   * @param {number | undefined} options.Volume The requested alarm volume
   * @returns {Promise<boolean>}
   * @memberof SonosDevice
   */
  public async PatchAlarm(options: PatchAlarm): Promise<boolean> {
    this.debug('AlarmPatch(%o)', options)
    const alarms = await this.ListAndParseAlarms()
    const alarm = alarms.find(a => a.ID === options.ID)
    if(alarm === undefined) throw new Error(`Alarm with ID ${options.ID} not found`)
    if(options.Duration !== undefined) alarm.Duration = options.Duration;
    if(options.Enabled !== undefined) alarm.Enabled = options.Enabled;
    if(options.PlayMode !== undefined) alarm.PlayMode = options.PlayMode;
    if(options.Recurrence !== undefined) alarm.Recurrence = options.Recurrence;
    if(options.StartLocalTime !== undefined) alarm.StartLocalTime = options.StartLocalTime;
    if(options.Volume !== undefined) alarm.Volume = options.Volume;

    return await this.UpdateAlarm(alarm);
  }
}
