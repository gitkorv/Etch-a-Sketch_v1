let gridContainer = document.querySelector(".grid-container")
let hoveredColor = document.querySelector(".hovered-color");
let gridBackground = document.querySelector('.grid__background')
let odinSvg = document.querySelector('svg');

for (let i = 0; i < 6; i++) {
    let odinDiv = document.createElement('div');
    odinDiv.classList.add("odin")
    let odinSvgOuterHtml = odinSvg.outerHTML;
    // console.log(odinSvgOuterHtml);
    odinDiv.innerHTML = odinSvgOuterHtml;
    gridBackground.appendChild(odinDiv)
    
}

console.log(odinSvg.classList);


let activeDivIndex;
let isDragging = false;

function createDiv(pixelsWide) {
    let div = document.createElement("div");
    div.style.flex = `0 0 calc(100% / ${pixelsWide})`
    div.classList.add("grid__div");
    let color = `hsl(${Math.floor(Math.random() * 360 + 1)}, 65%, 75%)`;
    // color = `pink`;
    // console.log(color);
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
    // console.log(surroundingDivs);


    if (divIndex % pixelsWide === 0) {
        surroundingDivs.push(allDivs[divIndex + 1]);
    } else if ((divIndex + 1) % pixelsWide === 0) {
        surroundingDivs.push(allDivs[divIndex - 1]);
    } else {
        surroundingDivs.push(allDivs[divIndex + 1]);
        surroundingDivs.push(allDivs[divIndex - 1]);
    }
    // console.log(surroundingDivs);

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
    // console.log(activeDivIndex);
    let targetDiv = target;

    if (isDragging && allDivs.indexOf(targetDiv) !== activeDivIndex) {
        // console.log(allDivs.indexOf(targetDiv), activeDivIndex);
        activeDivIndex = allDivs.indexOf(targetDiv);
        // console.log(activeDivIndex);

        addHoverOnDiv(target, pixelsWide);
    }
}, 100); // Fires at most once every 200ms


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
            // console.log(target);
            throttledMove(target, pixelsWide);
        })
        div.addEventListener('touchstart', (e) => {
            isDragging = true;

            let target = e.target;
            activeDivIndex = allDivs.indexOf(target);
            addHoverOnDiv(target, pixelsWide);
        });

        div.addEventListener('touchmove', (e) => {
            // e.preventDefault(); // Prevent scrolling
            isDragging = true;
            const touch = e.touches[0];
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            throttledMove(target, pixelsWide)

            // if (lastTouchTarget !== target) {
            //     console.log("yes");
            //     lastTouchTarget = target;
            //     // activeDivIndex = allDivs.indexOf(target);
            //     throttledMove(target, pixelsWide)
            // } else {
            //     console.log("no");
            //     throttledMove(lastTouchTarget, pixelsWide)

            // }



            // if (target && target.classList.contains('grid__div')) {
            // target.classList.add('hover');
            // console.log(target);
            // }
        });
        div.addEventListener('touchend', () => (isDragging = false));
        // div.addEventListener('touchmove', (e) => throttledMove(e, pixelsWide));



    })
}

createHoverEffect(pixelsWide, allDivs)

