import inquirer from "inquirer";
import fs from "fs";

const filePath = "./DB.txt";

addUsers();

async function addUserToDatabase(user) {
  let users = [];

  users = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  users.push(user);
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

function searchUserInDatabase(name) {
  let users = [];
  if (fs.existsSync(filePath)) {
    const existingData = fs.readFileSync(filePath, "utf-8");
    users = JSON.parse(existingData);
  }
  return users.find((user) => user.name.toLowerCase() === name.toLowerCase());
}

function addUsers() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the name (To cancel press ENTER):",
      },
    ])
    .then((answers) => {
      if (!answers.name) {
        searchUser();
      } else {
        inquirer
          .prompt([
            {
              type: "list",
              name: "gender",
              message: "Choose a gender:",
              choices: ["Male", "Female"],
            },
            {
              type: "input",
              name: "age",
              message: "Enter age:",
            },
          ])
          .then((userData) => {
            const user = { name: answers.name, ...userData };

            addUserToDatabase(user);
            console.log(`User "${answers.name}" added to the database.`);
            addUsers();
          });
      }
    });
}

function searchUser() {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "search",
        message: "Do you want to search for a user by name? (Y/N):",
      },
    ])
    .then((searchData) => {
      if (searchData.search) {
        inquirer
          .prompt([
            {
              type: "input",
              name: "searchName",
              message: "Search for a user by name:",
            },
          ])
          .then((searchData) => {
            const foundUser = searchUserInDatabase(searchData.searchName);
            if (foundUser) {
              console.log(`User found: ${JSON.stringify(foundUser, null, 2)}`);
            } else {
              console.log("User not found in the database.");
            }
            process.exit();
          });
      } else {
        process.exit();
      }
    });
}
