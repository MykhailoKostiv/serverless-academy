const axios = require("axios");

const ENDPOINTS = [
  "https://jsonbase.com/sls-team/json-793",
  "https://jsonbase.com/sls-team/json-955",
  "https://jsonbase.com/sls-team/json-231",
  "https://jsonbase.com/sls-team/json-931",
  "https://jsonbase.com/sls-team/json-93",
  "https://jsonbase.com/sls-team/json-342",
  "https://jsonbase.com/sls-team/json-770",
  "https://jsonbase.com/sls-team/json-491",
  "https://jsonbase.com/sls-team/json-281",
  "https://jsonbase.com/sls-team/json-718",
  "https://jsonbase.com/sls-team/json-310",
  "https://jsonbase.com/sls-team/json-806",
  "https://jsonbase.com/sls-team/json-469",
  "https://jsonbase.com/sls-team/json-258",
  "https://jsonbase.com/sls-team/json-516",
  "https://jsonbase.com/sls-team/json-79",
  "https://jsonbase.com/sls-team/json-706",
  "https://jsonbase.com/sls-team/json-521",
  "https://jsonbase.com/sls-team/json-350",
  "https://jsonbase.com/sls-team/json-64",
];

async function getRequest(url) {
  for (let i = 0; i <= 3; i++) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      if (i === 3) {
        throw error;
      }
    }
  }
}

function findIsDone(data) {
  if (typeof data === "object") {
    if ("isDone" in data) {
      return data.isDone;
    } else {
      for (const key in data) {
        const result = findIsDone(data[key]);
        if (result !== null) {
          return result;
        }
      }
    }
  }
}

async function processEndpoint(url) {
  try {
    const data = await getRequest(url);
    if (data) {
      const isDone = findIsDone(data);
      console.log(`[Success] ${url}  isDone - ${isDone}`);
      return isDone;
    }
  } catch (error) {
    console.log(`[Fail] ${url}  The endpoint is unavailable`);
  }
}

async function dataAndCountResults() {
  let trueCount = 0;
  let falseCount = 0;

  for (const endpoint of ENDPOINTS) {
    const isDone = await processEndpoint(endpoint);
    if (isDone === true) {
      trueCount++;
    } else if (isDone === false) {
      falseCount++;
    }
  }

  console.log(`Found True values: ${trueCount}`);
  console.log(`Found False values: ${falseCount}`);
}

dataAndCountResults();
