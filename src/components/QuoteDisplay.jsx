import { useEffect, useState, useRef } from "react";

const quote = "Theory can only take you so far.".split("");

export function QuoteDisplay({ websocket }) {
  const [inputState, setInputState] = useState([]);
  const sendQueueRef = useRef([]);

  useEffect(() => {
    /* Upon websocket connection, adds listener to keydown, which increase input state and adds to send queue.*/ 
    const charRegex = /[a-z0-9]/i;
    const specialKeys = [" ", ".", ",", "?"];

    const handleKeyDown = (event) => {
      if (event.key === "Backspace") {
        setInputState((prevInputState) => prevInputState.slice(0, -1));
        sendQueueRef.current.push({ cmd: "DEL", num: 1 });
      } else if (
        (event.key.length === 1 && charRegex.test(event.key)) ||
        specialKeys.includes(event.key)
      ) {
        setInputState((prevInputState) => [...prevInputState, event.key]);
        sendQueueRef.current.push({ cmd: "ADD", val: event.key });
      }
    };

    if (websocket) {
      window.addEventListener("keydown", handleKeyDown);
    }

    const sendInputs = () => {
      if (sendQueueRef.current.length > 0) {
        console.log("Sending:", sendQueueRef.current);
        sendQueueRef.current = []; // Clear the queue
      }
    };

    // Set up interval to send inputs every 0.5 seconds
    const sendInterval = setInterval(sendInputs, 500);

    // Set up timeout to stop the process after 2 minutes
    const stopInterval = setTimeout(() => {
      clearInterval(sendInterval);
    }, 120000);

    return () => {
      clearInterval(sendInterval);
      clearTimeout(stopInterval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [websocket]);

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
          className={
            index < correctState.length ? correctState[index] : "untyped"
          }
        >
          {character}
        </span>
      ))}
    </div>
  );
}
