let allTask;
let valueInput = "";
let input = null;
let activeEditTask = null;

window.onload = async function init() {
  input = document.getElementById("add-task");
  input.addEventListener("change", updateValue);
  //getting data with API
  await fetchFunction("allTasks", "GET");
  render();
};
//Click button function
const onClickButton = async () => {
  if (!(valueInput.trim() === "")) {
    allTask.push({
      text: valueInput,
      isCheck: false,
    });
    //Posting API
    await fetchFunction(
      "createTask",
      "POST",
      { text: valueInput },
      { isCheck: false }
    );
    valueInput = "";
    input.value = "";

    render();
  }
};

//enter key function
const keyEnter = document.getElementById("add-task");
keyEnter.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    onClickButton();
    console.log("test");
  }
});

//get value input from inputed Text
const updateValue = (event) => {
  valueInput = event.target.value;
};

//rendering
render = () => {
  const content = document.getElementById("content-page");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  //sorting Checked and Unchecked paragraph
  allTask.sort((a, b) =>
    a.isCheck < b.isCheck ? 1 : a.isCheck > b.isCheck ? -1 : 0
  );

  allTask.map((item, index) => {
    const container = document.createElement("div");
    container.id = `task-${item.id}`;
    container.className = "task-container";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.isCheck;
    checkbox.onchange = function () {
      onChangeCheckbox(item);
    };
    container.appendChild(checkbox);

    if (index == activeEditTask) {
      const inputTask = document.createElement("input");
      inputTask.type = "text";
      inputTask.className = "editing";
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

//changing List when isCheck: true
const onChangeCheckbox = async (item) => {
  //Patching API

  const { id, isCheck } = item;
  await fetchFunction("updateTask", "PATCH", { isCheck: !isCheck }, { id });
  render();
};

//Deleting Task
const onDeleteTask = async (index) => {
  let del = allTask[index].id;
  //Deleting API
  await fetchFunction(`deleteTask?id=${del}`, "DELETE");
  render();
};

//updating task // patching and saving
const updateTaskText = async (event) => {
  if (!(event.target.value.trim() === "")) {
    const { id } = allTask[activeEditTask];
    eventValue = event.target.value;
    //Patching API
    await fetchFunction("updateTask", "PATCH", { text: eventValue }, { id });
    render();
  }
};

//after done editing task
const doneEditTask = () => {
  activeEditTask = null;
  render();
};
//fetch without body
const fetchFunction = async (...arg) => {
  let response;
  if (arg[2] == null) {
    response = await fetch(`http://localhost:8000/${arg[0]}`, {
      method: arg[1],
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } else {
    response = await fetch(`http://localhost:8000/${arg[0]}`, {
      method: arg[1],
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        ...arg[2],
        ...arg[3],
      }),
    });
  }

  const { data } = await response.json();
  allTask = data;
};
