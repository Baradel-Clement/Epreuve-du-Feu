const { readFile } = require("fs");

const callback = (board, toFind) => {
  console.log(board, toFind);
}

const fileRead = (paths) => {
  readFile(path, (error, fileBuffer) => {
    if (error) {
      console.error(error.message);
      process.exit(1);
    }

    const fileContent = fileBuffer.toString();

    console.log(fileContent);

    callback();
  });
};

fileRead("board.txt", () => {
  fileRead("to_find.txt");
});

const boardString = await fileRead("board.txt");
console.log(boardString)