import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import jsPDF from 'jspdf';


function App() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('py');
  const [darkMode, setDarkMode] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [takeInput, setTakeInput] = useState(false);
  const [useStdin, setUseStdin] = useState(false);

  const handleSubmit = async () => {
    const payload = {
      language: language,
      code: code,
      testInput: takeInput ? userInput : '',
      useStdin: !useStdin,
    };

    try {
      const { data } = await axios.post('http://localhost:5000/run', payload);
      setOutput(data.output);
    } catch (error) {
      setOutput(`Runtime Error:\n${error.message}`);
    }
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleCopyCode = () => {
    console.log("copieid the follwing code :", code);
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  //   toast({
  //     title: "Code copied to clipboard!",
  //     description: "",
  //     status: "success",
  //     duration: 4000,
  //     isClosable: true,
  //     position: "bottom",
  //   });
  // };

  const handleSavePDF = () => {
    console.log("Code saved as PDF!")
    const doc = new jsPDF();
    doc.setFont('Courier New');
    doc.setFontSize(12);

    const lines = code.split('\n');
    let yPos = 12;

    lines.forEach((line) => {
      doc.text(10, yPos, line);
      yPos += 12;
    });

    doc.save('Code Written On Antonio"s compiler.pdf');

    toast.success('Code saved as PDF!');
  };
  return (
    <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
      <h1>Antonio Colpaso's Compiler</h1>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="language-select"
      >
        <option value="py">Python</option>
        <option value="cpp">C++</option>
        <option value="rb">Ruby</option>
      </select>
      <br />
      <br />
      <textarea
        rows="20"
        cols="75"
        className={`textarea ${darkMode ? 'dark-mode' : ''}`}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      ></textarea>
      <label className={`checkbox-label ${darkMode ? 'dark-mode' : ''}`}>
        <input
          type="checkbox"
          checked={takeInput}
          onChange={(e) => setTakeInput(e.target.checked)}
        />{' '}
        Take Input
      </label>

      {takeInput  && (
        <>
          <br />
          <label className={`checkbox-label ${darkMode ? 'dark-mode' : ''}`}>
            <input
              type="checkbox"
              checked={useStdin}
              onChange={(e) => setUseStdin(e.target.checked)}
            />{' '}
            Use Command Line Input
          </label>
          <br />
          {useStdin ? (
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Command-line Input"
            />
          ) : (
            <textarea
              rows="5"
              cols="75"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="STDIN"
            />
          )}
        </>
      )}

      <button onClick={handleSubmit}>Run</button>
      <br />
      <button onClick={handleCopyCode}>Copy Code</button>
      <br />
      <button onClick={handleSavePDF}>Save PDF</button>

      <div className={`output-box ${darkMode ? 'dark-mode' : ''}`}>
        <p className="output">{output}</p>
        <br />
      </div>
      <br />
      <button onClick={handleDarkModeToggle}>Toggle Dark Mode</button>
    </div>
  );
}

export default App;
