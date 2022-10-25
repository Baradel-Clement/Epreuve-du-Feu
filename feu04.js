const fs = require('fs');
const plateau = fs.readFileSync("./" + process.argv[2], "utf8").split('\r\n');

const getSquareCorners = (line, range) => {
  let i = line === 0 ? line : line - 1;
  let j = range[0];
  let topCornerLeft = [];
  let topCornerRight = [];

  while (i >= 0) {
    j = range[0];
    while (j >= range[0] && j < range[1] && topCornerLeft.length === 0) {
      if (plateau[i][j] === 'x') {
        topCornerLeft = [i + 1, range[0]]
        topCornerRight = [i + 1, (range[1] - 1)]
      }
      j++;
    }
    i--;
  }
  if (i === -1) {
    i = 0;
  }
  if (i === 0 && topCornerLeft.length === 0) {
    topCornerLeft = [0, range[0]];
    topCornerRight = [0, (range[1] - 1)];
  }

  i = line === plateau.length - 1 ? line : line + 1;
  j = range[0];
  let botCornerLeft = [];
  let botCornerRight = [];

  while (i < plateau.length) {
    j = range[0];
    while (j >= range[0] && j < range[1] && botCornerLeft.length === 0) {
      if (plateau[i][j] === 'x') {
        botCornerLeft = [i - 1, range[0]]
        botCornerRight = [i - 1, (range[1] - 1)]
      }
      j++;
    }
    i++;
  }
  if (i === plateau.length) {
    i = 0;
  }
  if (i === 0 && botCornerLeft.length === 0) {
    botCornerLeft = [plateau.length - 1, range[0]];
    botCornerRight = [plateau.length - 1, (range[1] - 1)];
  }

  const air = (((topCornerRight[1] - topCornerLeft[1]) + 1) * ((botCornerRight[0] - topCornerRight[0]) + 1));
  return {
    topCornerLeft,
    topCornerRight,
    botCornerLeft,
    botCornerRight,
    air,
  }
}

let i = 0;
let allSquares = [];


while (i < plateau.length) {
  let j = 0;
  while (j < plateau[i].length) {
    // Tant que je ne tombe pas sur 'x' j'incrémente la longeur du rectangle
    let widthSquare = 0;
    let startRange = j;
    while (j < plateau[i].length && plateau[i][j] !== 'x') {
      widthSquare++;
      j++;
    }
    const square = getSquareCorners(i, [startRange, j]); // Je vais chercher les corners du rectangle grâce à la longeur que j'ai trouvé
    allSquares.push(square);
    if (plateau[i][j] === 'x') {
      j++;
    }
  }
  i++;
}

// Je définis le plus grand rectangle en fonction de l'air
let biggestSquare = {};
allSquares.forEach((square) => {
  if (biggestSquare.air === undefined || square.air > biggestSquare.air) {
    biggestSquare = square;
  }
});

const newPlateau = [];
i = 0;
// Je crée le nouveau plateau
while (i < plateau.length) {
  if (i >= biggestSquare.topCornerLeft[0] && i <= biggestSquare.botCornerLeft[0]) {
    let newLine = '';
    let j = 0;
    
    while (j < plateau[i].length) {
      if (j >= biggestSquare.topCornerLeft[1] && j <= biggestSquare.topCornerRight[1]) {
        newLine += 'o'
      }
      else {
        newLine += plateau[i][j];
      }
      j++;
    }
    newPlateau.push(newLine);
  }
  else {
    newPlateau.push(plateau[i])
  }
  i++;
}

console.log(newPlateau)
