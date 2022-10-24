const fs = require('fs');
const boardFile = fs.readFileSync("./" + process.argv[2], "utf8").split('\n');
const toFindFile = fs.readFileSync("./" + process.argv[3], "utf8").split('\n');
const cleanBoardFile = [];
const cleanToFindFile = [];

// Je clean les fichiers en enlevant les \r
let i = 0;
while (i < boardFile.length) {
  const cleanString = i === boardFile.length - 1 ? boardFile[i] : boardFile[i].substring(0, boardFile[i].length - 1);
  cleanBoardFile.push(cleanString)
  i++;
}
i = 0;
while (i < toFindFile.length) {
  const cleanString = i === toFindFile.length - 1 ? toFindFile[i] : toFindFile[i].substring(0, toFindFile[i].length - 1);
  cleanToFindFile.push(cleanString)
  i++;
}

// Je construis un tableau pour connaitre la position des chiffres de toFindFile en fonction de l'index de la premiere lettre prremire ligne toFIndfile
const findPosition = (firstIndex, currentLine) => {
  let i = 1;
  let positionsToFind = [];
  while (i < cleanToFindFile.length) {
    j = 0;
    while (j < cleanToFindFile[i].length) {
      if (cleanToFindFile[i][j] !== ' ') {
        positionsToFind.push({ line: currentLine + i,char: cleanToFindFile[i][j], index: firstIndex + j })
      }
      j++;
    }
    i++;
  }
  return positionsToFind;
}

const checkMultipleInclude = (boardLine, toFindLine) => {
  let result = {
    multipleInclude: false,
    indexs: [],
  }
  let i = 0;
  let j = 0;
  while (i < boardLine.length) {
    j = 0;
    if (boardLine[i] === toFindLine[j] || toFindLine[j] === ' ') {
      while ((boardLine[i] === toFindLine[j] || toFindLine[j] === ' ') && j < toFindLine.length) {
        j++;
        i++;
      }
      if (j === toFindLine.length) {
        result.indexs.push([(i - toFindLine.length), i - 1]);
        result.multipleInclude = result.indexs.length > 1;
        i = i - (toFindLine.length - 1);
      }
    }
    else {
      i++;
    }
  }
  return result;
}

// J'enleve les espaces de la premiere ligne pour que l'include fonctionne
const purifyfirstLine = (firstLine) => {
  if (firstLine[0] !== ' ') {
    return firstLine;
  }
  else {
    let i = 0;
    while (firstLine[i] === ' ') {
      i++;
    }
    let cleanFirstLine = firstLine.substring(i, firstLine.length);
    return cleanFirstLine;
  }
}

const finishShema = (shemaStartLine, indexFirstLine, positionsToFind) => {
  // Je crée un board vide
  let emptyShema = [];
  cleanBoardFile.forEach((line) => {
    let i = 0;
    let emptyLine = '';
    while (i < line.length) {
      emptyLine += '-'
      i++;
    }
    emptyShema.push(emptyLine);
  })

  // Je construis la premiere ligne du shéma
  i = indexFirstLine[0];
  let rangeIndex = [];
  while (i >= indexFirstLine[0] && i <= indexFirstLine[1]) {
    rangeIndex.push(i);
    i++;
  }
  i = 0;
  let newLine = '';
  while (i < rangeIndex[0]) {
    newLine += '-';
    i++;
  }
  i = 0;
  rangeIndex.forEach((index) => {
    if (cleanToFindFile[0][i] === ' ') {
      newLine += '-';
    }
    else {
      newLine += cleanToFindFile[0][i];
    }
    i++;
  })
  while (newLine.length !== emptyShema[0].length) {
    newLine += '-';
  }
  emptyShema[shemaStartLine] = newLine;

  // Pour toutes les autres ligne de toFind je remplis le shéma
  positionsToFind.forEach((position) => {
    let newLine = '';
    const oldLine = emptyShema[position.line];
    let i = 0;
    while (i < oldLine.length) {
      newLine += oldLine[i];
      i++;
    }
    let splitNewLine = newLine.split('');

    splitNewLine[position.index] = position.char;
    emptyShema[position.line] = splitNewLine.join('');
  })

  console.log('Trouvé');
  console.log(`Coordonnées : ${shemaStartLine},${indexFirstLine[0]}`)
  console.log(emptyShema.join('\n'))
}

i = 0;
while (i < cleanBoardFile.length) {
  if (cleanBoardFile[i].includes(purifyfirstLine(cleanToFindFile[0]))) {
    multipleInclude = checkMultipleInclude(cleanBoardFile[i], cleanToFindFile[0]);
    let j = 0;
    while (j < multipleInclude.indexs.length) {
      const positionsToFind = findPosition(multipleInclude.indexs[j][0], i);
      let shemaIsOk = true;
      positionsToFind.forEach((positionToFind) => {
        if (cleanBoardFile[positionToFind.line][positionToFind.index] !== positionToFind.char) {
          shemaIsOk = false;
        }
      })
      if (shemaIsOk) {
        return finishShema(i, multipleInclude.indexs[j], positionsToFind);
      }
      j++;
    }
  }
  i++;
}
if (i === cleanBoardFile.length) {
  console.log('Introuvable');
}
