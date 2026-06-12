// ============================================================
//  Todo App - Local Storage
//  Complete task management with persistence
// ============================================================

class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.storageKey = 'todoAppData';
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.render();
    }

    // ---- STORAGE ----

    loadFromStorage() {
        const stored = localStorage.getItem(this.storageKey);
        this.todos = stored ? JSON.parse(stored) : [];
    }

    saveToStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
    }

    // ---- EVENT LISTENERS ----

    setupEventListeners() {
        const input = document.getElementById('todoInput');
        const addBtn = document.getElementById('addBtn');

        addBtn.addEventListener('click', () => this.addTodo(input.value));
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo(input.value);
        });

        document.querySelectorAll('.filter-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.render();
            });
        });

        document.getElementById('clearCompleted').addEventListener('click', () => this.clearCompleted());
        document.getElementById('deleteAll').addEventListener('click', () => this.deleteAll());
    }

    // ---- CRUD OPERATIONS ----

    addTodo(text) {
        const input = document.getElementById('todoInput');
        const trimmedText = text.trim();

        if (!trimmedText) {
            alert('Please enter a task!');
            return;
        }

        const todo = {
            id: Date.now(),
            text: trimmedText,
            completed: false,
            priority: 'medium',
            createdAt: new Date().toLocaleString(),
        };

        this.todos.unshift(todo);
        this.saveToStorage();
        input.value = '';
        input.focus();
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find((t) => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToStorage();
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter((t) => t.id !== id);
        this.saveToStorage();
        this.render();
    }

    updateTodo(id, text, priority) {
        const todo = this.todos.find((t) => t.id === id);
        if (todo) {
            todo.text = text;
            todo.priority = priority;
            this.saveToStorage();
            this.render();
        }
    }

    clearCompleted() {
        if (confirm('Delete all completed tasks?')) {
            this.todos = this.todos.filter((t) => !t.completed);
            this.saveToStorage();
            this.render();
        }
    }

    deleteAll() {
        if (confirm('Delete ALL tasks? This cannot be undone!')) {
            this.todos = [];
            this.saveToStorage();
            this.render();
        }
    }

    // ---- FILTERING ----

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter((t) => !t.completed);
            case 'completed':
                return this.todos.filter((t) => t.completed);
            default:
                return this.todos;
        }
    }

    // ---- STATISTICS ----

    getStats() {
        return {
            total: this.todos.length,
            active: this.todos.filter((t) => !t.completed).length,
            completed: this.todos.filter((t) => t.completed).length,
        };
    }

    // ---- RENDERING ----

    render() {
        this.renderList();
        this.updateStats();
        this.updateButtons();
    }

    renderList() {
        const todoList = document.getElementById('todoList');
        const emptyState = document.getElementById('emptyState');
        const filtered = this.getFilteredTodos();

        todoList.innerHTML = '';

        if (filtered.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        filtered.forEach((todo) => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onchange="app.toggleTodo(${todo.id})"
                >
                <div style="flex: 1;">
                    <div class="todo-text">${this.escapeHtml(todo.text)}</div>
                    <div class="todo-date">${todo.createdAt}</div>
                </div>
                <span class="todo-priority priority-${todo.priority}">${todo.priority}</span>
                <div class="todo-actions">
                    <button class="btn-edit" onclick="app.showEditModal(${todo.id})">Edit</button>
                    <button class="btn-delete" onclick="app.deleteTodo(${todo.id})">Delete</button>
                </div>
            `;
            todoList.appendChild(li);
        });
    }

    updateStats() {
        const stats = this.getStats();
        document.getElementById('totalCount').textContent = stats.total;
        document.getElementById('activeCount').textContent = stats.active;
        document.getElementById('completedCount').textContent = stats.completed;
    }

    updateButtons() {
        const clearBtn = document.getElementById('clearCompleted');
        const deleteBtn = document.getElementById('deleteAll');
        const completedCount = this.todos.filter((t) => t.completed).length;

        clearBtn.disabled = completedCount === 0;
        deleteBtn.disabled = this.todos.length === 0;
    }

    // ---- EDIT MODAL ----

    showEditModal(id) {
        const todo = this.todos.find((t) => t.id === id);
        if (!todo) return;

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <h2 class="modal-title">Edit Task</h2>
                <div class="form-group">
                    <label>Task</label>
                    <textarea id="editText" rows="3">${this.escapeHtml(todo.text)}</textarea>
                </div>
                <div class="form-group">
                    <label>Priority</label>
                    <select id="editPriority">
                        <option value="low" ${todo.priority === 'low' ? 'selected' : ''}>Low</option>
                        <option value="medium" ${todo.priority === 'medium' ? 'selected' : ''}>Medium</option>
                        <option value="high" ${todo.priority === 'high' ? 'selected' : ''}>High</option>
                    </select>
                </div>
                <div class="modal-actions">
                    <button class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                    <button class="btn-add" onclick="app.saveEdit(${id}); this.closest('.modal').remove()">Save</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('editText').focus();
    }

    saveEdit(id) {
        const text = document.getElementById('editText').value.trim();
        const priority = document.getElementById('editPriority').value;

        if (!text) {
            alert('Task cannot be empty!');
            return;
        }

        this.updateTodo(id, text, priority);
    }

    // ---- UTILITIES ----

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app
const app = new TodoApp();