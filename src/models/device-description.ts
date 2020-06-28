export default interface DeviceDescription {
  manufacturer: string;
  modelNumber: string;
  modelDescription: string;
  modelName: string;
  softwareVersion: string;
  swGen: number;
  hardwareVersion: string;
  serialNumber: string;
  udn: string;
  iconUrl: string;
  minCompatibleVersion: string;
  legacyCompatibleVersion: string;
  apiVersion: string;
  minApiVersion: string;
  displayVersion: number;
  extraVersion: string;
  roomName: string;
  displayName: string;
  zoneType: number;
  internalSpeakerSize: number;
  feature1?: number;
  feature2?: number;
  feature3?: number;
}
