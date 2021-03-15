export interface ChannelMapSet {
  [channel: string]: string;
}

export interface ZoneGroup {
  name: string;
  coordinator: ZoneMember;
  members: ZoneMember[];
}

export interface ZoneMember {
  host: string;
  port: number;
  uuid: string;
  name: string;
  ChannelMapSet?: ChannelMapSet;
  Icon: string;
  MicEnabled: boolean;
  Invisible: boolean;
  SoftwareVersion: string;
  SwGen: string;
}
