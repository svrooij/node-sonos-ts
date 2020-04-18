import { EventEmitter } from 'events';
import { expect } from 'chai';

import { AsyncHelper } from '../../src/helpers/async-helper';


describe('AsyncHelper', () => {
  describe('AsyncEvent', () => {
    it('returns without timeout', async () => {
      const eventName = 'test';
      const eventOutput = 'test-string';
      const emitter = new EventEmitter();
      setTimeout(() => {
        emitter.emit(eventName, eventOutput);
      }, 5);
      const result = await AsyncHelper.AsyncEvent<string>(emitter, eventName);
      expect(result).to.be.eq(eventOutput);
    });

    it('returns before timeout', async () => {
      const eventName = 'test';
      const eventOutput = 'test-string';
      const emitter = new EventEmitter();
      setTimeout(() => {
        emitter.emit(eventName, eventOutput);
      }, 5);
      const result = await AsyncHelper.AsyncEvent<string>(emitter, eventName, 1);
      expect(result).to.be.eq(eventOutput);
    });

    it('throws error on timeout', async () => {
      const eventName = 'test';
      const emitter = new EventEmitter();
      // assert.throws(async () => await AsyncHelper.AsyncEvent<string>(emitter, eventName, 1));
      try {
        await AsyncHelper.AsyncEvent<string>(emitter, eventName, 1);
      } catch (error) {
        expect(error).to.not.be.null;
        expect(error).have.property('name', 'EventTimeoutError');
      }
    });
  });

  describe('Delay', () => {
    it('To continue after delay', async () => {
      const timeout = setTimeout(() => {
        throw new Error('This error should not be thrown');
      }, 50);
      await AsyncHelper.Delay(10);
      clearTimeout(timeout);
      expect(true).to.be.true;
    });
  });
});
