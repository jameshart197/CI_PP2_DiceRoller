const diceContainers = document.getElementsByClassName('dice-container');
const getRollButtonElement = document.getElementById('roll-button');
const allDiceInputElements = document.querySelectorAll('.dice-container input');

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
                break
            }
        }
        switch (e.button) {
            case 0:
                elements.source.value++;
                break;
            case 2:
                if(elements.source.value !=0) {
                    elements.source.value--;
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
        //create array of results for each dice rolled and roll dice//
        diceResults[`d${faces}Results`] = [];
        for(let i=0; i < +input.value; i++) {
            const result = Math.floor(Math.random() * faces) + 1;
            diceResults[`d${faces}Results`].push(result);
            diceResults.total += result
        }
        //display results//
        diceResults[`d${faces}Messages`] = buildRolledMessage(faces, diceResults[`d${faces}Results`])
        //reset count//
        input.value = 0;
    }
    console.log(diceResults)
})

function buildRolledMessage(diceType, results) {
    const rolledMessages = {};
    rolledMessages.rollingMessage = `Rolling ${results.length}d${diceType}`
    rolledMessages.resultsMessage = `Rolled (${results.join(' + ')}) total= ${results.reduce((runningTotal, a) => runningTotal + a, 0)}`
    return rolledMessages;
}
