import { useEffect, useState, useRef } from "react";

export function QuoteDisplay({ quote = [], quoteSelected, setQuoteSelectTrue, send, gameState, startGameState, clearGameState }) {
  const [inputState, setInputState] = useState([]);
  const inputLength = useRef(0);
  const sendQueueRef = useRef([]);
  const delNum = useRef(1);

  useEffect(() => {
    if (!gameState) {
      setInputState([]);
      inputLength.current = 0;
    }
  }, [gameState]);

  useEffect(() => { 
    /* Upon send connection, adds listener to keydown, which increase input state and adds to send queue.*/
    const handleKeyDown = (event) => {
      const charRegex = /[a-z0-9]/i;
      const specialKeys = [" ", ".", ",", "?"];

      if (event.key === "Backspace") {
        if (inputLength.current === 0) {
          return;
        }
        setInputState((prevInputState) => prevInputState.slice(0, -1));
        inputLength.current -= 1;
        /**The following logic is only for communicating DEL messages to server */
        if (delNum.current > 1) {
          try {
            sendQueueRef.current[sendQueueRef.current.length - 1].num =
              delNum.current;
            delNum.current += 1;
          } catch {
            delNum.current = 1;
            sendQueueRef.current.push({ cmd: "DEL", num: delNum.current });
          }
        } else {
          sendQueueRef.current.push({ cmd: "DEL", num: delNum.current });
          delNum.current += 1;
        }
        if (inputLength.current === 0) {
          clearGameState();
        }
      /** */
      } else if (
        (event.key.length === 1 && charRegex.test(event.key)) ||
        specialKeys.includes(event.key)
      ) {
        if (inputLength.current === quote.length) {
          return;
        }
        if (!gameState) {
          startGameState()
        }
        setInputState((prevInputState) => [...prevInputState, event.key]);
        inputLength.current += 1;
        sendQueueRef.current.push({ cmd: "ADD", val: event.key });
        delNum.current = 1;
      }
    };

    const sendInputs = () => {
      if (sendQueueRef.current.length > 0) {
        console.log(sendQueueRef.current);
        send(JSON.stringify({ commands: sendQueueRef.current }));
        sendQueueRef.current = []; // Clear the queue
      }
    };

    // Set up interval to send inputs every 0.1 seconds
    let sendInterval;
    if (quoteSelected) {
      console.log("adding event listeners")
      window.addEventListener("keydown", handleKeyDown);
      sendInterval = setInterval(sendInputs, 100);
    } else {
      clearGameState()
      window.removeEventListener("keydown", handleKeyDown);
      if (sendInterval) {
        clearInterval(sendInterval);
      }
    }

    return () => {
      clearGameState()
      clearInterval(sendInterval);
      window.removeEventListener("keydown", handleKeyDown);
    };

  }, [quoteSelected]);

  const correctState = inputState.map((inputChar, index) => {
    if (inputChar === quote[index]) {
      return "correct";
    } else {
      return "incorrect";
    }
  });

  return (
    <div 
    className={quoteSelected ? "quote-display-selected" : "quote-display-unselected"} 
    id="quoteDisplay" 
    onClick={ quoteSelected ? null : setQuoteSelectTrue }
    >
      {inputLength.current === 0 && <div className="typing-cursor"></div>}
      {quote.map((character, index) => (
        <span
          key={index}
          className={
            index < correctState.length ? correctState[index] : "untyped"
          }
        >
          {character}
          {index === inputLength.current - 1 && (
            <div className="typing-cursor"></div>
          )}
        </span>
      ))}
    </div>
  );
}
