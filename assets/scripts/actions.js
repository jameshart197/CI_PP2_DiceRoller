import constants from "./constants.js";
const actions = {};
const diceCounters = document.getElementsByClassName("dice-container");
const diceBox = [...diceCounters];
const resultsBox = document.getElementById("results-box");
const animationsBox = document.getElementById("animations-box");
const toggleButtons = document.querySelectorAll("button[data-actiontype='createToggle']");
const toggleButtonsDesktop = [document.getElementsByClassName('toggle-desktop')[0], document.getElementsByClassName('toggle-desktop')[1]];
const modifier = document.getElementById("modifiers");
const rollButtonDesktopElement = document.getElementById('roll-button-desktop');
const animationVariations = 8;
const minusModifier = document.getElementById('minus');
const plusModifier = document.getElementById('plus')
const modifierDesktop = document.getElementById('modifiers-desktop')
let refreshDelay = 250;
let messageDelay = 150;

for (let toggleButton of toggleButtonsDesktop) {
    toggleButton.addEventListener("change", (e) => {
        for (let button of toggleButtonsDesktop) {
            if (button.id !== e.currentTarget.id) {
                button.checked = false;
            }
        }
    });
}

rollButtonDesktopElement.addEventListener("click", (e) => {
    actions["Roll!"](e);
});

actions.toggleButton = (checked, button) => {
    button.dataset.checked = checked;
    for (let otherButton of toggleButtons) {
        if (
            button != otherButton &&
            otherButton.dataset.actiontype === "createToggle"
        ) {
            otherButton.dataset.checked = false;
        }
    }
}

minusModifier.addEventListener('click', () => {
    updateModifier(modifierDesktop, +modifierDesktop.value - 1);
})

plusModifier.addEventListener('click', () => {
    updateModifier(modifierDesktop, +modifierDesktop.value + 1);
})

function updateModifier(input, value) {
    modifierDesktop.value = value;
    modifierDesktop.innerText = value;
}

/**
 * Increments or decrements the desktop dice
 * @param {Event} e the event handler from the mouseup event on dice 
 */
actions.changeValueFromEvent = (e) => {
    const button = e.currentTarget;
    switch (e.button) {
        case 0:
            actions.changeValue(1, button);
            break;
        case 2:
            actions.changeValue(-1, button);
            break;
        default:
            break;
    }
}

/**
 * Increments or decrements the mobile dice and modifiers
 * @param {number} val Value to add or subtract 
 * @param {HTMLButtonElement} button Dice or Modifier in question
 * @param {HTMLInputElement} textInput Value on dice or modifier in question
 */
actions.changeValue = (val, button, textInput) => {
    if (JSON.parse(button.dataset.positive ?? false) && +button.dataset.value + val < 0) {
        return;
    }

    button.dataset.value = +button.dataset.value + val;
    if (!button.dataset.positive) {
        if (button.dataset.value >= 0) {
            button.dataset.value = `+${button.dataset.value}`;
        }
    }
    if (textInput) {
        textInput.value = button.dataset.value;
    }
}

actions["Roll!"] = () => {
    if (diceBox.filter(dice => +dice.dataset.value > 0).length === 0) {
        return
    }
    //Find out if is mobile or desktop (or tablet, smartphone or thing)

    animationsBox.innerHTML = '';
    const diceResults = {};
    const rollingOptions = {};
    diceResults.total = 0;
    if (constants.isMobile()) {
        refreshDelay = 75;
        messageDelay = 20;
        rollingOptions.modifier = +modifier.dataset.value;
        rollingOptions.standardCritical = isCrit('standard-crit-mobile');
        rollingOptions.dangerousCritical = isCrit('dangerous-crit-mobile');
    } else if (constants.isDesktop()) {
        rollingOptions.modifier = +modifierDesktop.value;
        rollingOptions.standardCritical = isCrit('standard-crit');
        rollingOptions.dangerousCritical = isCrit('dangerous-crit');
    }
    
    getRollingInformation(diceResults, rollingOptions);
    displayCombinedResults(diceResults, rollingOptions);
}

function displayCombinedResults(diceResults, rollingOptions) {
    setTimeout(() => {
        let multipleDice = Object.keys(diceResults).length > 3;
        const modValue = rollingOptions.modifier;
        if (multipleDice && modValue != 0) {
            const addPlus = modValue > 0 ? '+' : '';
            resultsBox.innerText += `\n Combined total = ${diceResults.total} \n (${addPlus}${modValue}) = ${diceResults.total + modValue} \n`
        } else if (modValue != 0) {
            const addPlus = modValue > 0 ? '+' : '';
            resultsBox.innerText += `\n(${addPlus}${modValue}) = ${diceResults.total + modValue} \n`
        } else if (multipleDice) {
            resultsBox.innerText += `\n Combined total = ${diceResults.total} \n`
        }
        resultsBox.scrollTo(0, resultsBox.scrollHeight);
    }, messageDelay * animationVariations + (refreshDelay * 2))
}

