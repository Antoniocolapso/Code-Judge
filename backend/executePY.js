const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { v4: uuid } = require("uuid");
const { error } = require("console");

const outputPath = path.join(__dirname, "outputs");
const inputPath = path.join(__dirname, "codes","WI");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

if (!fs.existsSync(inputPath)) {
  fs.mkdirSync(inputPath, { recursive: true });
}

const executePY = (filePath) => {
  const jobId = path.basename(filePath).split(".")[0];
  return new Promise((resolve, reject) => {
    exec(
      `python -u "${filePath}"`,
      (error, stdout, stderr) => {
        if (error) {
          if (error.code==1){
            resolve("Runtime Error");
          }
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

const executePYStdin = (code, input) => {
  return new Promise((resolve, reject) => {
    const jobId = uuid();
    const filePath = path.join(inputPath, `${jobId}.py`);
    fs.writeFile(filePath, code, (err) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        const pythonProcess = exec(`python -u "${filePath}"`, (error, stdout, stderr) => {
          if (error) {
            if (error.code==1){
              resolve("Runtime Error");
            }
            console.error(error);
            reject({ error, stderr });
          } else {
            resolve(stdout);
          }
        });
        pythonProcess.stdin.write(input);
        pythonProcess.stdin.end();
      }
    });
  });
};

module.exports = {
  executePY,
  executePYStdin,
};
