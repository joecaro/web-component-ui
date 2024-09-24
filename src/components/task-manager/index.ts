import EventManager from "../../event-manager";
import StatefulComponent from "../../stateful-component";

type Task = {
    title: string;
    priority: string;
};

class TaskManager extends StatefulComponent {
    static styles = `
    :host { 
        display: flex; 
        justify-content: space-around;
        gap: 20px;
    }
    .low-opacity { 
        opacity: 0.5;
    }
    .task-column { 
        padding: 10px;
        border-radius: 8px;
        width: 30%;
        border-right: 1px solid #ddd;
    }
    .task-list {
        min-height: 200px;
    }
    .task-input {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 10px;
        border: 1px solid #ddd;
        padding: 5px;
    }
    .drag-over {
        background: #f9f9f9;
    }
    .task { 
        background: white;
        padding: 5px;
        margin: 5px 0;
        border: 1px solid #aaa;
        border-radius: 5px;
        cursor: grab;
    } 
    .task.dragging { 
        opacity: 0.5;
    }
`;

    constructor() {
        super([]);
        this.state = {
            tasks: {
                todo: [],
                inProgress: [],
                completed: [],
            },
        };
        this.renderDom();
    }

    connectedCallback(): void {
        this.renderDom();
        this.addEventListeners();
    }

    disconnectedCallback(): void {
        this.removeEventListeners();
    }

    addEventListeners() {
        const tasks = this.shadowRoot?.querySelectorAll(".task");
        const columns = this.shadowRoot?.querySelectorAll(".task-list");

        tasks?.forEach(task => {
            task.addEventListener("dragstart", this.handleDragStart.bind(this));
            task.addEventListener("dragend", this.handleDragEnd.bind(this));
        });

        columns?.forEach(column => {
            column.addEventListener("dragover", this.handleDragOver.bind(this));
            column.addEventListener(
                "dragleave",
                this.handleDragLeave.bind(this)
            );
            column.addEventListener("drop", this.handleDrop.bind(this));
        });

        this.shadowRoot
            ?.querySelector("button[name='submit-task']")
            ?.addEventListener("click", () => {
                const titleInput = this.shadowRoot?.querySelector(
                    "input[name='task-title']"
                ) as HTMLInputElement;
                const priorityInput = this.shadowRoot?.querySelector(
                    "input[name='task-priority']"
                ) as HTMLInputElement;

                const title = titleInput?.value.trim() || "";
                const priority = priorityInput?.value.trim() || "";

                if (title && priority) {
                    this.addTask({ title, priority });

                    // Clear the input fields after task submission
                    titleInput.value = "";
                    priorityInput.value = "";
                } else {
                    alert("Please enter both a title and a priority.");
                }
            });
    }

    removeEventListeners() {
        const tasks = this.shadowRoot?.querySelectorAll(".task");
        const columns = this.shadowRoot?.querySelectorAll(".column .task-list");

        tasks?.forEach(task => {
            task.removeEventListener(
                "dragover",
                this.handleDragOver.bind(this)
            );

            task.removeEventListener("dragend", this.handleDragEnd.bind(this));
        });

        columns?.forEach(column => {
            column.removeEventListener(
                "dragstart",
                this.handleDragStart.bind(this)
            );
            column.removeEventListener(
                "dragleave",
                this.handleDragLeave.bind(this)
            );
            column.removeEventListener("drop", this.handleDrop.bind(this));
        });

        this.shadowRoot
            ?.querySelector("button[name='add-task']")
            ?.removeEventListener("click", () => {
                const title = prompt("Enter task title") || "";
                const priority = prompt("Enter task priority") || "";
                this.addTask({ title, priority });
            });
    }

    handleDragStart(e) {
        this.setState({ draggingTask: e.target });
        setTimeout(() => e.target.classList.add("dragging"), 0);
    }

    handleDragEnd(e) {
        e.target.classList.remove("dragging");
    }

    handleDragOver(e) {
        e.preventDefault();
        e.target.classList.add("drag-over");
    }

    handleDragLeave(e) {
        e.target.classList.remove("drag-over");
    }

    handleDrop(e) {
        const targetColumn = e.target.closest(".task-list").parentNode.id;
        const draggedColumn = this.state.draggingTask.dataset.column;
        const draggedIndex = this.state.draggingTask.dataset.index;

        const task = this.state.tasks[draggedColumn].splice(
            draggedIndex,
            1
        )[0] as Task;
        this.state.tasks[targetColumn].push(task);

        if (targetColumn === "completed") {
            EventManager.dispatchEvent(null, "task-completed", {
                message: task.title,
            });
        }

        this.setState({ tasks: { ...this.state.tasks } });
    }

    addTask(task: Task) {
        EventManager.dispatchEvent(this, "task-added", { message: task.title });
        this.setState({
            tasks: {
                ...this.state.tasks,
                todo: [...this.state.tasks.todo, task],
            },
        });
    }

    renderTasks(column) {
        // Render the tasks for the specified column, if none return  spacer
        return this.state.tasks[column].length
            ? this.state.tasks[column]
                  .map(
                      (task, index) =>
                          `<div class="task" draggable="true" data-column="${column}" data-index="${index}">
                        <p>${task.title}</p>
                        <small>${task.priority}</small>
                    </div>`
                  )
                  .join("")
            : "<div class='task low-opacity'>No tasks</div>";
    }

    shouldComponentUpdate(updatedKeys: string[]): boolean {
        if (
            updatedKeys.length === 0 ||
            (updatedKeys.length === 1 && updatedKeys[0] === "draggingTask")
        ) {
            return false;
        }
        return true;
    }

    componentDidUpdate(): void {
        this.removeEventListeners();
        this.addEventListeners();
    }

    render() {
        return `
            <style>${TaskManager.styles}</style>
               <div class="task-column" id="todo">
                    <h3>To Do</h3>
                    <div class="task-list">
                        ${this.renderTasks("todo")}
                        <div class="task-input">
                            <input type="text" name="task-title" placeholder="Task Title" />
                            <input type="text" name="task-priority" placeholder="Task Priority" />
                            <button name="submit-task">Add Task</button>
                        </div>
                    </div>
                </div>
                <div class="task-column" id="inProgress">
                    <h3>In Progress</h3>
                    <div class="task-list">${this.renderTasks(
                        "inProgress"
                    )}</div>
                </div>
                <div class="task-column" id="completed">
                    <h3>Completed</h3>
                    <div class="task-list">${this.renderTasks(
                        "completed"
                    )}</div>
                </div>
        `;
    }
}

window.customElements.define("task-manager", TaskManager);
