const { spawn,exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const outputPath = path.join(__dirname, 'outputs');

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCPP = (filePath, input) => {
  const jobId = path.basename(filePath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.exe`);

  return new Promise((resolve, reject) => {
    // Compile the C++ code
    const compileProcess = spawn('g++', [filePath, '-o', outPath]);

    compileProcess.on('error', (err) => {
      console.error(err);
      reject(err);
    });

    compileProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Compilation failed with code ${code}`);
        reject(new Error(`Compilation failed with code ${code}`));
      } else {
        // Execute the compiled C++ program
        const runProcess = spawn(outPath);

        let output = '';

        // Pass the input to the running process
        if (input) {
          runProcess.stdin.write(input);
          runProcess.stdin.end();
        }

        // Collect the output from the running process
        runProcess.stdout.on('data', (data) => {
          output += data.toString();
        });

        runProcess.stderr.on('data', (data) => {
          console.error(data.toString());
        });

        runProcess.on('error', (err) => {
          console.error(err);
          reject(err);
        });

        runProcess.on('close', (code) => {
          if (code !== 0) {
            console.error(`Execution failed with code ${code}`);
            reject(new Error(`Execution failed with code ${code}`));
          } else {
            resolve(output);
          }
        });
      }
    });
  });
};

const executeCPPStdin = (code, input) => {
  return new Promise((resolve, reject) => {
    const proc = exec('g++ -xc++ -o a.out -', (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        reject({ error, stderr });
      } else {
        const proc2 = exec(`echo "${input}" | ./a.out`, (error, stdout, stderr) => {
          if (error) {
            console.log(error);
            reject({ error, stderr });
          } else {
            resolve(stdout);
          }
        });
        proc2.stdin.write(code);
        proc2.stdin.end();
      }
    });
    proc.stdin.write(code);
    proc.stdin.end();
  });
};

module.exports = {
  executeCPP,
  executeCPPStdin, 
};
