import { expect } from 'chai';

import PlayModeHelper from '../../src/helpers/playmode-helper'
import { PlayMode, Repeat } from '../../src/models';

describe('PlayModeHelper', () => {
  describe('ComputePlayMode', () => {
    it('returns Normal for false and Off', () => {
      const result = PlayModeHelper.ComputePlayMode(false, Repeat.Off);
      expect(result).to.be.eql(PlayMode.Normal);
    })
    it('returns RepeatOne for false and RepeatOne', () => {
      const result = PlayModeHelper.ComputePlayMode(false, Repeat.RepeatOne);
      expect(result).to.be.eql(PlayMode.RepeatOne);
    })
    it('returns RepeatAll for false and RepeatAll', () => {
      const result = PlayModeHelper.ComputePlayMode(false, Repeat.RepeatAll);
      expect(result).to.be.eql(PlayMode.RepeatAll);
    })
    it('returns ShuffleNoRepeat for true and Off', () => {
      const result = PlayModeHelper.ComputePlayMode(true, Repeat.Off);
      expect(result).to.be.eql(PlayMode.ShuffleNoRepeat);
    })
    it('returns ShuffleRepeatOne for true and RepeatOne', () => {
      const result = PlayModeHelper.ComputePlayMode(true, Repeat.RepeatOne);
      expect(result).to.be.eql(PlayMode.ShuffleRepeatOne);
    })
    it('returns Shuffle for true and RepeatAll', () => {
      const result = PlayModeHelper.ComputePlayMode(true, Repeat.RepeatAll);
      expect(result).to.be.eql(PlayMode.Shuffle);
    })
  })

  describe('ComputeRepeat', () => {
    it('returns RepeatAll for PlayMode.Shuffle', () =>{
      const result = PlayModeHelper.ComputeRepeat(PlayMode.Shuffle);
      expect(result).to.be.eql(Repeat.RepeatAll);
    })
    it('returns Off for PlayMode.ShuffleNoRepeat', () =>{
      const result = PlayModeHelper.ComputeRepeat(PlayMode.ShuffleNoRepeat);
      expect(result).to.be.eql(Repeat.Off);
    })
    it('returns RepeatOne for PlayMode.ShuffleRepeatOne', () =>{
      const result = PlayModeHelper.ComputeRepeat(PlayMode.ShuffleRepeatOne);
      expect(result).to.be.eql(Repeat.RepeatOne);
    })
    it('returns Off for PlayMode.Normal', () =>{
      const result = PlayModeHelper.ComputeRepeat(PlayMode.Normal);
      expect(result).to.be.eql(Repeat.Off);
    })
    it('returns RepeatAll for PlayMode.RepeatAll', () =>{
      const result = PlayModeHelper.ComputeRepeat(PlayMode.RepeatAll);
      expect(result).to.be.eql(Repeat.RepeatAll);
    })
    it('returns RepeatOne for PlayMode.RepeatOne', () =>{
      const result = PlayModeHelper.ComputeRepeat(PlayMode.RepeatOne);
      expect(result).to.be.eql(Repeat.RepeatOne);
    })
    
  })

  describe('ComputeShuffle', () => {
    it('returns true for PlayMode.Shuffle', () =>{
      const result = PlayModeHelper.ComputeShuffle(PlayMode.Shuffle);
      expect(result).to.be.true;
    })
    it('returns true for PlayMode.ShuffleNoRepeat', () =>{
      const result = PlayModeHelper.ComputeShuffle(PlayMode.ShuffleNoRepeat);
      expect(result).to.be.true;
    })
    it('returns true for PlayMode.ShuffleRepeatOne', () =>{
      const result = PlayModeHelper.ComputeShuffle(PlayMode.ShuffleRepeatOne);
      expect(result).to.be.true;
    })
    it('returns false for PlayMode.Normal', () =>{
      const result = PlayModeHelper.ComputeShuffle(PlayMode.Normal);
      expect(result).to.be.false;
    })
    it('returns false for PlayMode.RepeatAll', () =>{
      const result = PlayModeHelper.ComputeShuffle(PlayMode.RepeatAll);
      expect(result).to.be.false;
    })
    it('returns false for PlayMode.RepeatOne', () =>{
      const result = PlayModeHelper.ComputeShuffle(PlayMode.RepeatOne);
      expect(result).to.be.false;
    })
    
  })
})