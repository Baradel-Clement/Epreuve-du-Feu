const fs = require('fs');
const labyrinthe = fs.readFileSync("./" + process.argv[2], "utf8").split('\r\n');

console.log(labyrinthe)

// Je localise le  2 
// Je démarre le trajet
// Quelles sont les possibilités de mouvement ?
// Si 1 possibilité il y va
// Si plusieurs possibilités je priorise l'axe (x ou y) le plus loin du résulat
// (Je suis en 4:8 le fin est à 8:0 je vais prioriser Y car plus loin)
// A chaque mouvement je dois stocker l'action dans un historique {XY: 4:6, direction: up, id: 3}


let i = 0;
let localisation = [];
let localisationEnd = [];
while (i < labyrinthe.length) {
  if (labyrinthe[i].indexOf('2') !== -1) {
    localisation = [i, labyrinthe[i].indexOf('2')];
    localisation = [6, 3]
  }
  if (labyrinthe[i].indexOf('1') !== -1) {
    localisationEnd = [i, labyrinthe[i].indexOf('1')];
  }
  i++;
}

const findMvmtPossibilities = (localisation) => {
  const upChar = [labyrinthe[localisation[0] - 1][localisation[1]], 'up'];
  const rightChar = [labyrinthe[localisation[0]][localisation[1] + 1], 'right'];
  const downChar = [labyrinthe[localisation[0] + 1][localisation[1]], 'down'];
  const leftChar = [labyrinthe[localisation[0]][localisation[1] - 1], 'left'];

  const possibilities = []
  const mvmts = [upChar, rightChar, downChar, leftChar]
  mvmts.forEach((direction) => {
    if (direction[0] === ' ') {
      possibilities.push(direction[1]);
    }
  })
  return possibilities;
};

i = 0;
while (i < 1) {
  let mvmtPossibilities = findMvmtPossibilities([6, 3]);
  let bestMvmt = '';
  console.log('mvmtPossibilities   ' + mvmtPossibilities)
  
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
    
    let mvmtPrios = [];
    (x.boxNb >= y.boxNb) ? mvmtPrios.push(x.direction, y.direction) : mvmtPrios.push(y.direction, x.direction);
    console.log('mvmtPrios  ' + mvmtPrios)

    // left est prio 1 et est dispo
    // est ce que je suis déjà allé dans la case à left ?
    // Non ?  alors je vaisà left
    // Oui ? je prends la deuxieme prio ect
    // Je peux pas deuxieme prio alors que je vais a la troisieme possibilité 
    // Je peux pas car déjà allé
    // alors je vais sur la premiere prio meme si je suis déjà allé
  }
  else {
    bestMvmt = mvmtPossibilities[0];
  }

  i++;
}
console.log(localisation)
console.log(localisationEnd)