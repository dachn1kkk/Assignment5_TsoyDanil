let tasksData = [
    { id: 1, title: "Design Landing Page", column: "todo", priority: "high", tag: "Design" },
    { id: 2, title: "Setup Database", column: "todo", priority: "high", tag: "Backend" },
    { id: 3, title: "Write API endpoints", column: "todo", priority: "medium", tag: "Backend" },
    { id: 4, title: "Configure Webpack", column: "todo", priority: "low", tag: "DevOps" },
    { id: 5, title: "User Authentication", column: "inprogress", priority: "high", tag: "Security" },
    { id: 6, title: "Responsive Navigation", column: "inprogress", priority: "medium", tag: "Frontend" },
    { id: 7, title: "Fix CSS Bugs", column: "inprogress", priority: "low", tag: "Frontend" },
    { id: 8, title: "Project Proposal", column: "done", priority: "high", tag: "Docs" },
    { id: 9, title: "Initial Wireframes", column: "done", priority: "medium", tag: "Design" },
    { id: 10, title: "Repository Setup", column: "done", priority: "low", tag: "DevOps" }
];

let currentFilterTag = "all";

function renderKanban() {
    const todoCol = document.getElementById("todo-cards");
    const inprogressCol = document.getElementById("inprogress-cards");
    const doneCol = document.getElementById("done-cards");

    if (todoCol) todoCol.textContent = "";
    if (inprogressCol) inprogressCol.textContent = "";
    if (doneCol) doneCol.textContent = "";

    let filteredTasks = tasksData.filter(task => {
        if (currentFilterTag === "all") return true;
        return task.tag === currentFilterTag;
    });

    filteredTasks.forEach(task => {
        const card = document.createElement("div");
        card.className = `kanban-card priority-${task.priority}`;
        card.dataset.id = task.id;

        const titleEl = document.createElement("h4");
        titleEl.textContent = task.title;

        const infoEl = document.createElement("span");
        infoEl.textContent = `[${task.tag}] - Priority: ${task.priority}`;

        const moveBtn = document.createElement("button");
        moveBtn.textContent = "Move ➔";
        moveBtn.dataset.action = "move";

        card.appendChild(titleEl);
        card.appendChild(infoEl);
        card.appendChild(moveBtn);

        if (task.column === "todo" && todoCol) todoCol.appendChild(card);
        if (task.column === "inprogress" && inprogressCol) inprogressCol.appendChild(card);
        if (task.column === "done" && doneCol) doneCol.appendChild(card);
    });

    updateProgressBar();
}

function moveTask(id) {
    let task = tasksData.find(t => t.id === Number(id));
    if (!task) return;

    let inProgressCount = tasksData.filter(t => t.column === "inprogress").length;

    if (task.column === "todo") {
        if (inProgressCount >= 3) {
            alert("Rule violation: In Progress column cannot hold more than 3 cards!");
            return;
        }
        task.column = "inprogress";
    } else if (task.column === "inprogress") {
        task.column = "done";
    } else if (task.column === "done") {
        task.column = "todo";
    }

    renderKanban();
}

function updateProgressBar() {
    const total = tasksData.length;
    const doneCount = tasksData.filter(t => t.column === "done").length;
    const percent = Math.round((doneCount / total) * 100);
    const bar = document.getElementById("progress-bar-fill");
    if (bar) {
        bar.style.width = `${percent}%`;
        bar.textContent = `${percent}%`;
    }
}

document.addEventListener("click", (e) => {
    if (e.target && e.target.dataset.action === "move") {
        const card = e.target.closest(".kanban-card");
        if (card) {
            moveTask(card.dataset.id);
        }
    }
});

renderKanban();