function getRollingInformation(diceResults, rollingOptions) {
    for (let dieCounter of diceCounters) {
        let diceQuantity = +dieCounter.dataset.value;
        if (diceQuantity === 0) {
            continue;
        }
        //find number of faces on dice//
        const faces = +dieCounter.getAttribute('data-faces');
        if (rollingOptions.standardCritical) {
            diceQuantity *= 2;
        }
        //create array of results for each dice rolled and roll dice//
        diceResults[`d${faces}Results`] = [];
        for (let i = 0; i < diceQuantity; i++) {
            const result = Math.floor(Math.random() * faces) + 1;
            diceResults[`d${faces}Results`].push(result);
            setTimeout(() => {
                createDie(faces, result)
            }, refreshDelay)
            diceResults.total += result
            if (rollingOptions.dangerousCritical) {
                diceResults.total += faces;
            }
        }
        //display results//
        diceResults[`d${faces}Messages`] = buildRolledMessage(faces, diceResults[`d${faces}Results`], rollingOptions)
        resultsBox.innerText += diceResults[`d${faces}Messages`].rollingMessage;

        const currentCounter = dieCounter;
        setTimeout(() => {
            resultsBox.innerText += diceResults[`d${faces}Messages`].rolledResult;
            if (rollingOptions.dangerousCritical) {
                resultsBox.innerText += diceResults[`d${faces}Messages`].dangerousCrit;
            }
            resultsBox.innerText += diceResults[`d${faces}Messages`].resultAdded;
            //reset count//
            currentCounter.dataset.value = 0;
            resultsBox.scrollTo(0, resultsBox.scrollHeight);
        }, messageDelay * animationVariations + (refreshDelay * 2))
    }
}

function isCrit(id) {
    if (constants.isMobile()) {
        for (let button of toggleButtons) {
            if (button.id === id) {
                return JSON.parse(button.dataset.checked ?? false);
            }
        }
    } else {
        for (let checkbox of toggleButtonsDesktop) {
            if (checkbox.id === id) {
                return JSON.parse(checkbox.checked ?? false);
            }
        }
    }
}

function buildRolledMessage(diceType, results, rollingOptions) {
    const rolledMessages = {};
    let subTotal = results.reduce((runningTotal, a) => runningTotal + a, 0);
    if (rollingOptions.dangerousCritical) {
        subTotal += results.map(() => diceType).reduce((runningTotal, a) => runningTotal + a, 0);
    }
    rolledMessages.rollingMessage = `\n Rolling ${results.length}d${diceType}... \n`
    rolledMessages.rolledResult = `\n Rolled (${results.join(' + ')})`
    rolledMessages.resultAdded = `\n Total = ${subTotal} \n`
    rolledMessages.dangerousCrit = `\n+ Dangerous Crits (${results.map((a) => diceType).join(' + ')})`
    return rolledMessages;
}

//animation script
function createDie(faces, result) {
    if (constants.isMobile()) {
        return;
    }
    const diceBox = document.createElement('div');
    const rolledNumber = document.createElement('p');
    diceBox.className = 'dice-box'
    diceBox.innerHTML = `<img src="assets/images/d${faces}-blank.png" alt="Blank D${faces}">`;
    diceBox.appendChild(rolledNumber);
    animationsBox.appendChild(diceBox);
    const numbers = getRandomNumbersFromFaces(faces);
    for (let i = 0; i < animationVariations; i++) {
        setTimeout(() => {
            rolledNumber.innerText = numbers[i % faces]
        }, messageDelay * i);
        setTimeout(() => {
            rolledNumber.innerText = result
        }, messageDelay * animationVariations);
    }
}

function getRandomNumbersFromFaces(faces) {
    let numbers = [...new Array(faces).keys()];
    numbers = numbers.map(n => n + 1);

    //shuffle using a random weight modifier
    const randomWeightModifier = 19
    const randomWeightShift = Math.floor(randomWeightModifier / 2)
    return numbers
        .sort((a, b) =>
            Math.floor((Math.random() * randomWeightModifier) - randomWeightShift));
}

actions.clearResults = () => {
    resultsBox.innerHTML = '';
}

export default actions;