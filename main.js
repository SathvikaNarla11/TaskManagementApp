function createTodoHTML (todo) {
	return `
	<li id="${todo.id}">
	  <fieldset disabled>
	  <p>Title:</p>
		<label> 
		  <input type="text" name="name" value="${todo.name}">
		</label>
		<br>
		<p>Description:</p>
		<label> 
		  <input type="text" name="message" value="${todo.message}">
		</label>
	  </fieldset>
	  <button class="remove" onClick="removeTodo('${todo.id}')">DELETE</button>
	  <button class="edit" onClick="editTodo(this)">EDIT</button>
	</li>
	`
  }
  
  function uniqueId() {
	return Math.random().toString(16).slice(2);
  }
  
  // A factory function to create a new todo object
  function createTodo (name, message) {
	return {
	  id: uniqueId(),
	  name: name,
	  message: message,
	  checked: false,
	  important: false
	};
  }
  
  // a function to update the storage
  // and update the displayed list
  function updateTodoList (todoList) {
	localStorage.setItem('todo-list', JSON.stringify(todoList));
	displayTodos(todoList);
  }
  
  // as we have editTodo and removeTodo it makes
  // sense to have addTodo
  function addTodo (name, message) {
	const newTodo = createTodo(name, message);
	
	todoList.push(newTodo);
	updateTodoList(todoList);
  }
  
  function removeTodo (id) {
	todoList = todoList.filter(
	  function(todo) {
		return todo.id !== id;
	  }
	)
	
	updateTodoList(todoList);
  }
  
  function editTodo (editButton) {
	const listItem = editButton.parentElement;
	const fieldset = listItem.querySelector('fieldset');
	const editing = editButton.textContent === 'EDIT';
	
	// fieldsets have an elements array that allow
	// you to access the inputs by input name
	const name = fieldset.elements.name;
	const message = fieldset.elements.message;
	
	if (editing) {
	  editButton.textContent = 'SAVE';
	  fieldset.disabled = false; // now we can edit the inputs
	  name.focus(); // move cursor to name
	  return; // exit here
	}
	
	// otherwise the button clicked is 'SAVE'
	editButton.textContent = 'EDIT';
	fieldset.disabled = true;
	
	// Iterate through the todos
	todoList = todoList.map(function(todo) {
	  // if the todo id matches the list item id then ammend
	  if (todo.id === listItem.id) {
		todo.name = name.value;
		todo.message = message.value;
	  }
	  
	  return todo;
	})
	
	updateTodoList(todoList);
  }
  
  function displayTodos (todoList = []) {
	const todos = document.querySelector('.todos');
	const messages = todoList.map(createTodoHTML);
  
	todos.innerHTML = messages.join('\n');
  }
  
  // A generic function to reset fields
  // Using the rest operator e.g ...fields 
  // to convert all arguments to an array
  // e.g. resetFields(name, message) → [name, message]
  function resetFields (...fields) {
	fields.forEach(function(field) {
	  field.value = "";
	})
  }
  
  // Moved addButton here. Saves having to scroll to the top of the code
  // to find out what addButton is
  const addButton = document.querySelector('.add');
  
  addButton.addEventListener('click', function(event) {
	// event.target is the button, parent is the wrapping div
	const parent = event.target.parentElement;
	// parent can be used as the root to search from
	const message = parent.querySelector('.message');
	const name = parent.querySelector('.name');
	
	if (!name.value || !message.value) return;
	
	addTodo(name.value, message.value);
	resetFields(name, message);
  });
  
  let todoList = [];
  
  if (localStorage.getItem('todo-list')) {
	 todoList = JSON.parse(localStorage.getItem('todo-list'));
	 displayTodos(todoList);
  }
  