import { GetMediaInfoResponse, GetPositionInfoResponse } from '../services';
import { TransportState } from './transport-state';

export interface SonosState {
  transportState: TransportState;
  mediaInfo: GetMediaInfoResponse;
  positionInfo: GetPositionInfoResponse;
  volume: number;
}
