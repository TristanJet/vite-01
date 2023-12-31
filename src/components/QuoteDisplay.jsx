import { useEffect, useState } from "react";

export function QuoteDisplay() {
  const quote = "Theory can only take you so far.".split("");

  const [inputState, setInputState] = useState([]);
  const [correctState, setCorrectState] = useState([]);

  useEffect(() => {
    const charRegex = /[a-z0-9]/i;

    const specialKeys = [" ", ".", ",", "?"];

    const handleKeyDown = (event) => {
      if (event.key === "Backspace") {
        setInputState((prevInputState) => prevInputState.slice(0, -1));
      } else if (
        (event.key.length === 1 && charRegex.test(event.key)) ||
        specialKeys.includes(event.key)
      ) {
        setInputState((prevInputState) => [...prevInputState, event.key]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    
    inputState.forEach((inputChar, index) => {
      if (inputChar === quote[index]) {
        setCorrectState((prevCorrectState) => [...prevCorrectState, "correct"]);
      } else {
        setCorrectState((prevCorrectState) => [
          ...prevCorrectState,
          "incorrect",
        ]);
      }
    });
  }, [inputState]);

  return (
    <div className="quote-display" id="quoteDisplay">
      {quote.map((character, index) => (
        <span
          key={index}
          class={correctState[index] ? correctState[index] : "untyped"}
        >
          {character}
        </span>
      ))}
    </div>
  );
}
