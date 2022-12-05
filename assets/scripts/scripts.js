const diceContainers = document.getElementsByClassName('dice-container');
const getRollButtonElement = document.getElementById('roll-button');
const allDiceInputElements = document.querySelectorAll('.dice-container input');
const resultsBox = document.getElementById('results-box');
const clearButton = document.getElementById('clear')
const toggleButtons = [document.getElementsByClassName('toggle')[0], document.getElementsByClassName('toggle')[1]];
const minusModifier = document.getElementById('minus');
const plusModifier = document.getElementById('plus')
const modifier = document.getElementById('modifiers')
const animationsBox = document.getElementById('animations-box');
const animationVariations = 8
const refreshDelay = 250

minusModifier.addEventListener('click', () => {
    updateModifier(modifier, +modifier.value - 1);
})

plusModifier.addEventListener('click', () => {
    updateModifier(modifier, +modifier.value + 1);
})

function updateModifier(input, value) {
    modifier.value = value;
    modifier.innerText = value;
}

function updateBadge(input, value) {
    const badge = input.previousElementSibling;
    input.value = value;
    badge.innerText = value;
}

for (container of diceContainers) {
    container.addEventListener("mouseup", (e) => {
        e.preventDefault;
        const elements = {};
        for (child of e.target.parentElement.children) {
            if (child.tagName === 'DIV') {
                elements.badge = child;
            } else if (child.tagName === 'IMG') {
                elements.diceImage = child;
            } else if (child.tagName === 'INPUT') {
                elements.source = child
            } else {
                continue
            }
        }
        switch (e.button) {
            case 0:
                updateBadge(elements.source, +elements.source.value + 1);
                break;
            case 2:
                if (elements.source.value != 0) {
                    updateBadge(elements.source, +elements.source.value - 1);
                }
                break;

            default:
                break;
        }
    })
}

//We rolled 2 d20 and 1d12 and got 5, 4, 10. 

getRollButtonElement.addEventListener('click', () => {
    animationsBox.innerHTML = '';
    let diceResults = {};
    diceResults.total = 0;


    for (input of allDiceInputElements) {
        if (+input.value === 0) {
            continue;
        }
        //find number of faces on dice//
        const faces = +input.getAttribute('data-faces');
        let diceQuantity = +input.value;
        if (isCrit('standard-crit')) {
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
            if (isCrit('dangerous-crit')) {
                diceResults.total += faces;
            }
        }
        //display results//
        diceResults[`d${faces}Messages`] = buildRolledMessage(faces, diceResults[`d${faces}Results`])
        resultsBox.innerText += diceResults[`d${faces}Messages`].rollingMessage;

        //animations script
        function createDie(faces, result) {
            const diceBox = document.createElement('div');
            const rolledNumber = document.createElement('p');
            diceBox.className = 'dice-box'
            diceBox.innerHTML = `<img src="assets/images/d${faces}-blank.png" alt="Blank D${faces}">`;
            diceBox.appendChild(rolledNumber);
            animationsBox.appendChild(diceBox);
            const numbers = getRandomNumbersFromFaces(faces);
            for (let i = 0; i < animationVariations; i++) {
                setTimeout(() => {
                    rolledNumber.innerText = numbers[i % 4]
                }, 150 * i);
                setTimeout(() => {
                    rolledNumber.innerText = result
                }, 150 * animationVariations);
            }
        }

        function getRandomNumbersFromFaces(faces) {
            let numbers = [...new Array(faces).keys()];
            numbers = numbers.map(n => n + 1);

            //we sort the array 7 times to increase the randomness of the results (sorting once doesn't shuffle them much)
            return numbers
                .sort((a, b) => Math.floor((Math.random() * 3) - 1))
                .sort((a, b) => Math.floor((Math.random() * 3) - 1))
                .sort((a, b) => Math.floor((Math.random() * 3) - 1))
                .sort((a, b) => Math.floor((Math.random() * 3) - 1))
                .sort((a, b) => Math.floor((Math.random() * 3) - 1))
                .sort((a, b) => Math.floor((Math.random() * 3) - 1))
                .sort((a, b) => Math.floor((Math.random() * 3) - 1));
        }

        // animations code ends

        setTimeout(() => {
            resultsBox.innerText += diceResults[`d${faces}Messages`].rolledResult;
            if (isCrit('dangerous-crit')) {
                resultsBox.innerText += diceResults[`d${faces}Messages`].dangerousCrit;
            }
            resultsBox.innerText += diceResults[`d${faces}Messages`].resultAdded;
            //reset count//
            updateBadge(input, 0)
        }, 150 * animationVariations + (refreshDelay * 2))
    }

    setTimeout(() => {
        let multipleDice = Object.keys(diceResults).length > 3;
        if (multipleDice && modifier.value != 0) {
            const addPlus = modifier.value > 0 ? '+' : '';
            resultsBox.innerText += `\n Combined total = ${diceResults.total} \n (${addPlus}${+modifier.value}) = ${diceResults.total + +modifier.value} \n`
        } else if (modifier.value != 0) {
            const addPlus = modifier.value > 0 ? '+' : '';
            resultsBox.innerText += `\n(${addPlus}${+modifier.value}) = ${diceResults.total + +modifier.value} \n`
        } else if (multipleDice) {
            resultsBox.innerText += `\n Combined total = ${diceResults.total} \n`
        }
    }, 150 * animationVariations + (refreshDelay * 2))
})

function buildRolledMessage(diceType, results) {
    const rolledMessages = {};
    let subTotal = results.reduce((runningTotal, a) => runningTotal + a, 0);
    if (isCrit('dangerous-crit')) {
        subTotal += results.map((a) => diceType).reduce((runningTotal, a) => runningTotal + a, 0);
    }
    rolledMessages.rollingMessage = `\n Rolling ${results.length}d${diceType}... \n`
    rolledMessages.rolledResult = `\n Rolled (${results.join(' + ')})`
    rolledMessages.resultAdded = `\n Total = ${subTotal} \n`
    rolledMessages.dangerousCrit = `\n Dangerous Crits (${results.map((a) => diceType).join(' + ')})`
    return rolledMessages;
}

clearButton.addEventListener('click', () => {
    resultsBox.innerText = '';
})

for (button of toggleButtons) {
    button.addEventListener('change', (e) => {
        if (e.currentTarget.checked) {
            //alert('change detected')
            toggleButtons.forEach(tb => {
                if (tb.id != e.currentTarget.id) {
                    tb.checked = false;
                }
            })
        }
    })
}

function isCrit(id) {
    for (button of toggleButtons) {
        if (button.id === id) {
            return button.checked
        }
    }
}