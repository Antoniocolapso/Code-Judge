import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('py');
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = async () => {
    const payload = {
      language: language,
      code: code
    };

    try {
      const { data } = await axios.post('http://localhost:5000/run', payload);
      console.log(data);
      setOutput(data.output);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
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
        <textarea
          rows="20"
          cols="75"
          className={`textarea ${darkMode ? 'dark-mode' : ''}`}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        ></textarea>
        <button onClick={handleSubmit}>Submit</button>
        <p className={darkMode ? 'dark-mode' : ''}>{output}</p>
        <button onClick={handleDarkModeToggle}>
          Toggle Dark Mode
        </button>
      </div>
    </>
  );
}

export default App;
