const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

input();

function input() {
  rl.question(
    "Hello. Enter 10 words or digits deviding them in spaces. ",
    (str) => {
      if (str.toLowerCase() === "exit") {
        console.log("Good bye! Come back again!");
        rl.close();
      } else {
        const array = str.split(" ");
        const newArray = array.map((el) => {
          if (!isNaN(el)) {
            return parseFloat(el);
          }
          return el;
        });
        rl.question(
          "How would you like to sort valuses?:\n\
      1.Sort words alphabetically\n\
      2.Show numbers from lesser to greater\n\
      3.Show numbers from bigger to smaller\n\
      4.Show words in ascending order by number of letters in the word\n\
      5.Show only unique words\n\
      6.Show only unique values\n\
      Select (1 - 6) and press ENTER: ",
          (num) => {
            sorting(newArray, num);
            if (str === "exit") {
              rl.close();
            } else {
              input();
            }
          }
        );
      }
    }
  );
}

function sorting(array, num) {
  const arrayOfStrings = array.filter((el) => typeof el === "string");

  switch (num) {
    case "1":
      console.log(array.filter((el) => typeof el === "string").sort());
      break;

    case "2":
      console.log(
        array.filter((el) => typeof el === "number").sort((a, b) => a - b)
      );
      break;

    case "3":
      console.log(
        array.filter((el) => typeof el === "number").sort((a, b) => b - a)
      );
      break;

    case "4":
      console.log(arrayOfStrings.sort((a, b) => a.length - b.length));
      break;

    case "5":
      const uniqueWords = [];
      for (const value of arrayOfStrings) {
        if (!uniqueWords.includes(value)) {
          uniqueWords.push(value);
        }
      }
      console.log(uniqueWords);
      break;

    case "6":
      const uniqueValue = [];
      for (const value of array) {
        if (!uniqueValue.includes(value)) {
          uniqueValue.push(value);
        }
      }
      console.log(uniqueValue);
      break;
  }
}
