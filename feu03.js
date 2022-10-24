const fs = require('fs');
const sudokuArg = fs.readFileSync("./" + process.argv[2], "utf8").split('\n');
let cleanSudokuArg = [];

let i = 0;
while (i < sudokuArg.length) {
  const cleanString = i === sudokuArg.length - 1 ? sudokuArg[i] : sudokuArg[i].substring(0, sudokuArg[i].length - 1);
  cleanSudokuArg.push(cleanString)
  i++;
}

const findPossibilitiesXY = (line) => {
  const possibilitiesX = [];

  [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((nb) => {
    if (!line.includes(nb)) {
      possibilitiesX.push(nb);
    }
  })
  return possibilitiesX;
}
const findPossibilitiesY = (indexY) => {
  const column = [];

  let i = 0;
  while (i < cleanSudokuArg.length) {
    let j = 0;
    while (j < cleanSudokuArg[i].length) {
      if (j === indexY) {
        column.push(cleanSudokuArg[i][j])
      }
      j++;
    }
    i++;
  }

  return findPossibilitiesXY(column.join(''));
}

const addNbInSudoku = (nb, index) => {
  const currentSudoku = cleanSudokuArg;
  const newSudoku = [];
  let newLine = '';
  currentSudoku.forEach((line, lineIndex) => {
    let i = 0;
    if (lineIndex === index[0]) {
      while (i < line.length) {
        (line[i] === '.' && i === index[1]) ? newLine += nb : newLine += line[i];
        i++;
      }
      newSudoku.push(newLine)
    }
    else {
      newSudoku.push(line);
    }
  });
  return newSudoku;
}

i = 0;
while (i < cleanSudokuArg.length) {
  let j = 0;
  while (j < cleanSudokuArg[i].length) {
    if (cleanSudokuArg[i][j] === '.') {
      // Je check les possibilités en X
      const possibilitiesX = findPossibilitiesXY(cleanSudokuArg[i]);
      // Je check les possibilités en Y
      const possibilitiesY = findPossibilitiesY(j);
      
      // Si une possibilité X est inclue dans les possibilités Y alors j'ajoute la possibilié X dans le sudoku
      possibilitiesX.forEach((possibilityX) => {
        if (possibilitiesY.includes(possibilityX)) {
          cleanSudokuArg = addNbInSudoku(possibilityX, [i, j]);
        }
      })
    }
    j++;
  }
  i++;
}
console.log(cleanSudokuArg.join('\n'));