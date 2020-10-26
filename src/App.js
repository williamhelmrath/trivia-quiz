import React, { useState, useEffect } from "react";
import "./App.css";
import { Grid, Paper, Button } from "@material-ui/core";

let he = require("he");

export default function App() {
  const [data, setData] = useState(null);
  const [numQuestions, setNumQuestions] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [permNumQuestions, setPermNumQuestions] = useState(0);

  const handleChange = (value) => {
    if (value) setNumQuestions(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (numQuestions > 50 || numQuestions < 1)
      alert("Please choose a value between 1 and 50.");
    else {
      setPermNumQuestions(numQuestions);
      setSubmitted(true);
    }
  };

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=" + permNumQuestions)
      .then((res) => res.json())
      .then((res) => {
        const questions = res.results;
        setData(questions);
      });
  }, [permNumQuestions]);

  if (!submitted) {
    return (
      <div className="App">
        <form onSubmit={handleSubmit} style={{ padding: "2vh" }}>
          <label style={{ fontSize: "3vh" }} htmlFor="numQ">
            Number of Questions:
          </label>
          <br />
          <input
            type="number"
            id="numQ"
            name="numQ"
            onChange={(e) => handleChange(e.target.value)}
          />
          <br />
        </form>
      </div>
    );
  }

  return (
    <div className="App">
      {data.map((question) => (
        <Question
          key={question.question}
          questionText={question.question}
          answers={question.incorrect_answers}
          correctAnswer={question.correct_answer}
          difficulty={question.difficulty}
        />
      ))}
    </div>
  );
}

function Question({ questionText, answers, correctAnswer, difficulty }) {
  const [bgColor, setBgColor] = useState(null);

  //Color palette from https://www.color-hex.com/color-palette/88277
  useEffect(() => {
    switch (difficulty) {
      case "easy":
        setBgColor("#8ca405");
        break;
      case "medium":
        setBgColor("#f3b900");
        break;
      default:
        setBgColor("#bd3100");
    }

    const rand = Math.floor(Math.random() * 3);
    answers.splice(rand, 0, correctAnswer);
  }, [difficulty, correctAnswer, answers]);

  return (
    <div className="Question">
      <Paper
        style={{
          backgroundColor: bgColor,
          color: "white",
          padding: "2vh",
          fontSize: "150%",
        }}
      >
        {he.decode(questionText)}
      </Paper>
      <Grid container spacing={1}>
        {answers.map((answer) => (
          <Grid item xs={6} key={answer}>
            {" "}
            <AnswerButton
              isCorrect={answer === correctAnswer}
              answerText={he.decode(answer)}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

function AnswerButton({ isCorrect, answerText }) {
  const [textColor, setTextColor] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const handleClick = () => {
    isCorrect ? setTextColor("green") : setTextColor("red");
    setDisabled(true);
  };

  return (
    <div className="Answer">
      <Button
        variant="contained"
        style={{ color: textColor, padding: "2vh", fontSize: "100%" }}
        onClick={handleClick}
        disabled={disabled}
      >
        {answerText}
      </Button>
    </div>
  );
}
