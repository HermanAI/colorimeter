# Todo List App with Local Storage

A modern, feature-rich todo application that stores tasks in your browser's local storage.

## 🎯 Features

- ✅ **Add, Edit, Delete Tasks** - Full CRUD operations
- 💾 **Local Storage** - Data persists between sessions
- 🏷️ **Priority Levels** - High, Medium, Low
- 🔍 **Filter Tasks** - All, Active, Completed
- 📊 **Statistics** - Track total, active, and completed tasks
- 🎨 **Modern UI** - Clean, responsive design
- ⌨️ **Keyboard Support** - Press Enter to add tasks
- 📱 **Mobile Friendly** - Works on all devices

## 📁 File Structure

```
todo-app/
├── index.html          # Main HTML file
├── css/
│   └── todo.css        # All styles
├── js/
│   └── todo.js         # App logic & local storage
└── README.md          # This file
```

## 🚀 How to Use

1. **Open** `index.html` in your browser
2. **Add tasks** by typing and clicking "Add" or pressing Enter
3. **Check off** tasks when complete
4. **Edit** tasks with the Edit button
5. **Delete** individual tasks or all at once
6. **Filter** by All, Active, or Completed

## 💾 Local Storage

All tasks are automatically saved to your browser's local storage:

```javascript
// Data is stored as:
localStorage.todoAppData = JSON.stringify([
    {
        id: 1234567890,
        text: "Task description",
        completed: false,
        priority: "high",
        createdAt: "12/6/2026, 3:45:30 PM"
    }
])
```

## 🔧 Key Technologies

- **Vanilla JavaScript** - No frameworks
- **Local Storage API** - Browser persistence
- **CSS3** - Modern styling & animations
- **Responsive Design** - Mobile-first

## ⚙️ Technical Details

### TodoApp Class

```javascript
class TodoApp {
    constructor()          // Initialize app
    init()                // Setup listeners
    loadFromStorage()     // Load from localStorage
    saveToStorage()       // Save to localStorage
    addTodo(text)         // Create new task
    toggleTodo(id)        // Mark complete/incomplete
    deleteTodo(id)        // Remove task
    updateTodo(id, ...)   // Edit task
    clearCompleted()      // Remove completed tasks
    deleteAll()          // Clear all tasks
    getFilteredTodos()   // Filter by status
    getStats()           // Get counters
    render()             // Update UI
}
```

## 🎨 Customization

### Change Colors
Edit `css/todo.css` CSS variables:

```css
:root {
    --primary: #6366f1;        /* Main color */
    --success: #10b981;        /* Complete color */
    --danger: #ef4444;         /* Delete color */
}
```

### Change Storage Key
Edit `js/todo.js`:

```javascript
this.storageKey = 'myCustomKey';
```

## 📝 Data Format

Each todo object:

```javascript
{
    id: 1702987123456,           // Timestamp ID
    text: "Buy groceries",       // Task description
    completed: false,            // Completion status
    priority: "high",           // Priority level
    createdAt: "12/6/2026..."  // Creation date
}
```

## 🐛 Debugging

Check local storage in browser console:

```javascript
// View all tasks
JSON.parse(localStorage.todoAppData)

// Clear all data
localStorage.clear()

// Remove specific key
localStorage.removeItem('todoAppData')
```

## 🎯 Future Enhancements

- [ ] Due dates
- [ ] Categories/tags
- [ ] Search functionality
- [ ] Dark mode
- [ ] Drag & drop sorting
- [ ] Export to CSV
- [ ] Recurring tasks
- [ ] Notifications

## 📄 License

Free to use and modify for personal or educational purposes.

## 💡 Tips

- Use high priority for urgent tasks
- Filter by Active to focus on what's next
- Clear completed tasks regularly
- Your data stays in your browser (no server needed)
