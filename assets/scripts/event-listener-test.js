import actions from "./actions.js";
const clearButton = document.getElementById("clear");
const valueContainers = document.querySelectorAll("*[data-actiontype='createValue']");

clearButton.addEventListener("click", actions.clearResults);

for (let container of valueContainers) {
  container.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
}