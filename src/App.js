import "./App.css";
import { useState } from "react";
import Button from "./Button";

const buttons = [
  "AC",
  "+/-",
  "%",
  "÷",
  "7",
  "8",
  "9",
  "x",
  "4",
  "5",
  "6",
  "-",
  "1",
  "2",
  "3",
  "+",
  "0",
  ".",
  "=",
];

function App() {
  const [calcBuffer, setCalcBuffer] = useState("0");
  const [operator, setOperator] = useState(null);
  const [currentInput, setCurrentInput] = useState("0");
  const [result, setResult] = useState(null);

  function handleClick(value) {
    if (!isNaN(value) || value === ".") {
      handleDigit(value);
    } else {
      handleOperator(value);
    }
  }

  function handleDigit(digit) {
    if (digit === "." && currentInput.includes(".")) return;

    setCurrentInput((prev) => {
      if (prev === "0" && digit !== ".") return digit;
      return prev + digit;
    });
    setCalcBuffer((prev) => (prev === "0" ? digit : prev + digit));
  }

  function handleOperator(value) {
    switch (value) {
      case "AC":
        setCalcBuffer("0");
        setCurrentInput("0");
        setOperator(null);
        setResult(null);
        break;
      case "+/-":
        setCurrentInput((prev) => {
          const negated = String(-parseFloat(prev));
          setCalcBuffer(
            (prevBuffer) => prevBuffer.slice(0, -prev.length) + negated
          );
          return negated;
        });
        break;
      case "%":
        if (currentInput !== "0") {
          const percentValue = String(parseFloat(currentInput) / 100);
          setCurrentInput(percentValue);
          setCalcBuffer(
            (prev) => prev.slice(0, -currentInput.length) + percentValue
          );
        }
        break;
      case "=":
        calculateResult();
        break;
      default:
        handleArithmeticOperator(value);
        break;
    }
  }

  function handleArithmeticOperator(nextOperator) {
    if (operator && currentInput === "") {
      setCalcBuffer((prev) => prev.slice(0, -1) + nextOperator);
      setOperator(nextOperator);
      return;
    }
    if (result === null) {
      setResult(parseFloat(currentInput));
    } else {
      calculateResult();
    }
    setOperator(nextOperator);
    setCalcBuffer((prev) => prev + nextOperator);
    setCurrentInput("");
  }

  function calculateResult() {
    if (operator && currentInput) {
      const prevValue = result === null ? parseFloat(currentInput) : result;
      const currValue = parseFloat(currentInput);
      let finalResult;

      switch (operator) {
        case "+":
          finalResult = prevValue + currValue;
          break;
        case "-":
          finalResult = prevValue - currValue;
          break;
        case "x":
          finalResult = prevValue * currValue;
          break;
        case "÷":
          if (currValue === 0) {
            finalResult = "Error";
          } else {
            finalResult = prevValue / currValue;
          }
          break;
        default:
          return;
      }

      setResult(finalResult);
      setCalcBuffer(String(finalResult));
      setCurrentInput("");
      setOperator(null);
    }
  }

  return (
    <div className="App">
      <div>
        <header className="App-header">
          <h1>Calculator</h1>
        </header>
      </div>
      <main className="calculator">
        <div className="display">{calcBuffer}</div>
        <div className="keypad">
          {buttons.map((button, index) => (
            <Button
              key={index}
              label={button}
              handleClick={() => handleClick(button)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
