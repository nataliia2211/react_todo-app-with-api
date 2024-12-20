import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2136;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodo = (newTodo: Omit<Todo, 'id' | 'userId'>) => {
  return client.post<Todo>('/todos', { ...newTodo, userId: USER_ID });
};

export function updateTodo(todo: Todo) {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
}
