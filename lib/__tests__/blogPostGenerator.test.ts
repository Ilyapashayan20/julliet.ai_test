import { Tone } from '@/types';
import { generate } from '../blogPostGenerator';
import { jest } from '@jest/globals';
import { getSimpleSuggestion } from '../services/suggestions';

//mock getSimpleSuggestion
jest.mock('../services/suggestions', () => ({
  getSimpleSuggestion: jest.fn()
}));

describe('blogPostGenerator', () => {
  it('should generate a blog post', async () => {
    const post = await generate({
      title: 'My awesome post',
      tone: 'informal' as Tone,
      user: { id: '1' },
      supabase: {}
    });

    expect(post).toBeDefined();
    expect(post.title).toBe('My awesome post');
    expect(post.summary).toBeDefined();
    expect(post.index).toBeDefined();
    expect(post.sections).toBeDefined();
  });
});
