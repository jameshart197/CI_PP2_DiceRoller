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

contentFactory.createToggle = (labelText) => {
    return `
    <div>
    <label for="action-input">${labelText}</label>
    </div>
    <div>
    <input type="checkbox" id="action-toggle" class="toggle">
    <label for="action-toggle"></label>
    </div>
    `
};


for (button of buttons) {
    button.addEventListener('click', (e) => {
        const actionLabel = e.currentTarget.dataset.actionlabel;
        const actionType = e.currentTarget.dataset.actiontype;
        actionPanel.innerHTML = contentFactory[actionType](actionLabel);
    })
}