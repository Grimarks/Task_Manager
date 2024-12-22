const taskForm = document.getElementById("taskForm");
const taskName = document.getElementById("taskName");
const taskDescription = document.getElementById("taskDescription");
const taskPriority = document.getElementById("taskPriority");
const taskDueDate = document.getElementById("taskDueDate");
const taskContainer = document.getElementById("taskContainer");
const searchTask = document.getElementById("searchTask");
const filterPriority = document.getElementById("filterPriority");
const filterStatus = document.getElementById("filterStatus");
const toggleTheme = document.getElementById("toggleTheme");

// State
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let isDarkMode = localStorage.getItem("isDarkMode") === "true" || false;
let editIndex = null;

// Save dark mode state to localStorage
const saveDarkModeState = () => {
    localStorage.setItem("isDarkMode", isDarkMode);
};

// Functions
const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

const applyDarkModeToElement = (element) => {
    if (isDarkMode) {
        element.classList.add("dark-mode");
    } else {
        element.classList.remove("dark-mode");
    }
};

const renderTasks = (filter = "") => {
    taskContainer.innerHTML = "";
    const filteredTasks = tasks.filter((task) => {
        return (
            task.name.toLowerCase().includes(filter.toLowerCase()) &&
            (filterPriority.value === "all" || task.priority === filterPriority.value) &&
            (filterStatus.value === "all" || (filterStatus.value === "completed" ? task.completed : !task.completed))
        );
    });

    filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement("li");
        taskItem.classList.add("task-item");
        if (task.completed) taskItem.classList.add("completed");

        // Apply dark mode to task item
        applyDarkModeToElement(taskItem);

        taskItem.innerHTML = `
            <h3>${task.name}</h3>
            <p>${task.description}</p>
            <span>Priority: ${task.priority}</span>
            <span>Due Date: ${task.dueDate}</span>
            <div class="actions">
                <button class="edit" onclick="editTask(${index})">Edit</button>
                <button class="delete" onclick="deleteTask(${index})">Delete</button>
                <button class="toggle-status" onclick="toggleTaskStatus(${index})">${
            task.completed ? "Mark as Pending" : "Mark as Completed"
        }</button>
            </div>
        `;

        taskContainer.appendChild(taskItem);
    });
};

const addTask = (e) => {
    e.preventDefault();

    if (editIndex !== null) {
        // Mode edit: Perbarui tugas yang ada
        tasks[editIndex] = {
            name: taskName.value,
            description: taskDescription.value,
            priority: taskPriority.value,
            dueDate: taskDueDate.value,
            completed: tasks[editIndex].completed, // Pertahankan status selesai
        };
        editIndex = null; // Reset mode edit
        document.querySelector("#taskForm button[type='submit']").textContent = "Add Task"; // Kembalikan teks tombol
    } else {
        // Mode tambah: Tambahkan tugas baru
        const newTask = {
            name: taskName.value,
            description: taskDescription.value,
            priority: taskPriority.value,
            dueDate: taskDueDate.value,
            completed: false,
        };
        tasks.push(newTask);
    }

    saveTasks();
    renderTasks();
    taskForm.reset();
};


const deleteTask = (index) => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
};

const editTask = (index) => {
    const task = tasks[index];
    taskName.value = task.name;
    taskDescription.value = task.description;
    taskPriority.value = task.priority;
    taskDueDate.value = task.dueDate;

    editIndex = index; // Simpan indeks tugas yang sedang diedit
    document.querySelector("#taskForm button[type='submit']").textContent = "Change Task"; // Ubah teks tombol
};

const toggleTaskStatus = (index) => {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();

    // Terapkan gaya untuk mode gelap jika aktif
    const taskItems = document.querySelectorAll(".task-item");
    taskItems.forEach((item) => {
        applyDarkModeToElement(item);
    });
};


const toggleDarkMode = () => {
    isDarkMode = !isDarkMode;
    saveDarkModeState();

    // Apply dark mode to body and main
    document.body.classList.toggle("dark-mode", isDarkMode);
    document.querySelector("main").classList.toggle("dark-mode", isDarkMode);

    // Apply dark mode to all task items
    const taskItems = document.querySelectorAll(".task-item");
    taskItems.forEach((item) => {
        applyDarkModeToElement(item);
    });
};

// Event Listeners
taskForm.addEventListener("submit", addTask);
searchTask.addEventListener("input", (e) => renderTasks(e.target.value));
filterPriority.addEventListener("change", () => renderTasks());
filterStatus.addEventListener("change", () => renderTasks());
toggleTheme.addEventListener("click", toggleDarkMode);

// Initial Render
if (isDarkMode) toggleDarkMode(); // Apply dark mode on load if enabled
renderTasks();
