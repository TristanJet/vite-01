import { useEffect, useState, useRef } from "react";

const quote = "Theory can only take you so far.".split("");

export function QuoteDisplay({ websocket, gameState, clearGameState }) {
  const [inputState, setInputState] = useState([]);
  const inputLength = useRef(0);
  const sendQueueRef = useRef([]);
  const delNum = useRef(1);

  useEffect(() => {
    if (gameState === 1) {
      setInputState([])
      inputLength.current = 0
    }
    clearGameState()
  }, [gameState])

  useEffect(() => {
    /* Upon websocket connection, adds listener to keydown, which increase input state and adds to send queue.*/
    const charRegex = /[a-z0-9]/i;
    const specialKeys = [" ", ".", ",", "?"];

    const handleKeyDown = (event) => {
      if (event.key === "Backspace") {
        if (inputLength.current === 0) {
          return;
        }
        setInputState((prevInputState) => prevInputState.slice(0, -1));
        inputLength.current -= 1;
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
      } else if (
        (event.key.length === 1 && charRegex.test(event.key)) ||
        specialKeys.includes(event.key)
      ) {
        if (inputLength.current === quote.length) {
          return;
        }
        setInputState((prevInputState) => [...prevInputState, event.key]);
        inputLength.current += 1;
        sendQueueRef.current.push({ cmd: "ADD", val: event.key });
        delNum.current = 1;
      }
    };

    if (websocket) {
      window.addEventListener("keydown", handleKeyDown);
    }

    const sendInputs = () => {
      if (sendQueueRef.current.length > 0) {
        console.log(sendQueueRef.current);
        websocket.send(JSON.stringify({ commands: sendQueueRef.current }));
        sendQueueRef.current = []; // Clear the queue
      }
    };

    // Set up interval to send inputs every 0.1 seconds
    const sendInterval = setInterval(sendInputs, 100);

    return () => {
      clearInterval(sendInterval);
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
      <div className="typing-cursor"></div>
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
