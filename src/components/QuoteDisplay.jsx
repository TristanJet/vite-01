import { useEffect, useState } from "react";

export function QuoteDisplay() {
  const quote = "Theory can only take you so far.";

  const [inputState, setInputState] = useState([]);

  useEffect(() => {

    const charRegex = /[a-z0-9]/i;

    const specialKeys = ["Backspace", " ", ".", ",", "?"];

    const handleKeyDown = (event) => {
      if ((event.key.length === 1 && charRegex.test(event.key)) || specialKeys.includes(event.key)) {
        setInputState((prevInputState) => [...prevInputState, event.key]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    console.log(inputState);
  }, [inputState]);

  return (
    <div className="quote-display" id="quoteDisplay">
      {quote.split("").map((character, index) => (
        <span key={index}>{character}</span>
      ))}
    </div>
  );
}
