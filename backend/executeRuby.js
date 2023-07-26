const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const executeRuby = (filePath) => {
  return new Promise((resolve, reject) => {
    exec(`ruby "${filePath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(error);
        reject({ error, stderr });
      } else {
        resolve(stdout);
      }
    });
  });
};

module.exports = {
  executeRuby,
};
