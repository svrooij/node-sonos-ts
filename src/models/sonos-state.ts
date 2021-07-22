import { GetMediaInfoResponse, GetPositionInfoResponse } from '../services';
import { TransportState } from './transport-state';

export interface SonosState {
  mediaInfo: GetMediaInfoResponse;
  muted: boolean;
  positionInfo: GetPositionInfoResponse;
  transportState: TransportState;
  volume: number;
}
