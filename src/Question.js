import React, { useState } from "react";
import he from "he";
import Button from "@material-ui/core/Button";

export default function Question({ question, setNumAnswered }) {
  const [isAnswered, setIsAnswered] = useState(false);

  const handleClick = () => {
    setIsAnswered(true);
    setNumAnswered((prevValue) => {
      console.log(prevValue + 1);

      return prevValue + 1;
    });
  };

  const decideColor = (answer) => {
    if (!isAnswered) return "";

    if (answer === question.correct_answer) return "green";

    return "red";
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>{he.decode(question.question)}</h1>
      <div>
        {question.answers.map((answer) => (
          <Button
            onClick={handleClick}
            variant="contained"
            disabled={isAnswered}
            style={{
              backgroundColor: decideColor(answer),
            }}
            key={answer}
          >
            {he.decode(answer)}
          </Button>
        ))}
      </div>
    </div>
  );
}
