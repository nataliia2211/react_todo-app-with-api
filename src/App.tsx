/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';

import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { UserWarning } from './UserWarning';
import { Errors } from './types/Errors';
import { ErrorNotification } from './components/ErrorNotification';
import { FilterType } from './types/FilterType';
import { TodoList } from './components/TodoList/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.Empty);
  const [filteredField, setFilteredField] = useState<FilterType>(
    FilterType.All,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const inputAddRef = useRef<HTMLInputElement>(null);

  const todosActiveNumber = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const areAllTodosCompleted = useMemo(() => {
    return todos.every(todo => todo.completed === true);
  }, [todos]);

  useEffect(() => {
    (async () => {
      try {
        const data = await todoService.getTodos();

        setTodos(data);
      } catch (err) {
        setErrorMessage(Errors.UnableToLoad);
      }
    })();
  }, []);

  const onAddTodo = async (todoTitle: string) => {
    setTempTodo({
      id: 0,
      title: todoTitle,
      completed: false,
      userId: todoService.USER_ID,
    });
    try {
      const newTodo = await todoService.addTodo({
        title: todoTitle,
        completed: false,
      });

      setTodos(prev => [...prev, newTodo]);
    } catch (err) {
      setErrorMessage(Errors.UnableToAdd);
      inputAddRef?.current?.focus();
      throw err;
    } finally {
      setTempTodo(null);
    }
  };

  const onRemoveTodo = async (todoId: number) => {
    setLoadingTodoIds(prev => [...prev, todoId]);
    try {
      await todoService.deleteTodo(todoId);

      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (err) {
      setErrorMessage(Errors.UnableToDelete);
      inputAddRef?.current?.focus();
      throw err;
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const onUpdateTodo = async (todoToUpdate: Todo) => {
    setLoadingTodoIds(prev => [...prev, todoToUpdate.id]);
    try {
      const updatedTodo = await todoService.updateTodo(todoToUpdate);

      setTodos(prev =>
        prev.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
      );
    } catch (err) {
      setErrorMessage(Errors.UnableToUpdate);
      throw err;
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoToUpdate.id));
    }
  };

  const onToggleAll = async () => {
    if (todosActiveNumber > 0) {
      todos
        .filter(todo => !todo.completed)
        .forEach(item => onUpdateTodo({ ...item, completed: true }));
    } else {
      todos.forEach(todo => onUpdateTodo({ ...todo, completed: false }));
    }
  };

  const onClearCompleted = async () => {
    const completedTodo = todos.filter(todo => todo.completed);

    completedTodo.forEach(todo => onRemoveTodo(todo.id));
  };

  const filteredTodos = todos.filter(todo => {
    switch (filteredField) {
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      default:
        return todos;
    }
  });

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErrorMessage={setErrorMessage}
          onAddTodo={onAddTodo}
          isInputDisabled={!!tempTodo}
          onToggleAll={onToggleAll}
          todosLength={todos.length}
          inputRef={inputAddRef}
          areAllTodosCompleted={areAllTodosCompleted}
        />

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={filteredTodos}
              onRemoveTodo={onRemoveTodo}
              onUpdateTodo={onUpdateTodo}
              loadingTodoIds={loadingTodoIds}
              tempTodo={tempTodo}
            />
            <Footer
              todos={todos}
              filteredField={filteredField}
              setFilteredField={setFilteredField}
              activeTodo={todosActiveNumber}
              onClearCompleted={onClearCompleted}
            />
          </>
        )}
      </div>
      <ErrorNotification
        error={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
