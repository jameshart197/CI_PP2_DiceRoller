import actions from "./actions.js";
import constants from "./constants.js";
const actionPanel = document.getElementById("action-panel");
const rollButton = document.getElementById("roll-button");
const buttons = document.querySelectorAll(
  "#button-section > button, .left-container .dice-container"
);
const contentFactory = {};

contentFactory.createValue = (labelText, button) => {
  actionPanel.innerHTML = "";
  const labelContainer = document.createElement("div");
  const label = document.createElement("label");
  label.setAttribute("for", "action-input");
  label.innerText = labelText;
  labelContainer.appendChild(label);
  const actionContainer = document.createElement("div");
  const minusButton = document.createElement("button");
  const textInput = document.createElement("input");
  const plusButton = document.createElement("button");
  minusButton.innerText = " - ";
  minusButton.className = "minus-button";
  textInput.type = "text";
  textInput.id = "action-input";
  textInput.value = button.dataset.value;
  plusButton.innerText = " + ";
  plusButton.className = "plus-button";
  actionContainer.appendChild(minusButton);
  actionContainer.appendChild(textInput);
  actionContainer.appendChild(plusButton);
  plusButton.addEventListener("click", () => {
    actions.changeValue(1, button, textInput);
  });
  minusButton.addEventListener("click", () => {
    actions.changeValue(-1, button, textInput);
  });
  actionPanel.appendChild(labelContainer);
  actionPanel.appendChild(actionContainer);
};

contentFactory.createToggle = (labelText, button) => {
  actionPanel.innerHTML = "";
  const labelContainer = document.createElement("div");
  const label = document.createElement("label");
  label.setAttribute("for", "action-input");
  label.innerText = labelText;
  labelContainer.appendChild(label);
  const actionContainer = document.createElement("div");
  const checkInput = document.createElement("input");
  const checkLabel = document.createElement("label");
  checkInput.type = "checkbox";
  checkInput.id = "action-toggle";
  checkInput.className = "toggle";
  checkInput.checked = JSON.parse(button.dataset.checked ?? false);
  checkLabel.setAttribute("for", "action-toggle");
  actionContainer.appendChild(checkInput);
  actionContainer.appendChild(checkLabel);
  checkInput.addEventListener("change", (e) => {
    actions.toggleButton(e.currentTarget.checked, button);
  });

  actionPanel.appendChild(labelContainer);
  actionPanel.appendChild(actionContainer);
};

contentFactory.createButton = (labelText, button) => {
  actionPanel.innerHTML = "";
  const buttonContainer = document.createElement("div");
  const actionButton = document.createElement("button");
  actionButton.innerText = labelText;
  actionButton.className = "roll-button";
  actionButton.addEventListener("click", (e) => {
    actions[labelText](e);
  });
  buttonContainer.appendChild(actionButton);
  actionPanel.appendChild(buttonContainer);
};

for (let button of buttons) {
  button.addEventListener("mouseup", (e) => {
    const button = e.currentTarget;
    const actionLabel = button.dataset.actionlabel;
    const actionType = button.dataset.actiontype;

    for (let otherButton of buttons) {
      if (button != otherButton) {
        otherButton.classList.remove("active");
      }
    }

    if (constants.isMobile()) {
      contentFactory[actionType](actionLabel, button);
    } 
    button.classList.add("active");
  });
}

if(constants.isMobile()) {
var evt = document.createEvent("MouseEvents");
evt.initEvent("mouseup", true, true);
rollButton.dispatchEvent(evt);
}