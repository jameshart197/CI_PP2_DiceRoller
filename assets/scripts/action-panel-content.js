const actionPanel = document.getElementById('action-panel');
const modifierButton = document.getElementById('modifiers');
const standardCritButton = document.getElementById('standard-crit');
const dangerousCritButton = document.getElementById('dangerous-crit');
const buttons = document.querySelectorAll('#button-section > button');
const contentFactory = {};


contentFactory.createValue = (labelText) => {
    return `
    <div>
    <label for="action-input">${labelText}</label>
    </div>
    <div>
    <button class="minus-button"> - </button>
    <input type="text" id="action-input"/>
    <button class="plus-button"> + </button>
    </div>
    `;
};

for (button of buttons) {
    button.addEventListener('click', (e) => {
        const actionType = e.currentTarget.dataset.actiontype;
        actionPanel.innerHTML = contentFactory.createValue(actionType);
    })
}





