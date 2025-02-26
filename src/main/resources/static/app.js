document.addEventListener('DOMContentLoaded', function() {
    const taskList = document.getElementById('task-list');
    const taskForm = document.getElementById('task-form');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');

    // Fetch tasks from the backend
    function fetchTasks() {
        fetch('/tasks')
            .then(response => response.json())
            .then(data => {
                taskList.innerHTML = '';
                data.forEach(task => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${task.title} - ${task.description}`;
                    listItem.dataset.id = task.id;

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.addEventListener('click', () => deleteTask(task.id));

                    const editButton = document.createElement('button');
                    editButton.textContent = 'Edit';
                    editButton.addEventListener('click', () => editTask(task));

                    listItem.appendChild(editButton);
                    listItem.appendChild(deleteButton);
                    taskList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }

    // Add a new task
    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const newTask = {
            title: titleInput.value,
            description: descriptionInput.value,
            dueDate: new Date().toISOString().split('T')[0] // LocalDate 형식으로 전송
        };

        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        })
            .then(response => response.json())
            .then(() => {
                titleInput.value = '';
                descriptionInput.value = '';
                fetchTasks();
            })
            .catch(error => console.error('Error adding task:', error));
    });

    // Delete a task
    function deleteTask(id) {
        fetch(`/tasks/${id}`, {
            method: 'DELETE'
        })
            .then(() => fetchTasks())
            .catch(error => console.error('Error deleting task:', error));
    }

    // Edit a task
    function editTask(task) {
        const newTitle = prompt('Enter new title', task.title);
        const newDescription = prompt('Enter new description', task.description);

        if (newTitle && newDescription) {
            const updatedTask = {
                title: newTitle,
                description: newDescription,
                dueDate: task.dueDate // 기존 dueDate 유지
            };

            fetch(`/tasks/${task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedTask)
            })
                .then(() => fetchTasks())
                .catch(error => console.error('Error updating task:', error));
        }
    }

    // Fetch tasks on page load
    fetchTasks();
});