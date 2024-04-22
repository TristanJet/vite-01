import { useState, useEffect } from "react";

export function Timer({ gameState }) {
  const [runningValue, setRunningValue] = useState(0);

  useEffect(() => {
    let interval;

    if (gameState) {
      interval = setInterval(() => {
        setRunningValue(runningValue => runningValue + 1);
      }, 1000);
    } else {
      clearInterval(interval)
      setRunningValue(0)
    }


    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [gameState]); // Empty dependency array means this effect runs only once on mount

  return (
    <div className="timer-container">
      <div className="running">{runningValue}</div>
      <div className="last">(0.0)</div>
    </div>
  );
}