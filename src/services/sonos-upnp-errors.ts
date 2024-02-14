/**
 * SonosUpnpErrors
 *
 * Stephan van Rooij
 * https://svrooij.io
 *
 * This file is generated, do not edit manually. https://sonos.svrooij.io/
 */
import { SonosUpnpError } from '../models/sonos-upnp-error';

export default class SonosUpnpErrors {
  public static defaultErrors: SonosUpnpError[] = [
    { code: 400, description: 'Bad request' },
    { code: 401, description: 'Invalid action' },
    { code: 402, description: 'Invalid args' },
    { code: 404, description: 'Invalid var' },
    { code: 412, description: 'Precondition failed' },
    { code: 501, description: 'Action failed' },
    { code: 600, description: 'Argument value invalid' },
    { code: 601, description: 'Argument value out of range' },
    { code: 602, description: 'Optional action not implemented' },
    { code: 603, description: 'Out of memory' },
    { code: 604, description: 'Human intervention required' },
    { code: 605, description: 'String argument too long' },
    { code: 606, description: 'Action not authorized' },
    { code: 607, description: 'Signature failure' },
    { code: 608, description: 'Signature missing' },
    { code: 609, description: 'Not encrypted' },
    { code: 610, description: 'Invalid sequence' },
    { code: 611, description: 'Invalid control URL' },
    { code: 612, description: 'No such session' },
  ];
}
