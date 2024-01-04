import { useEffect, useState } from "react";

const quote = "Theory can only take you so far.".split("");

export function QuoteDisplay() {

  const [inputState, setInputState] = useState([]);

  useEffect(() => {
    const charRegex = /[a-z0-9]/i;
    const specialKeys = [" ", ".", ",", "?"];

    const handleKeyDown = (event) => {
      if (event.key === "Backspace") {
        setInputState(prevInputState => prevInputState.slice(0, -1));
      } else if (
        (event.key.length === 1 && charRegex.test(event.key)) ||
        specialKeys.includes(event.key)
      ) {
        setInputState(prevInputState => [...prevInputState, event.key]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const correctState = inputState.map((inputChar, index) => {
    if (inputChar === quote[index]) {
      return "correct";
    } else {
      return "incorrect";
    }
  });

  return (
    <div className="quote-display" id="quoteDisplay">
      {quote.map((character, index) => (
        <span
          key={index}
          className={index < correctState.length ? correctState[index] : "untyped"}
        >
          {character}
        </span>
      ))}
    </div>
  );
}

