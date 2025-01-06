let gridContainer = document.querySelector(".grid-container")
let hoveredColor = document.querySelector(".hovered-color")

function createDiv() {
    let div = document.createElement("div");
    div.classList.add("grid__div");
    let color = `hsl(${Math.floor(Math.random() * 360 + 1)}, 65%, 75%)`;
    // color = `pink`;
    // console.log(color);
    div.style.backgroundColor = color;
    return div
}

let squareSideNumber = 16;
let square = squareSideNumber * squareSideNumber;

for (let i = 0; i < square; i++) {
    let div = createDiv();
    div.classList.add("div-" + (i + 1));
    gridContainer.appendChild(div)
}

let allDivs = Array.from(document.querySelectorAll(".grid__div"));

function addHoverOnDiv(event) {
    let hoveredDiv = event.srcElement
    let divIndex = allDivs.indexOf(hoveredDiv);

    let centerErase = 0.4;
    let surroundingErase = 0.2;

    let currentOpacity = Number(getComputedStyle(hoveredDiv).opacity);
    let newOpacity = currentOpacity - centerErase;
    allDivs[divIndex].style.opacity = newOpacity > 0 ? newOpacity : 0;

    let surroundingDivs = []

    if (divIndex - squareSideNumber >= 0) surroundingDivs.push(allDivs[divIndex - squareSideNumber])
    if (divIndex + squareSideNumber <= 255) surroundingDivs.push(allDivs[divIndex + squareSideNumber])


    if (divIndex % 16 === 0) {
        surroundingDivs.push(allDivs[divIndex + 1]);
    } else if ((divIndex + 1) % 16 === 0) {
        surroundingDivs.push(allDivs[divIndex - 1]);
    } else {
        surroundingDivs.push(allDivs[divIndex + 1]);
        surroundingDivs.push(allDivs[divIndex - 1]);
    }

    surroundingDivs.forEach(div => {
        let edgeOpacity = Number(getComputedStyle(div).opacity);
        let newEdgeOpacity = edgeOpacity - surroundingErase;
        div.style.opacity = newEdgeOpacity > 0 ? newEdgeOpacity : 0;
    })

}

function removeHoverOnDiv(event) {
    let hoveredDiv = event.srcElement
    hoveredDiv.style.opacity = newOpacity;
}

function throttle(func, limit) {
    let lastFunc;
    let lastRan;

    return function (...args) {
        const context = this;
        if (!lastRan) {
            func.apply(context, args); // Run immediately on the first event
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc); // Clear the last timeout if it exists
            lastFunc = setTimeout(function () {
                if (Date.now() - lastRan >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

// Throttle usage
const throttledMove = throttle((e) => {
    // console.log(activeDivIndex);
    const targetDiv = e.target;

    if (isDragging && allDivs.indexOf(targetDiv) !== activeDivIndex) {
        activeDivIndex = allDivs.indexOf(targetDiv);
        // console.log(activeDivIndex);

        addHoverOnDiv(e);
    }}, 100); // Fires at most once every 200ms


let activeDivIndex;
let isDragging = false;

allDivs.forEach(div => {
    div.addEventListener('mousedown', (e) => {
        activeDivIndex = allDivs.indexOf(e.target);
        isDragging = true;
        addHoverOnDiv(e)
    });
    div.addEventListener('mouseup', () => (isDragging = false));
    div.addEventListener('mousemove', throttledMove)

    div.addEventListener('touchstart', (e) => {
        activeDivIndex = allDivs.indexOf(e.target);
        isDragging = true;
        addHoverOnDiv(e);
    });
    div.addEventListener('touchend', () => (isDragging = false));
    div.addEventListener('touchmove', throttledMove);

})