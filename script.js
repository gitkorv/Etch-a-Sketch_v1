let gridContainer = document.querySelector(".grid-container")
let hoveredColor = document.querySelector(".hovered-color");
let gridBackground = document.querySelector('.grid__background')
let odinSvg = document.querySelector('svg');

let faceCounts = {
    odin: 0,
    santa: 0,
    mustache: 0,
    spy: 0,
    mask: 0,
    egg: 0
}

let faceCountArray = [0,0,0,0,0,0]


function checkFacePicsActive() {

    let limit = 3;
    let gameOver = false;

    for (let i = 0; i < 1; i++) {
        let facePickNumber = Math.floor(Math.random() * 6);


        if (faceCountArray[facePickNumber] + 1 === 3 && gameOver === false) {
            faceCountArray[facePickNumber] = faceCountArray[facePickNumber] + 1;
            gameOver = true;
            console.log(facePickNumber + 1 + "won");
            limit--;
            return facePickNumber
        } else if (faceCountArray[facePickNumber] + 1 === limit) {
            console.log(facePickNumber + "is at limit");
            i--
        } else {
            faceCountArray[facePickNumber] = faceCountArray[facePickNumber] + 1;
            return facePickNumber
        }
        console.log(facePickNumber);
    }
}

for (let i = 0; i < 9; i++) {
    let odinDiv = document.createElement('div');
    odinDiv.classList.add("odin")
    let odinImg = document.createElement("img");
    facePickNumber = checkFacePicsActive()
    console.log(faceCountArray);


    odinImg.src = `imgs/SVG/face${facePickNumber + 1}.svg`;
    odinDiv.appendChild(odinImg)
    gridBackground.appendChild(odinDiv)
}

let millionHeadsContainer = document.querySelector(".million-head-container");
let millionHeadDivArray = Array.from(millionHeadsContainer.children)
console.log(millionHeadDivArray);

for (let i = 0; i < 3; i++) {
    let millionHeadImg = document.createElement("img");
    millionHeadImg.src = `imgs/SVG/face1.svg`;
    millionHeadDivArray[i].appendChild(millionHeadImg);  
    // millionHeadsContainer.appendChild(millionHeadImg);    
}

let keysContainerArray = Array.from(document.querySelectorAll(".keys"));
// console.log(keysContainerArray);

keysContainerArray.forEach((key, i) => {
    let imgIndex = i + 1;
    let threeImgs = Array.from(key.children)
    
    threeImgs.forEach(container => {
        let parentClassName = container.parentElement.classList;
        let element = container.outerHTML;
        let testSvg = document.createElement('img')
        testSvg.src = `imgs/SVG/face${imgIndex}.svg`;
        container.appendChild(testSvg)
    })
})

let activeDivIndex;
let isDragging = false;

function createDiv(pixelsWide) {
    let div = document.createElement("div");
    div.style.flex = `0 0 calc(100% / ${pixelsWide})`
    div.classList.add("grid__div");
    let color = `hsl(${Math.floor(Math.random() * 10 + 200)}, 50%, 60%)`;
    // color = `pink`;
    div.style.backgroundColor = color;
    return div
}

let pixelsWide = 32;
let square = pixelsWide * pixelsWide;

function createPixelSquare(pixelsWide, square) {
    for (let i = 0; i < square; i++) {
        let div = createDiv(pixelsWide);
        div.classList.add("div-" + (i + 1));
        gridContainer.appendChild(div)
    }
}

createPixelSquare(pixelsWide, square)

let allDivs = Array.from(document.querySelectorAll(".grid__div"));


const pixelButton = document.querySelector('button');

console.log(pixelButton);

pixelButton.addEventListener('click', () => {
    pixelsWide = Number(prompt("How many pixels?"));
    square = pixelsWide * pixelsWide;
    gridContainer.replaceChildren()
    createPixelSquare(pixelsWide, square)
    allDivs = Array.from(document.querySelectorAll(".grid__div"));
    createHoverEffect(pixelsWide, allDivs)
})

