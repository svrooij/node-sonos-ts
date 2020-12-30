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
  Icon: string;
  MicEnabled: boolean;
  SoftwareVersion: string;
  SwGen: string;
}
