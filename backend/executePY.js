const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { v4: uuid } = require("uuid");
const { error } = require("console");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executePY = (filePath) => {
    const jobId = path.basename(filePath).split(".")[0];
    return new Promise((resolve, reject) => {
      exec(
        `python -u "${filePath}"`,
        (error, stdout, stderr) => {
          if (error) {
            reject({ error, stderr });
          } else {
            resolve(stdout);
          }
        }
      );
    }).catch((error) => {
      throw new Error(JSON.stringify(error));
    });
  };
  
  

module.exports = {
  executePY,
};
