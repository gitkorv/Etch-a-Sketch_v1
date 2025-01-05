let gridContainer = document.querySelector(".grid-container")

function createDiv() {
    let div = document.createElement("div");
    div.classList.add("grid__div");
    let color = `hsl(${Math.floor(Math.random() * 360 + 1)}, 65%, 75%)`;
    console.log(color);
    div.style.backgroundColor = color;
    return div
}



for (let i = 0; i < 256; i++) {
    gridContainer.appendChild(createDiv())
}
