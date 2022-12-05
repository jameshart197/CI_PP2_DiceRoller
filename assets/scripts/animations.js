const animationsBox = document.getElementById('animations-box');

function createDie(faces, result) {
    const diceBox = document.createElement('div');
    const rolledNumber = document.createElement('p');
    diceBox.className = 'dice-box'
    diceBox.innerHTML = `<img src="assets/images/d${faces}-blank.png" alt="Blank D${faces}">`;
    diceBox.appendChild(rolledNumber);
    animationsBox.appendChild(diceBox);
    const numbers = getRandomNumbersFromFaces(faces);
    let animationVariations = 5
    for(let i = 0; i < animationVariations; i++) {
        setTimeout(() => { rolledNumber.innerText = numbers[i]}, 500 * i);
        setTimeout(() => { rolledNumber.innerText = result}, 2500);
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

createDie(20, 5);
createDie(12, 3);
createDie(8, 8)