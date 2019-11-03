// This file exports responses that where not unique over all services.
// The interfaces in this file are manually removed from the service-generator.

export interface BrowseResponse {
  Result: string,
  NumberReturned: number,
  TotalMatches: number,
  UpdateID: number
}