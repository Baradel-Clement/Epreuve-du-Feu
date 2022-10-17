if (process.argv[2] && process.argv[3]) {
  let length = parseInt(process.argv[3]);
  let width = parseInt(process.argv[2]);
  if (length === 0 || width === 0) {
    console.log('erreur.')
    return false;
  }
  const unitLength = '|';
  const unitWidth = '-';
  const corner = 'o'

  let firstLastRaw = '';
  if (width === 1) {
    firstLastRaw = `${corner}`;
  }
  else if (width === 2) {
    firstLastRaw = `${corner}${corner}`;
  }
  else {
    let i = 0;
    let newFirstLastRaw = `${corner}`;
    while (i < width - 2) {
      newFirstLastRaw += `${unitWidth}`;
      i += 1;
    }
    newFirstLastRaw += `${corner}`;
    firstLastRaw = newFirstLastRaw;
  }
  console.log(firstLastRaw);
  if (length === 2) {
    console.log(firstLastRaw);
  }
  else if (length > 2) {
    let i = 0;
    let fillRaw = width === 1 ? '' : `${unitLength}`;
    while (i < width - 2) {
      fillRaw += ' ';
      i += 1;
    }
    fillRaw += `${unitLength}`;
    i = 0;
    while (i < length - 2) {
      console.log(fillRaw);
      i += 1;
    }
    console.log(firstLastRaw);
  }
}
else {
  console.log('erreur.')
}