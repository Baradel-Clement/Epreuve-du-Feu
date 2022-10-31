const fs = require('fs');
let labyrinthe = fs.readFileSync("./" + process.argv[2], "utf8").split('\r\n');

let i = 0;
let localisation = [];
let localisationEnd = [];
let tracker = [];

// Je localise le 2 et le 1 pour les mettre en variable
while (i < labyrinthe.length) {
  if (labyrinthe[i].indexOf('2') !== -1) {
    localisation = [i, labyrinthe[i].indexOf('2')];
  }
  if (labyrinthe[i].indexOf('1') !== -1) {
    localisationEnd = [i, labyrinthe[i].indexOf('1')];
  }
  i++;
}

// Je check les les cases autour du 2 pour voir si je peux me déplacer
const findMvmtPossibilities = (localisation) => {
  const upChar = [labyrinthe[localisation[0] - 1][localisation[1]], 'up'];
  const rightChar = [labyrinthe[localisation[0]][localisation[1] + 1], 'right'];
  const downChar = [labyrinthe[localisation[0] + 1][localisation[1]], 'down'];
  const leftChar = [labyrinthe[localisation[0]][localisation[1] - 1], 'left'];

  const possibilities = []
  const mvmts = [upChar, rightChar, downChar, leftChar]
  mvmts.forEach((direction) => {
    if (direction[0] === ' ' || direction[0] === 'o') {
      possibilities.push(direction[1]);
    }
  })
  return possibilities;
};

// Je check si dans les possibilités il y'a des cases où je me suis déjà rendu 
const isBoxsAlreadyBeen = (currentLocalisation, tracker, mvmtPossibilities) => {
  const boxsAlreadyBeen = [];
  mvmtPossibilities.forEach((mvmtPossibility) => {
    switch (mvmtPossibility) {
      case 'up':
        tracker.forEach((oldMove) => {
          if (oldMove.localisation[0] === (currentLocalisation[0] - 1) && oldMove.localisation[1] === currentLocalisation[1]) {
            boxsAlreadyBeen.push('up')
          }
        })
        break;
      case 'right':
        tracker.forEach((oldMove) => {
          if (oldMove.localisation[0] === currentLocalisation[0] && oldMove.localisation[1] === (currentLocalisation[1] + 1)) {
            boxsAlreadyBeen.push('right')
          }
        })
        break;
      case 'down':
        tracker.forEach((oldMove) => {
          if (oldMove.localisation[0] === (currentLocalisation[0] + 1) && oldMove.localisation[1] === currentLocalisation[1]) {
            boxsAlreadyBeen.push('down')
          }
        })
        break;
      case 'left':
        tracker.forEach((oldMove) => {
          if (oldMove.localisation[0] === currentLocalisation[0] && oldMove.localisation[1] === (currentLocalisation[1] - 1)) {
            boxsAlreadyBeen.push('left')
          }
        })
        break;
      default:
        break;
    }
  })
  return boxsAlreadyBeen;
}

const calculateNewLocalisation = (mvmt, currentLocalisation) => {
  let newLocalisation = [];
  switch (mvmt) {
    case 'up':
      newLocalisation = [(currentLocalisation[0] - 1), currentLocalisation[1]]
      break;
    case 'right':
      newLocalisation = [currentLocalisation[0], (currentLocalisation[1] + 1)]
      break;
    case 'down':
      newLocalisation = [(currentLocalisation[0] + 1), currentLocalisation[1]]
      break;
    case 'left':
      newLocalisation = [currentLocalisation[0], (currentLocalisation[1] - 1)]
      break;
    default:
      break;
  }
  return newLocalisation;
}

// Je construis un nouveau labyrinthe avec le 'o' en plus et le nouveau 2
const moveToNextStep = (bestMvmt) => {
  const oldLabyrinthe = labyrinthe;
  const currentLocalisation = localisation;
  const newLocalisation = calculateNewLocalisation(bestMvmt, currentLocalisation);
  let newLabyrinthe = [];
  let i = 0;
  while (i < oldLabyrinthe.length) {
    let newRaw = '';
    let j = 0;
    if (i === currentLocalisation[0]) {
      if (i === newLocalisation[0]) {
        // if statement for horizontal mvmt
        while (j < oldLabyrinthe[i].length) {
          if (j === currentLocalisation[1]) {
            newRaw += 'o';
          }
          else if (j === newLocalisation[1]) {
            newRaw += '2';
          }
          else {
            newRaw += oldLabyrinthe[i][j]
          }
          j++;
        }
      }
      else {
        while (j < oldLabyrinthe[i].length) {
          newRaw += j === currentLocalisation[1] ? 'o' : oldLabyrinthe[i][j];
          j++;
        }
      }
    }
    else if (i === newLocalisation[0]) {
      // if statement for vertical mvmt
      while (j < oldLabyrinthe[i].length) {
        newRaw += j === newLocalisation[1] ? '2' : oldLabyrinthe[i][j];
        j++;
      }
    }
    if (newRaw === '') {
      newLabyrinthe.push(oldLabyrinthe[i]);
    }
    else {
      newLabyrinthe.push(newRaw);
    }
    i++;
  }
  localisation = newLocalisation;
  labyrinthe = newLabyrinthe;
}

