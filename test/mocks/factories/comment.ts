import type { TaskComment, CreateTaskComment, ReactionMap } from '../../../src/types';
import { createUser } from './user';

/**
 * Create a reaction map for testing
 */
export const createReactionMap = (emojis: string[] = ['👍', '❤️']): ReactionMap => {
  const map: ReactionMap = {};
  emojis.forEach(emoji => {
    map[emoji] = [createUser({ id: 1 }), createUser({ id: 2 })];
  });
  return map;
};

/**
 * Task Comment Factory
 */
export const createTaskComment = (data?: Partial<TaskComment>): TaskComment => ({
  id: 1,
  comment: 'Test comment',
  author: createUser(),
  created: new Date().toISOString(),
  updated: new Date().toISOString(),
  reactions: createReactionMap(),
  ...data,
});

/**
 * Create Task Comment params factory
 */
export const createTaskCommentParams = (data?: Partial<CreateTaskComment>): CreateTaskComment => ({
  comment: 'New test comment',
  ...data,
});
