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
    const faces = input.getAttribute('data-faces');
    let result = Math.floor(Math.random() * +faces) + 1;
    console.log(result);
})