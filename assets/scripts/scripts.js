const diceContainers = document.getElementsByClassName('dice-container');
const getRollButtonElement = document.getElementById('roll-button');
const allDiceInputElements = document.querySelectorAll('.dice-container input');

for (container of diceContainers) {
    container.addEventListener("mouseup", (e) => {
        e.preventDefault;
        const elements = {};
        for (child of container.children) {
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
        elements.badge.innerText = elements.source.value;

    })
}

getRollButtonElement.addEventListener('click', () => {
    let totalDice = {
        total: 0
    };
    for(input of allDiceInputElements) {
        //find number of faces on dice//
        const faces = input.getAttribute('data-faces');
        //apply number of dice chosen
        totalDice[faces] = +input.value;
        //create array of results for each dice rolled and roll dice//
        totalDice['rolled'+faces] = [];
        for(let i=0; i < totalDice[faces]; i++) {
            totalDice['rolled'+faces].push(Math.floor(Math.random() * +faces) + 1);
        }
        //display results//
    }
})