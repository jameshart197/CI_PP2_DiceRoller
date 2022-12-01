const diceContainers = document.getElementsByClassName('dice-container');
const getRollButtonElement = document.getElementById('roll-button');
const allDiceInputElements = document.querySelectorAll('.dice-container input');
const resultsBox = document.getElementById('results-box');
const clearButton = document.getElementById('clear')
const toggleButtons = [document.getElementsByClassName('toggle')[0],document.getElementsByClassName('toggle')[1]];

function updateBadge (input, value) {
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
                if(elements.source.value !=0) {
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
    let diceResults = {};
    diceResults.total= 0;
    
        
    for(input of allDiceInputElements) {
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
        for(let i=0; i < diceQuantity; i++) {
            const result = Math.floor(Math.random() * faces) + 1;
            diceResults[`d${faces}Results`].push(result);
            diceResults.total += result
            /* if dangerous crit, push ${faces} into array */
        }
        //display results//
        diceResults[`d${faces}Messages`] = buildRolledMessage(faces, diceResults[`d${faces}Results`])
        resultsBox.innerText += diceResults[`d${faces}Messages`].rollingMessage;
        //delay
        resultsBox.innerText += diceResults[`d${faces}Messages`].resultsMessage;
        //reset count//
        updateBadge(input, 0)
    }
    let multipleDice = Object.keys(diceResults).length > 3;
    if (multipleDice) {
    resultsBox.innerText += `\n Combined total = ${diceResults.total}`
    }   
    console.log(diceResults)
})

function buildRolledMessage(diceType, results) {
    const rolledMessages = {};
    rolledMessages.rollingMessage = `\n Rolling ${results.length}d${diceType}... \n`
    rolledMessages.resultsMessage = `\n Rolled (${results.join(' + ')}) \n Total = ${results.reduce((runningTotal, a) => runningTotal + a, 0)} \n`
    rolledMessages.resultsCombined = `Combined total = `
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