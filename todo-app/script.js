class Todo {
  constructor(
    id,
    title,
    completed = false,
    priority = 'Sedang',
    createdAt = new Date()
  ) {
    this.id = id;
    this.title = title;
    this.completed = completed;
    this.priority = priority;
    this.createdAt = createdAt;
  }

  toggleStatus() {
    this.completed = !this.completed;
  }
}

class TodoList {
  constructor() {
    this.todos = [];

    this.todoForm = document.getElementById('todo-form');
    this.todoInput = document.getElementById('todo-input');
    this.priorityInput = document.getElementById('priority');

    this.todoListElement = document.getElementById('todo-list');

    this.message = document.getElementById('message');

    this.loading = document.getElementById('loading');

    this.todoForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this.handleAddTodo();
    });
  }

  async fetchTodos() {
    try {
      this.loading.textContent = 'Loading todos...';

      const response = await fetch(
        'https://jsonplaceholder.typicode.com/todos?_limit=5'
      );

      if (!response.ok) {
        throw new Error('Gagal mengambil data todo');
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Format data tidak valid');
      }

      this.todos = data.map((todo) => {
        return new Todo(
          todo.id,
          todo.title,
          todo.completed,
          'Sedang',
          new Date()
        );
      });

      this.renderTodos();
    } catch (error) {
      this.showMessage(error.message);
    } finally {
      this.loading.textContent = '';
    }
  }

  showMessage(message, color = 'red') {
    this.message.textContent = message;
    this.message.style.color = color;

    setTimeout(() => {
      this.message.textContent = '';
    }, 2000);
  }

  getPriorityClass(priority) {
    switch (priority) {
      case 'Tinggi':
        return 'high';

      case 'Rendah':
        return 'low';

      default:
        return 'medium';
    }
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString('id-ID');
  }

  renderTodos() {
    this.todoListElement.innerHTML = '';

    if (this.todos.length === 0) {
      this.todoListElement.innerHTML = `
    <li class="empty-state">
      Belum ada task
    </li>
  `;
      return;
    }

    this.todos.forEach((todo) => {
      const li = document.createElement('li');

      if (todo.completed) {
        li.classList.add('completed');
      }

      li.innerHTML = `
      <div class="todo-info">
        <span class="todo-title">
          ${todo.title}
        </span>

      <div class="todo-meta">
        <span class="badge ${this.getPriorityClass(todo.priority)}">
          ${todo.priority}
        </span>

        <span class="date">
          ${this.formatDate(todo.createdAt)}
        </span>
      </div>
    </div>

    <div class="actions">
      <button class="complete-btn">
        ✔
      </button>

      <button class="delete-btn">
        ✖
      </button>
    </div>
  `;

      li.querySelector('.complete-btn').addEventListener('click', () => {
        this.toggleTodo(todo.id);
      });

      li.querySelector('.delete-btn').addEventListener('click', () => {
        this.deleteTodo(todo.id);
      });

      this.todoListElement.appendChild(li);
    });
  }

  async addTodo(title, priority) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const trimmedTitle = title.trim();

        if (!trimmedTitle) {
          reject(new Error('Input tidak boleh kosong'));
          return;
        }

        const todo = new Todo(
          Date.now(),
          trimmedTitle,
          false,
          priority,
          new Date()
        );

        this.todos.push(todo);

        resolve(todo);
      }, 500);
    });
  }

  async handleAddTodo() {
    const submitButton = this.todoForm.querySelector('button');

    try {
      submitButton.disabled = true;

      this.loading.textContent = 'Menambahkan todo...';

      const title = this.todoInput.value;

      const priority = this.priorityInput.value;

      await this.addTodo(title, priority);

      this.renderTodos();

      this.todoInput.value = '';

      this.showMessage('Todo berhasil ditambahkan', 'green');
    } catch (error) {
      this.showMessage(error.message);
    } finally {
      submitButton.disabled = false;
      this.loading.textContent = '';
    }
  }

  toggleTodo(id) {
    const todo = this.todos.find((todo) => todo.id === id);

    if (todo) {
      todo.toggleStatus();
    }

    this.renderTodos();
  }

  deleteTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);

    this.renderTodos();
  }
}

const todoApp = new TodoList();

todoApp.fetchTodos();
