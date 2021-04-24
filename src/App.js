import React, { useState } from "react";
import { Input, Button } from "@material-ui/core";
import Question from "./Question";

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [numQuestions, setNumQuestions] = useState(10);
  const [numAnswered, setNumAnswered] = useState(0);

  console.log(numQuestions);

  const handleChange = (e) => {
    setNumQuestions(e.target.value);
  };

  const fetchQuestions = () => {
    fetch("https://opentdb.com/api.php?amount=" + numQuestions)
      .then((res) => res.json())
      .then((res) => {
        const questions = res.results.map((question) => {
          let answers;

          if (question.type === "boolean") {
            answers = ["True", "False"];
          } else {
            answers = [...question.incorrect_answers];
            const rand = Math.floor(Math.random() * 3);

            answers.splice(rand, 0, question.correct_answer);
          }

          return { ...question, answers };
        });

        setQuestions(questions);
      });

    setNumAnswered(0);
  };

  if (questions.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Input type="number" value={numQuestions} onChange={handleChange} />
        <Button onClick={fetchQuestions}>Go!</Button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {questions.map((q) => (
        <Question
          question={q}
          setNumAnswered={setNumAnswered}
          key={q.question}
        />
      ))}

      {numAnswered === parseInt(numQuestions) && (
        <Button onClick={fetchQuestions}>Fetch more questions</Button>
      )}
    </div>
  );
}
