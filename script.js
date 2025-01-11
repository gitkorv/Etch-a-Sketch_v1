const body = document.body;
console.log(body);
let card = document.querySelector(".card")
console.log(card);
let gridWrapper = document.querySelector(".grid-wrapper")
let gridContainer = document.querySelector(".grid-container")
let scratchHereContainer = document.querySelector(".scratch-here")

let hoveredColor = document.querySelector(".hovered-color");
let gridBackground = document.querySelector('.grid__background')
let odinSvg = document.querySelector('svg');
let whoWon;
let windowWidth = window.innerWidth;

let footer = document.querySelector(".bottom-buttons")
console.log(footer);

// GENERAL

body.classList.add("hidden");
// body.style.display = "none";
// scratchHereContainer.style.display = "none";
// gridWrapper.style.display = "none";
// footer.style.display = "none";

document.fonts.ready.then(() => {
    body.classList.remove("hidden");

    // body.style.display = "";
    // scratchHereContainer.style.display = "";
    // gridWrapper.style.display = "";
    // footer.style.display = "";
    // window.getComputedStyle(scratchHereContainer)
});

// FLOATING ON TOP AREA

let burst = document.querySelector(".burst")
let burstAnimDur = parseInt(getComputedStyle(burst).animationDuration);
let burstText = document.querySelector(".burst-text");
// console.log(parseInt(burstAnimDur));

setInterval(() => {
    burstText.textContent = burstText.textContent === "Big!" ? "Win!!" : "Big!";
}, burstAnimDur * 1000);


burst.addEventListener('animationend', (e) => {
    console.log(e);
})
console.log(burst);

// MILLION AREA

let millionHeadsContainer = document.querySelector(".million-head-container");
let millionHeadDivArray = Array.from(millionHeadsContainer.children)

for (let i = 0; i < 3; i++) {
    let millionHeadImg = document.createElement("img");
    millionHeadImg.src = `imgs/SVG/face1.svg`;
    millionHeadDivArray[i].appendChild(millionHeadImg);
    // millionHeadsContainer.appendChild(millionHeadImg);    
}

let millionText = document.querySelector(".million");
let millionTextArray = [...millionText.innerHTML];
millionText.textContent = '';
let millionSpans = [];
millionTextArray.forEach(letter => {
    let millionLetterSpan = document.createElement('span');
    millionLetterSpan.textContent = letter;
    millionText.appendChild(millionLetterSpan)

})

let newMillionSpans = [...millionText.children];

function loopMillionLetters() {
    let gapTime = 50;
    newMillionSpans.forEach((letter, i) => {
        setTimeout(() => {
            letter.classList.toggle("blink");
        }, i * gapTime);
    })
}

let millionTextInterval = setInterval(() => {
    loopMillionLetters()
}, 2000)

// WIN PRICES AREA

let winningHeadlineContainer = document.querySelector(".winning-headline");
let orgWinningHeadlineContent = winningHeadlineContainer.innerHTML;

let winningHeadOddsSpan = document.createElement('span');
winningHeadOddsSpan.classList.add("win-odds-text")
winningHeadOddsSpan.innerHTML = " (and odds)";

let longerWinningHeadContainer = winningHeadlineContainer.appendChild(winningHeadOddsSpan);

function adjustElementsToWindowWidth() {
    windowWidth = window.innerWidth;
    if (windowWidth > 390) {
        winningHeadlineContainer.insertAdjacentElement('beforeend', winningHeadOddsSpan);
    } else {
        winningHeadlineContainer.innerHTML = orgWinningHeadlineContent;
    }
}

window.addEventListener('resize', () => {
    adjustElementsToWindowWidth()
})

adjustElementsToWindowWidth()

let keysContainerArray = Array.from(document.querySelectorAll(".keys"));

keysContainerArray.forEach((key, i) => {
    let imgIndex = i + 1;
    let threeImgs = Array.from(key.children)

    threeImgs.forEach(container => {
        let parentClassName = container.parentElement.classList;
        let element = container.outerHTML;
        let odinHeadSvg = document.createElement('img')
        odinHeadSvg.src = `imgs/SVG/face${imgIndex}.svg`;
        container.appendChild(odinHeadSvg)
    })
})

// SCRATCH BOARD AREA

// SCRATCH TEXT

let scratchLine = document.querySelector('.scratch-line');
let scratchLineWidth = 20;
let direction = -1;

let scratchInterval = setInterval(() => {
    scratchLineWidth += direction;

    if (scratchLineWidth <= 5 || scratchLineWidth >= 20) {
        direction *= -1;
    }
    scratchLine.style.width = `${scratchLineWidth}px`;
    // scratchHandWrapper.style.left = scratchLineWidth + "px"
}, 70)

