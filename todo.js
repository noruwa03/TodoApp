const todoForm = document.querySelector("#todoForm");
const todoInput = document.querySelector("#todoInput");
const todoRef = document.querySelector("#todo");
const todoRefWrapper = document.querySelector(".todo-wrapper");

const completed = document.querySelector(".completed");
const remaining = document.querySelector(".remaining");
const total = document.querySelector(".total");

let todo = localStorage.getItem("todo")
  ? JSON.parse(localStorage.getItem("todo"))
  : [];

if (localStorage.getItem("todo")) {
  todo.reverse().map((data) => {
    addTask(data);
  });
}

todoForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  if (todoInput.value == "") {
    alert("Please enter a text");
  } else {
    const todoObj = {
      id: new Date().getTime(),
      name: todoInput.value,
      isCompleted: false,
    };

    todo.push(todoObj);

    localStorage.setItem("todo", JSON.stringify(todo));
    todoForm.reset();
    todoForm.focus();
    addTask(todoObj);
  }
});

function addTask(payload) {
  const el = document.createElement("li");

  el.setAttribute("id", payload.id);

  if (payload.isCompleted) {
    el.classList.add("complete");
  }

  el.innerHTML = `<div><input type="checkbox" ${
    payload.isCompleted ? "checked" : ""
  } /> <span ${!payload.isCompleted ? "contenteditable" : ""}>${
    payload.name
  }</span></div>
              <button title='Remove task with id: ${
                payload.id
              }' class='remove-task'>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-x-lg"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"
                  />
                </svg>
              </button>`;

  todoRef.prepend(el);
  taskCounter();
}

todoRef.addEventListener("click", (evt) => {
  if (
    evt.target.classList.contains("remove-task") ||
    evt.target.parentElement.classList.contains("remove-task") ||
    evt.target.parentElement.parentElement.classList.contains("remove-task")
  ) {
    const id = evt.target.closest("li").id;
    deleteTask(id);
  }
});

function deleteTask(taskId) {
  const newTask = todo.filter((data) => data.id !== parseInt(taskId));

  todo = newTask;

  localStorage.setItem("todo", JSON.stringify(todo));

  document.getElementById(taskId).remove();
  taskCounter();
}

function taskCounter() {
  const completedTask = todo.filter((data) => data.isCompleted === true).length;
  const totalTask = todo.length;
  const remainingTask = totalTask - completedTask;

  completed.textContent = completedTask;
  total.textContent = totalTask;
  remaining.textContent = remainingTask;
}

todoRef.addEventListener("input", (evt) => {
  const taskId = evt.target.closest("li").id;

  updateTask(taskId, evt.target);
});

function updateTask(id, evt) {
  const findTask = todo.find((data) => data.id === parseInt(id));

  if (evt.hasAttribute("contenteditable")) {
    findTask.name = evt.textContent;
  } else {
    const span = evt.nextElementSibling;
    const parent = evt.closest("li");

    findTask.isCompleted = !findTask.isCompleted;

    if (findTask.isCompleted) {
      span.removeAttribute("contenteditable");
      parent.classList.add("complete");
    } else {
      span.setAttribute("contenteditable", true);
      parent.classList.remove("complete");
    }
  }

  localStorage.setItem("todo", JSON.stringify(todo));
  taskCounter();
}

todoRef.addEventListener("keydown", (evt) => {
  if (evt.keyCode === 13) {
    evt.preventDefault();
    evt.target.blur();
  }
});
