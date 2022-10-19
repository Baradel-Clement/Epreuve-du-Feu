// Appel globalOperators pour effectuer le calcul
const globalOperators = {
  '+': (x, y) => x + y,
  '-': (x, y) => x - y,
  '*': (x, y) => Math.round(x * y),
  '/': (x, y) => Math.round(x / y),
  '%': (x, y) => Math.round(x % y),
}
const globalPriorities = ['*', '/', '%'];

const doOperation = (operation) => {
  let operationComplete = [];
  let i = 0;
  let priorities = false;
  // Je check si il y'a des priorités
  globalPriorities.forEach((priority) => operation.includes(priority) ? priorities = true : false);

  if (priorities) {
    while (i < operation.length) {
      let operator = '';
      let number1 = [];  
      let number2 = [];

      // Je boucle jusqu'à arriver à l'opérateur et je stocke la variable numéro1 et numéro2
      if (operation[i] === '*' || operation[i] === '/' || operation[i] === '%') {
        operator = operation[i];
        let j = i;
        while (j !== -1 && (operation[j - 2] !== ' ' && operation[j - 2] !== undefined)) {
          number1.unshift(operation[j - 2]);
          j -= 1;
        }
        j = i;
        while (j < operation.length && (operation[j + 2] !== undefined && operation[j + 2] !== ' ')) {
          number2.push(operation[j + 2]);
          j += 1;
        }

        // Je finis la fonction en renvoyant l'operation de base et le resultat dans un objet. 
        operationComplete.push({
          operation: `${number1.join('')} ${operator} ${number2.join('')}`,
          result : (globalOperators[operator](parseInt(number1.join('')), parseInt(number2.join('')))).toString()
        });

      }
      i += 1;
    }
  }
  else {
    let tempOperation = operation;
    let i = 0;

    while (tempOperation.includes(' ') && i < tempOperation.length) {
      if (tempOperation.includes(' ')) {
        let operator = '';
        let number1 = [];  
        let number2 = [];
  
        if (tempOperation[i] === '+' || tempOperation[i] === '-') {
          operator = tempOperation[i];
          let j = i;
          while (j !== -1 && (tempOperation[j - 2] !== ' ' && tempOperation[j - 2] !== undefined)) {
            number1.unshift(tempOperation[j - 2]);
            j -= 1;
          }
          j = i;
          while (j < tempOperation.length && (tempOperation[j + 2] !== undefined && tempOperation[j + 2] !== ' ')) {
            number2.push(tempOperation[j + 2]);
            j += 1;
          }
  
          let result = (globalOperators[operator](parseInt(number1.join('')), parseInt(number2.join('')))).toString();
          tempOperation = tempOperation.replace(`${number1.join('')} ${operator} ${number2.join('')}`, result);
          i = 0;
        }
      }

      i += 1;
    }
    return [{operation, result: tempOperation}];
  }
  return operationComplete;

}

const developParenthese = (operation) => {
  let cleanOperation = operation[0] === '(' ? operation.substring(1, operation.length - 1) : operation; // J'enleve les parentheses de la string
  let operationComplete = doOperation(cleanOperation);
  operationComplete.forEach((opCompl) => {
    cleanOperation = cleanOperation.replace(opCompl.operation, opCompl.result)
  })
  operationComplete = doOperation(cleanOperation);

  return operationComplete;
}

if (process.argv[2] && process.argv.length < 4) {
  let stringOperation = process.argv[2];
  let parentheses = [];
  let i = 0;


  // J'identifie les parentheses
  while (i < stringOperation.length) {
    let newParenthesesIndex = [];
    if (stringOperation[i] === '(') {
      newParenthesesIndex.push(i);
      i += 1;
      while (stringOperation[i] !== ')') {
        i += 1;
      }
      newParenthesesIndex.push(i + 1);
      const parenthese = stringOperation.substring(newParenthesesIndex[0], newParenthesesIndex[1]);
      parentheses.push(parenthese);
    }
    else {
      i += 1;
    }
  }

  // Je développe les parentheses
  parentheses.forEach((parenthese) => {
    const developedParenthese = developParenthese(parenthese);
    stringOperation = stringOperation.replace(parenthese, developedParenthese[0].result);
  })
  
  while (stringOperation.includes('*') || stringOperation.includes('/') || stringOperation.includes('%')) {
    let operationCompleted = doOperation(stringOperation);
    // Tant que mon operation comporte des priorité je calcule les priorités 
    operationCompleted.forEach((opCompl) => {
      if (stringOperation.includes(opCompl.operation)) {
        // Double check espace : Example : 4 + 21 * 3 * 38 --> 4 + 63 * 38 | De base mon algo voudra faire 3 * 38 alors qu'il faut faire 63 * 38 sauf qu'il va quand m^me le faire car c'est écrit "3 * 38"
        let index = [stringOperation.indexOf(opCompl.operation), (stringOperation.indexOf(opCompl.operation) + opCompl.operation.length)]
        let letterBeforeOperation = [stringOperation[index[0] - 1], stringOperation[index[1]]]
        let doubleCheck = true;

        letterBeforeOperation.forEach((letter) => {
          if (letter !== ' ' && letter !== undefined) {
            doubleCheck = false;
          }
        })
        if (doubleCheck) {
          stringOperation = stringOperation.replace(opCompl.operation, opCompl.result);
        }
      }
    });
  }
  // Il n'y a plus de priorité je finis l'operation et j'affiche
  console.log('Operation finished, result:' + doOperation(stringOperation)[0].result)
}
else {
  console.log('erreur.')
}