function addHoverOnDiv(target, pixelsWide) {
    let targetDiv = target;
    let divIndex = allDivs.indexOf(targetDiv);
    square = pixelsWide * pixelsWide;

    let centerErase = 0.4;
    let surroundingErase = 0.2;

    let currentOpacity = Number(getComputedStyle(targetDiv).opacity);
    let newOpacity = currentOpacity - centerErase;
    allDivs[divIndex].style.opacity = newOpacity > 0 ? newOpacity : 0;

    let surroundingDivs = []

    if (divIndex - pixelsWide >= 0) surroundingDivs.push(allDivs[divIndex - pixelsWide])
    if (divIndex + pixelsWide < square) surroundingDivs.push(allDivs[divIndex + pixelsWide])

    if (divIndex % pixelsWide === 0) {
        surroundingDivs.push(allDivs[divIndex + 1]);
    } else if ((divIndex + 1) % pixelsWide === 0) {
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
const throttledMove = throttle((target, pixelsWide) => {
    let targetDiv = target;

    if (isDragging && allDivs.indexOf(targetDiv) !== activeDivIndex) {
        activeDivIndex = allDivs.indexOf(targetDiv);
        addHoverOnDiv(target, pixelsWide);
    }
}, 100); 


function createHoverEffect(pixelsWide, allDivs) {
    allDivs.forEach(div => {
        div.addEventListener('mousedown', (e) => {
            isDragging = true;
            let target = e.target;
            activeDivIndex = allDivs.indexOf(target);
            console.log(target);
            addHoverOnDiv(target, pixelsWide)
        });
        div.addEventListener('mouseup', () => (isDragging = false));
        div.addEventListener('mousemove', (e) => {
            let target = e.target;
            throttledMove(target, pixelsWide);
        })
        div.addEventListener('touchstart', (e) => {
            isDragging = true;

            let target = e.target;
            activeDivIndex = allDivs.indexOf(target);
            addHoverOnDiv(target, pixelsWide);
        });

        div.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent scrolling
            isDragging = true;
            const touch = e.touches[0];
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            throttledMove(target, pixelsWide)
        });
        div.addEventListener('touchend', () => (isDragging = false));
    })
}

createHoverEffect(pixelsWide, allDivs)

let winningHeadlineContainer = document.querySelector(".winning-headline");
let orgWinningHeadlineContent = winningHeadlineContainer.innerHTML;
console.log(winningHeadlineContainer);

let winningHeadOddsSpan = document.createElement('span');
winningHeadOddsSpan.classList.add("win-odds-text")
winningHeadOddsSpan.innerHTML = " (and odds)";

let longerWinningHeadContainer = winningHeadlineContainer.appendChild(winningHeadOddsSpan);
console.log(longerWinningHeadContainer);

let windowWidth = window.innerWidth;

function adjustElementsToWindowWidth() {
    windowWidth = window.innerWidth;
    if (windowWidth > 390) {
        winningHeadlineContainer.insertAdjacentElement('beforeend',winningHeadOddsSpan);
    } else {
        winningHeadlineContainer.innerHTML = orgWinningHeadlineContent;
    }
}

window.addEventListener('resize', () => {
    adjustElementsToWindowWidth()
})

adjustElementsToWindowWidth()

let scratchLine = document.querySelector('.scratch-line');
console.log(scratchLine);
// let scratchHandWrapper = document.querySelector(".scratch-hand-wrapper")
// console.log(scratchHandWrapper);
let scratchLineWidth = 20; 
let direction = -1;

// scratchLine.style.width = "40px"

let scratchInterval = setInterval(() => {
    scratchLineWidth += direction;

    if (scratchLineWidth <= 5 || scratchLineWidth >= 20) {
        direction *= -1;
    }
    scratchLine.style.width =`${scratchLineWidth}px`;
    // scratchHandWrapper.style.left = scratchLineWidth + "px"
}, 70)

// clearInterval(scratchInterval)

let millionText = document.querySelector(".million");
let millionTextArray = [...millionText.innerHTML];
millionText.textContent = '';
let millionSpans = [];
millionTextArray.forEach(letter =>{
    let millionLetterSpan = document.createElement('span');
    millionLetterSpan.textContent = letter;
    millionText.appendChild(millionLetterSpan)

})

let newMillionSpans = [...millionText.children];
console.log(newMillionSpans);



function loopMillionLetters() {
    let gapTime = 50;
    newMillionSpans.forEach((letter, i) => {
        setTimeout(() => {
            letter.classList.toggle("blink");
        }, i * gapTime);

    })
    
}




// millionTextArray[0].style.color = "black";

let millionTextInterval = setInterval(() => {
    loopMillionLetters()
}, 2000)

// millionTextArray.forEach(letter => {
//     letter.style.color = "black";
// })