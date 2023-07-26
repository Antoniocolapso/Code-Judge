const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");//creating random id

const dirCode = path.join(__dirname, "codes");

if (!fs.existsSync(dirCode)) {
    fs.mkdirSync(dirCode, { recursive: true });
};

const generateFile = async (format,content) => {
    const jobId = uuid();                  //erghswrtjarhtqaeqa45thjzrj                           //format= file extension
    const fileName = `${jobId}.${format}`;//erghswrtjarhtqaeqa45thjzrj.cpp                        //content= the code itself
    const filePath=path.join(dirCode,fileName);
    // console.log(filePath);
    await fs.writeFileSync(filePath,content);
    return filePath;
};

module.exports = {
    generateFile,
};

