import { Track } from './track';

export interface BrowseResponse {
  Result: string | Track[];
  NumberReturned: number;
  TotalMatches: number;
  UpdateID: number;
}