const localisationIsEnd = () => {
  const sameX = localisation[0] === localisationEnd[0];
  const sameY = localisation[1] === localisationEnd[1];
  if (!sameX && !sameY) {
    return false;
  }
  if (sameX) {
    if ((localisationEnd[1] !== localisation[1] - 1) && (localisationEnd[1] !== localisation[1] + 1)) {
      return false;
    }
    else return true;
  }
  if (sameY) {
    if ((localisationEnd[0] !== localisation[0] - 1) && (localisationEnd[0] !== localisation[0] + 1)) {
      return false;
    }
    else return true;
  }
  return false;
}

let backtrackMode = false;

i = 0;
while (!localisationIsEnd(i)) {
  let mvmtPossibilities = findMvmtPossibilities(localisation);
  let bestMvmt = '';
  let mvmtPrios = [];

  if (mvmtPossibilities.length > 1) {
    // Décide quel sont les prios en fonction de la distance.
    let x = {
      boxNb: (localisation[1] - localisationEnd[1]) < 0 ? (localisation[1] - localisationEnd[1]) * -1 : localisation[1] - localisationEnd[1],
      direction: (localisation[1] - localisationEnd[1]) < 0 ? 'right' : 'left',
    }
    let y = {
      boxNb: (localisation[0] - localisationEnd[0]) < 0 ? (localisation[0] - localisationEnd[0]) * -1 : localisation[0] - localisationEnd[0],
      direction: (localisation[0] - localisationEnd[0]) < 0 ? 'down' : 'up',
    }

    // Je définis les mvmtPrios (la direction la plus courte pour allé à l'objectif)
    mvmtPrios = [];
    if (backtrackMode) {
      (x.boxNb >= y.boxNb) ? mvmtPrios.push(y.direction, x.direction) : mvmtPrios.push(x.direction, y.direction);
    }
    else {
      (x.boxNb >= y.boxNb) ? mvmtPrios.push(x.direction, y.direction) : mvmtPrios.push(y.direction, x.direction);
    }

    // Je check les box où je me suis déjà rendu 
    const boxsAlreadyBeen = isBoxsAlreadyBeen(localisation, tracker, mvmtPossibilities);

    // Je définis le bestMvmt 1) Ou je ne suis jamais allé 1)a) la prio direction 1)b) autre direction 2) Les prios 3) Random 
    mvmtPrios.forEach((mvmtPrio) => {
      if (!boxsAlreadyBeen.includes(mvmtPrio) && mvmtPossibilities.includes(mvmtPrio) && bestMvmt === '') {
        bestMvmt = mvmtPrio;
      }
    });

    if (bestMvmt === '') {
      mvmtPossibilities.forEach((mvmtPossibility) => {
        if (!boxsAlreadyBeen.includes(mvmtPossibility) && bestMvmt === '') {
          bestMvmt = mvmtPossibility;
        }
      });
    }
    if (bestMvmt === '') {
      bestMvmt = mvmtPossibilities[Math.floor(Math.random() * mvmtPossibilities.length)]
    }
  }
  else {
    bestMvmt = mvmtPossibilities[0];
  }

  // Retour en arriere si nos mvmt possible ne sont pas des prio
  // Retour en arriere au moment ou on avait 2 mvmt possible et qui était 2 prio
  let backtrack = true;
  mvmtPossibilities.forEach((mvmtPossibility) => {
    if (mvmtPrios.includes(mvmtPossibility)) {
      backtrack = false;
    }
  })
  
  if (backtrack && mvmtPossibilities.length >= 2) {
    let backtrackStep = {};
    // Trouve le dernier mouvement avec 2 possibilité dans le tracker

    let k = tracker.length - 1;
    while (tracker[k].backtrackPossible === false) {
      k--;
    }
    backtrackStep = tracker[k];
    // Modifier le tracker en retirant les tracks entre la track actuelle et la backtrackStep
    let newTracker = [];
    k = 0;
    while (tracker[k] !== backtrackStep) {
      newTracker.push(tracker[k]);
      k++;
    }

    tracker = newTracker;
    localisation = backtrackStep.localisation;
    backtrackMode = true;
    i = backtrackStep.id + 1;
  }
  else {
    let backtrackPossible = false;
    if (mvmtPossibilities.includes(mvmtPrios[0]) && mvmtPossibilities.includes(mvmtPrios[1])) {
      backtrackPossible = true;
    }

    tracker.push({ id: i, localisation: localisation, backtrackPossible });
    moveToNextStep(bestMvmt);
    backtrackMode = false;
    i++;
  }
}

// Je clean le labyrinthe car le backtrack ajoute un 2 au moment du backtrack au lieu d'un 'o'
const cleanLabyrinthe = (labyrinthe, localisation) => {
  let i = 0;

  while (i < labyrinthe.length) {
    let newLine = '';
    let j = 0;
    while (j < labyrinthe[i].length) {
      if ((i !== localisation[0] || j !== localisation[1]) && labyrinthe[i][j] === '2') {
        newLine += 'o';
      }
      else {
        newLine += labyrinthe[i][j];
      }
      j++;
    }
    console.log(newLine)
    i++;
  }
}

cleanLabyrinthe(labyrinthe, localisation)
console.log(`=> SORTIE ATTEINTE EN ${i} COUPS !`)