let gridContainer = document.querySelector(".grid-container")
let hoveredColor = document.querySelector(".hovered-color")

function createDiv() {
    let div = document.createElement("div");
    div.classList.add("grid__div");
    let color = `hsl(${Math.floor(Math.random() * 360 + 1)}, 65%, 75%)`;
    // console.log(color);
    div.style.backgroundColor = color;
    return div
}

for (let i = 0; i < 256; i++) {
    gridContainer.appendChild(createDiv())
}

let allDivs = Array.from(document.querySelectorAll(".grid__div"));

// console.log(allDivs);

let orgColor
let orgColorArray = [];

function addHoverOnDiv() {
    console.log(this);
    let thisDiv = this;

    // let currentOpacity = parseInt(getComputedStyle(this).opacity);
    // console.log(currentOpacity);
    // let newOp = currentOpacity + 0.5;
    // console.log(newOp);

    // // this.style.opacity = currentOpacity + Math.min(0.1, 1);
    // setTimeout(() => {
    //     thisDiv.style.opacity += currentOpacity + 0.5;
 
    // }, 100);
    if (this.style.opacity == 0) {
        this.style.opacity = 1;
    } else {
        this.style.opacity = 0;
    }
}

function removeHoverOnDiv() {
    setTimeout(() => {
        this.style.backgroundColor = orgColorArray.shift();
    }, 500);
}



allDivs.forEach(div => {
    div.addEventListener('mouseenter', addHoverOnDiv);
    // div.addEventListener('mouseleave', removeHoverOnDiv);
})