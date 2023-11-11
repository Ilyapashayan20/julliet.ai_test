import {
  promptHasNumeratedList,
  promptHasBulletList,
  getPromptStopSequence
} from '../prompt';

describe('promptHasNumeratedList', () => {
  it('should return true if prompt has numerated list', () => {
    const prompt = `1. one
                    2. two
                    3. three`;
    expect(promptHasNumeratedList(prompt)).toBeTruthy();
  });

  it('should return false if prompt has no numerated list', () => {
    const prompt = `one1
                    two 2.
                    three`;
    expect(promptHasNumeratedList(prompt)).toBeFalsy();
  });
});

describe('promptHasBulletList', () => {
  it('should return true if prompt has bullet list', () => {
    const prompt = `* one
                    * two
                    * three`;
    expect(promptHasBulletList(prompt)).toBeTruthy();
  });

  it('should return false if prompt has no bullet list', () => {
    const prompt = `one*
                    two *
                    three`;
    expect(promptHasBulletList(prompt)).toBeFalsy();
  });
});

describe('getPromptStopSequence', () => {
  it('should return true if prompt has numerated list', () => {
    const prompt = `1. one
                    2. two
                    3. three`;
    expect(getPromptStopSequence(prompt)).toEqual('3');
  });

  it('should return false if prompt has no numerated list', () => {
    const prompt = `one1
                    two 2.
                    three`;
    expect(getPromptStopSequence(prompt)).toEqual('');
  });
});
