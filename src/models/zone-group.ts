export interface ChannelMapSet {
  [channel: string]: string;
}

export interface ZoneGroup {
  groupId: string;
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
  Satellites?: ZoneMember[];
  Icon: string;
  MicEnabled: boolean;
  Invisible: boolean;
  SoftwareVersion: string;
  SwGen: string;
  TVConfigurationError: number;
  HdmiCecAvailable: boolean;
  HasConfiguredSSID: boolean;
  WifiEnabled: boolean;
}
