// const updateTodo = (itemId, updatedTitle) => {
//   const unmodifiedTodo = todos.find(todo => todo.id === itemId);

//   if (!unmodifiedTodo) {
//     endChaning(itemId);

//     return;
//   }

//   if (updatedTitle === unmodifiedTodo.title) {
//     return;
//   }

//   const updatedTodo = {
//     ...unmodifiedTodo,
//     title: updatedTitle !== null ? updatedTitle.trim() : unmodifiedTodo.title,
//     completed:
//       updatedTitle === null
//         ? !unmodifiedTodo.completed
//         : unmodifiedTodo.completed,
//   };

//   if (updatedTitle !== null && updatedTodo.title === '') {
//     return deleteTodo(itemId);
//   }

//   setTodos(prev =>
//     prev.map(todo => (todo.id === itemId ? updatedTodo : todo)),
//   );

//   return todoService
//     .updateTodo(updateTodo)
//     .then(res =>
//       setTodos(prev => prev.map(todo => (todo.id === itemId ? res : todo))),
//     )
//     .catch(err => {
//       setTodos(prev =>
//         prev.map(todo => (todo.id === itemId ? unmodifiedTodo : todo)),
//       );
//       showErrorMes('Unable to update a todo');
//       throw err;
//     })
//     .finally(() => endChaning(itemId));
// };

// const clearComleted = () => {
//   const completedIds = todos
//     .filter(todo => todo.completed)
//     .map(todo => todo.id);

//   completedIds.forEach(id => deleteTodo(id));
// };

// function updateTodo(todoToUpdate: Todo) {
//   postService.updateTodo(todoToUpdate).then(updatedTodo => {
//     setSelectedTodo(null);

//     setTodos(currentTodos => {
//       return currentTodos.map(todo =>
//         todo.id === updatedTodo.id ? updatedTodo : todo,
//       );
//     });
//   });
// }

// function updatePost(postToUpdate: Post) {
//   setErrorMessage('');

//   return postService.updatePost(postToUpdate)
//     .then(updatedPost => {
//       setSelectedPost(null);

//       setPosts(currentPosts => {
//         return currentPosts.map(post =>
//           post.id === updatedPost.id ? updatedPost : post,
//         );
//       });
//     })
//     .catch(() => setErrorMessage('Failed to update post'));
// }
