
export class RenderingControlService extends RenderingControlServiceBase {
  protected ResolveEventPropertyValue(name: string, originalValue: any, type: string): any {
    if (name === 'Mute') {
      const output = {} as ChannelValue<boolean>
      (originalValue as Array<any>).forEach(v => {
        output[v.channel] = v.val === 1
      })
      return output
    }

    if (name === 'Volume') {
      const output = {} as ChannelValue<number>
      (originalValue as Array<any>).forEach(v => {
        output[v.channel] = parseInt(v.val)
      })
      return output
    }
    return super.ResolveEventPropertyValue(name, originalValue, type)
  }
}
