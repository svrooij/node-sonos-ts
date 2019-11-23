import { Track } from "./track";

export interface PatchAlarm { 
  ID: number; 
  StartLocalTime?: string; 
  Duration?: string; 
  Recurrence?: string; 
  Enabled?: boolean; 
  //RoomUUID?: string; 
  //ProgramURI?: string; 
  //ProgramMetaData?: string | Track; 
  PlayMode?: string; 
  Volume?: number;
  //IncludeLinkedZones?: boolean
}

export interface Alarm { 
  ID: number; 
  StartLocalTime: string; 
  Duration: string; 
  Recurrence: string; 
  Enabled: boolean; 
  RoomUUID: string; 
  ProgramURI: string; 
  ProgramMetaData: string | Track; 
  PlayMode: string; 
  Volume: number;
  IncludeLinkedZones: boolean
}