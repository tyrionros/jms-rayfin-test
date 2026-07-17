import { Feedback } from './Feedback.js';
import { Todo } from './Todo.js';

export type TodoAppSchema = {
  Feedback: Feedback;
  Todo: Todo;
};

export const schema = [Feedback, Todo];