// clearInterval(scratchInterval)



// SCRATCH SURFACE

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
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
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

    // BACKGROUND

function generateRandomNumbers() {
    const result = [];
    const count = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    let maxCountReached = false;

    // Weight array: Higher weight = higher probability
    const weights = [3, 4, 4.5, 5, 5.5, 6]; // Lower weight for 1

    function getWeightedRandom() {
        const cumulativeWeights = [];
        let sum = 0;

        weights.forEach((weight, i) => {
            sum += weight;
            cumulativeWeights[i] = sum;
        });

        const random = Math.random() * sum;

        for (let i = 0; i < cumulativeWeights.length; i++) {
            if (random < cumulativeWeights[i]) {
                return i + 1; // Return the number (1-6)
            }
        }
    }

    while (result.length < 9) {
        const randomNumber = getWeightedRandom();

        if (maxCountReached) {
            // Allow numbers only if their count is less than 2
            if (count[randomNumber] < 2) {
                result.push(randomNumber);
                count[randomNumber]++;
            }
        } else {
            // Allow numbers if their count is less than 3
            if (count[randomNumber] < 3) {
                result.push(randomNumber);
                count[randomNumber]++;

                // Check if any number has reached 3 occurrences
                if (count[randomNumber] === 3) {
                    whoWon = randomNumber;
                    maxCountReached = true;
                }
            }
        }
    }
    return result;
}

let randomHeadNumbers = generateRandomNumbers();
console.log(randomHeadNumbers);

randomHeadNumbers.forEach(number => {
    let odinDiv = document.createElement('div');
    odinDiv.classList.add("odin", "face" + number)
    let odinImg = document.createElement("img");

    odinImg.src = `imgs/SVG/face${number}.svg`;
    odinDiv.appendChild(odinImg)
    gridBackground.appendChild(odinDiv)
})

// BOTTOM BUTTONS AREA

const pixelButton = document.querySelector('.pixel-button');

pixelButton.addEventListener('click', () => {
    let inputPixelsWide = Number(prompt("How many pixels wide?"));
    pixelsWide = inputPixelsWide > 0 ? inputPixelsWide : pixelsWide;
    console.log(pixelsWide);
    // pixelsWide = inputPixelsWide;
    square = pixelsWide * pixelsWide;
    gridContainer.replaceChildren()
    createPixelSquare(pixelsWide, square)
    allDivs = Array.from(document.querySelectorAll(".grid__div"));
    createHoverEffect(pixelsWide, allDivs)
})

const resultButton = document.querySelector('.result-button');
const resultTextContainer = document.querySelector('.show-result')

console.log("winner " + whoWon);
let gridFacesArray = [...document.querySelectorAll(".odin")];
let faceNames = ["Odins", "Santas", "Mustaches", "Spies", "Masks", "Eggs"]
let winnerHeadName
let winningResultText;
let losingResultText;

if (windowWidth <= 375) {
    winningResultText = `= Win! 3 ${faceNames[whoWon - 1]}`;
    losingResultText = "= Bummer, try again!"
} else {
    winningResultText = `= You got 3 ${faceNames[whoWon - 1]}, congrats!!!`;
    losingResultText = "= Sorry, no match, try again!"

}

if (whoWon === undefined) {
    winnerHeadName = losingResultText;
} else {
    console.log(windowWidth);
    winnerHeadName = winningResultText;
}

let winningPhrase = winnerHeadName;
console.log(winningPhrase);

// Split the string into individual letters and wrap them in spans
winningPhrase.split("").forEach((letter) => {
    const span = document.createElement("span");
    span.classList.add("result-text", "result-text-hidden");
    span.textContent = letter; // Add the letter as the span's content
    if (letter === " ") {
        span.style.marginRight = "0.1em"; // Optional: Add spacing for spaces
    }
    resultTextContainer.appendChild(span); // Append the span to the container
});



resultButton.addEventListener('click', () => {
    // Add the class to each letter with a 0.2s interval
    const resultLetters = [...resultTextContainer.children]; // Get all the span elements
    resultLetters.forEach((letter, index) => {
        setTimeout(() => {
            letter.classList.remove("result-text-hidden");
        }, index * 50); // 200ms interval
    });
})

let curtain = document.querySelector('.curtain');
console.log(curtain);

document.getElementById("replay-button").addEventListener("click", () => {
    // curtain.classList.add("on")
    setTimeout(() => {
        location.reload(); // Reloads the current page
    }, 300);
});