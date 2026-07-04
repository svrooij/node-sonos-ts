import { ChannelValue } from '../models';
import { RenderingControlServiceBase } from './rendering-control.service';

export class RenderingControlService extends RenderingControlServiceBase {
  protected ResolveEventPropertyValue(name: string, originalValue: unknown, type: string): unknown {
    if (name === 'Mute') {
      const output = {} as ChannelValue<boolean>;
      (originalValue as Array<any>).forEach((v) => {
        // The new xml parser will return the value as a number, converting to boolean
        output[v.channel] = v.val === 1;
      });
      return output;
    }

    if (name === 'Volume') {
      const output = {} as ChannelValue<number>;
      (originalValue as Array<any>).forEach((v) => {
        output[v.channel] = parseInt(v.val, 10);
      });
      return output;
    }
    return super.ResolveEventPropertyValue(name, originalValue, type);
  }

  /**
   * Get nightmode status of playbar.
   *
   * @returns {Promise<boolean>}
   * @memberof RenderingControlService
   */
  public async GetNightMode(): Promise<boolean> {
    return (await this.GetEQ({ InstanceID: 0, EQType: 'NightMode' })).CurrentValue === 1;
  }  
  
  /**
   * Turn on/off night mode, on your playbar.
   * shortcut to .RenderingControlService.SetEQ({ InstanceID: 0, EQType: 'NightMode', DesiredValue: dialogLevel === true ? 1 : 0 })
   *
   * @param {boolean} nightmode
   * @returns {Promise<boolean>}
   * @memberof RenderingControlService
   */
  public SetNightMode(nightmode: boolean): Promise<boolean> {
    return this.SetEQ({ InstanceID: 0, EQType: 'NightMode', DesiredValue: nightmode === true ? 1 : 0 });
  }

  /**
   * Get Speech Enhancement status of playbar
   *
   * @returns {Promise<boolean>}
   * @memberof RenderingControlService
   */
  public async GetSpeechEnhancement(): Promise<boolean> {
    return (await this.GetEQ({ InstanceID: 0, EQType: 'DialogLevel' })).CurrentValue === 1;
  }

  /**
   * Turn on/off speech enhancement, on your playbar,
   * shortcut to .RenderingControlService.SetEQ({ InstanceID: 0, EQType: 'DialogLevel', DesiredValue: dialogLevel === true ? 1 : 0 })
   *
   * @param {boolean} dialogLevel
   * @returns {Promise<boolean>}
   * @memberof RenderingControlService
   */
  public SetSpeechEnhancement(dialogLevel: boolean): Promise<boolean> {
    return this.SetEQ({ InstanceID: 0, EQType: 'DialogLevel', DesiredValue: dialogLevel === true ? 1 : 0 });
  }
}
