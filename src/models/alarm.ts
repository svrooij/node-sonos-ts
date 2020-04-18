import { Track } from './track';
import { PlayMode } from './playmode';

export interface PatchAlarm {
  ID: number;
  StartLocalTime?: string;
  Duration?: string;
  Recurrence?: string;
  Enabled?: boolean;
  // RoomUUID?: string;
  // ProgramURI?: string;
  // ProgramMetaData?: string | Track;
  PlayMode?: PlayMode;
  Volume?: number;
  // IncludeLinkedZones?: boolean
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
  PlayMode: PlayMode;
  Volume: number;
  IncludeLinkedZones: boolean;
}
