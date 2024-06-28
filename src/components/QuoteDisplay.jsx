import { useEffect, useState, useRef } from "react";

export function QuoteDisplay({
  quote,
  quoteSelected,
  setQuoteSelectTrue,
  send,
  gameState,
  startGameState,
  clearGameState,
}) {
  const [inputState, setInputState] = useState([]);
  const inputLength = useRef(0);
  const sendQueueRef = useRef([]);
  const delNum = useRef(1);
  const cursorRef = useRef(0);

  const quoteChars = quote.split("");
  const quoteWords = quote.split(" ");

  useEffect(() => {
    if (!gameState) {
      setInputState([]);
      inputLength.current = 0;
    }
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const charRegex = /[a-z0-9]/i;
      const specialKeys = [" ", ".", ",", "?"];

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
        if (inputLength.current === 0) {
          clearGameState();
        }
      } else if (
        (event.key.length === 1 && charRegex.test(event.key)) ||
        specialKeys.includes(event.key)
      ) {
        if (inputLength.current === quoteChars.length) {
          return;
        }
        if (!gameState) {
          startGameState();
        }
        setInputState((prevInputState) => [...prevInputState, event.key]);
        inputLength.current += 1;
        sendQueueRef.current.push({ cmd: "ADD", val: event.key });
        delNum.current = 1;
      }
    };

    const sendInputs = () => {
      if (sendQueueRef.current.length > 0) {
        //console.log(sendQueueRef.current);
        send(JSON.stringify({ commands: sendQueueRef.current }));
        sendQueueRef.current = []; // Clear the queue
      }
    };

    let sendInterval;
    if (quoteSelected) {
      window.addEventListener("keydown", handleKeyDown);
      sendInterval = setInterval(sendInputs, 100);
    } else {
      clearGameState();
      window.removeEventListener("keydown", handleKeyDown);
      if (sendInterval) {
        clearInterval(sendInterval);
      }
    }

    return () => {
      clearGameState();
      clearInterval(sendInterval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [quoteSelected]);

  useEffect(() => {
    if (cursorRef.current) {
      const typedChars = document.querySelectorAll(".typed");
      console.log(typedChars);
      if (typedChars.length > 0) {
        const lastTypedChar = typedChars[typedChars.length - 1];
        cursorRef.current.style.left = `${lastTypedChar.offsetLeft + lastTypedChar.offsetWidth}px`;
        cursorRef.current.style.top = `${lastTypedChar.offsetTop}px`;
      } else {
        // Set initial position at the beginning of the first word
        const firstWord = document.querySelector(".word");
        if (firstWord) {
          const firstChar = firstWord.firstChild;
          if (firstChar) {
            cursorRef.current.style.left = `${firstChar.offsetLeft}px`;
            cursorRef.current.style.top = `${firstChar.offsetTop}px`;
          }
        }
      }
    }
  }, [quote, inputState]);

  const correctState = inputState.map((inputChar, index) => {
    if (inputChar === quoteChars[index]) {
      return "correct";
    } else {
      return "incorrect";
    }
  });

  return (
    <div
      className={
        quoteSelected ? "quote-display-selected" : "quote-display-unselected"
      }
      id="quoteDisplay"
      onClick={quoteSelected ? null : setQuoteSelectTrue}
    >
      <div className="quote-container">
        {quoteWords.map((word, wordIndex) => (
          <span key={wordIndex} className="word">
            {word.split("").map((character, charIndex) => {
              const overallIndex =
                quoteWords
                  .slice(0, wordIndex)
                  .reduce((acc, w) => acc + w.length + 1, 0) + charIndex;
              return (
                <span
                  key={charIndex}
                  className={
                    overallIndex < correctState.length
                      ? `${correctState[overallIndex]} typed`
                      : "untyped"
                  }
                >
                  {character}
                </span>
              );
            })}
            {wordIndex < quoteWords.length - 1 && (
              <span
                className={
                  quoteWords
                    .slice(0, wordIndex + 1)
                    .reduce((acc, w) => acc + w.length + 1, -1) <
                  correctState.length
                    ? "typed"
                    : ""
                }
              >
                &nbsp;
              </span>
            )}
          </span>
        ))}
        <span
          ref={cursorRef}
          className={
            inputLength.current === 0 ? "typing-cursor-blink" : "typing-cursor"
          }
        ></span>
      </div>
      <span className="reconnect-text">Click to reconnect</span>
    </div>
  );
}
