const fs = require("fs");
function readFiles() {
  const uniqueUsernames = new Set();
  const usernamesInFiles = [];
  for (let i = 0; i < 20; i++) {
    usernamesInFiles[i] = new Set();
    const fileContent = fs.readFileSync(`./out${i}.txt`, "utf8");
    const lines = fileContent.split("\n");
    for (const line of lines) {
      const usernames = line.split(" ");
      for (const username of usernames) {
        uniqueUsernames.add(username);
        usernamesInFiles[i].add(username);
      }
    }
  }
  return { uniqueUsernames, usernamesInFiles };
}
function uniqueValues() {
  const uniqueUsernames = readFiles();
  return uniqueUsernames.uniqueUsernames.size;
}
function existInAll() {
  const usernamesInFiles = readFiles();
  let commonUsernames = new Set(usernamesInFiles.usernamesInFiles[0]);
  for (let i = 1; i < usernamesInFiles.usernamesInFiles.length; i++) {
    commonUsernames = new Set(
      [...commonUsernames].filter((username) =>
        usernamesInFiles.usernamesInFiles[i].has(username),
      ),
    );
  }
  return commonUsernames.size;
}
function existInTen() {
  const usernamesInFiles = readFiles();
  const atLeastTenUsernames = new Set();
  for (const usernames of usernamesInFiles.usernamesInFiles) {
    for (const username of usernames) {
      let count = 0;
      for (const otherUsernames of usernamesInFiles.usernamesInFiles) {
        if (otherUsernames.has(username)) {
          count++;
        }
      }
      if (count >= 10) {
        atLeastTenUsernames.add(username);
      }
    }
  }
  return atLeastTenUsernames.size;
}
console.log(uniqueValues());
console.log(existInAll());
console.log(existInTen());
