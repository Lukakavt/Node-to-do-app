let allTask = JSON.parse(localStorage.getItem("task")) || [];
let valueInput = "";
let input = null;
let activeEditTask = null;

window.onload = function init() {
  input = document.getElementById("add-task");
  input.addEventListener("change", updateValue);
  render();
};

const onClickButton = () => {
  allTask.push({
    text: valueInput,
    isCheck: false,
  });
  localStorage.setItem("task", JSON.stringify(allTask));
  valueInput = "";
  input.value = "";
  render();
};

const updateValue = (event) => {
  valueInput = event.target.value;
};

render = () => {
  const content = document.getElementById("content-page");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  allTask.sort((a, b) =>
    a.isCheck > b.isCheck ? 1 : a.isCheck < b.isCheck ? -1 : 0
  );
  allTask.map((item, index) => {
    const container = document.createElement("div");
    container.id = `task-${index}`;
    container.className = "task-container";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.isCheck;
    checkbox.onchange = function () {
      onChangeCheckbox(index);
    };
    container.appendChild(checkbox);

    if (index == activeEditTask) {
      const inputTask = document.createElement("input");
      inputTask.type = "text";
      inputTask.value = item.text;
      inputTask.addEventListener("change", updateTaskText);
      inputTask.addEventListener("blur", doneEditTask);
      container.appendChild(inputTask);
    } else {
      const text = document.createElement("p");
      text.innerText = item.text;
      text.className = item.isCheck ? "text-task done-text" : "text-task";
      container.appendChild(text);
    }

    if (!item.isCheck) {
      if (index === activeEditTask) {
        const imageDone = document.createElement("i");
        imageDone.className = "fa-solid fa-check";
        imageDone.onclick = function () {
          doneEditTask();
        };
        container.appendChild(imageDone);
      } else {
        const imageEdit = document.createElement("i");
        imageEdit.className = "fa solid fa-pen-to-square";
        imageEdit.onclick = function () {
          activeEditTask = index;
          render();
        };
        container.appendChild(imageEdit);
      }
      const imageDelete = document.createElement("i");
      imageDelete.className = "fa solid fa-trash-can";
      imageDelete.onclick = function () {
        onDeleteTask(index);
      };
      container.appendChild(imageDelete);
    }
    content.appendChild(container);
  });
};

const onChangeCheckbox = (index) => {
  allTask[index].isCheck = !allTask[index].isCheck;
  allTask.splice(index, 1);
  render();
};

const onDeleteTask = (index) => {
  allTask.splice(index, 1);
  localStorage.setItem("task", JSON.stringify(allTask));
  render();
};

const updateTaskText = (event) => {
  allTask[activeEditTask].text = event.target.value;
  localStorage.setItem("task", JSON.stringify(allTask));
  render();
};

const doneEditTask = () => {
  activeEditTask = null;
  render();
};
