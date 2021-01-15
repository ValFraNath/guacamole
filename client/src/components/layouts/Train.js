import React, { Component } from "react";
import axios from "axios";
import PropTypes from "proptypes";
import { ArrowRightIcon } from "@modulz/radix-icons";

import Plural from "../Plural";
import Timer from "../quizz/Timer";
import Answers from "../quizz/Answers";
import Message from "../quizz/Message";

const IntroductionView = ({ onClick }) => {
  return (
    <>
      <h1>Mode entraînement</h1>
      <p id="about">Répondez à une série de questions aléatoire.</p>
      <button onClick={onClick}>Lancer l'entraînement</button>
    </>
  );
};

IntroductionView.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const PlayView = () => {
  return (
    <>
      <div id="quiz-score">
        <p id="good-score">
          {result.good} <Plural word="bonne" count={result.good} /> <Plural word="réponse" count={result.good} />
        </p>
        <p id="bad-score">
          {result.bad} <Plural word="mauvaise" count={result.bad} /> <Plural word="réponse" count={result.bad} />
        </p>
      </div>

      <div id="quiz-question">
        <h2>Question {result.good + result.bad + 1}</h2>
        <h1>{this.generateQuestionText()}</h1>
      </div>

      {inProgress ? (
        <Timer inProgress={inProgress} duration={timer} updateParent={this.updateTimer} />
      ) : (
        <div id="next-btn">
          <button onClick={this.getNewQuestion}>
            Question suivante
            <ArrowRightIcon />
          </button>
        </div>
      )}

      <Answers
        inProgress={inProgress}
        goodAnswer={question.goodAnswer}
        badAnswers={question.badAnswers}
        lastClicked={lastClicked}
        onClick={this.handleAnswerClick}
      />
    </>
  );
};

const SummuryView = () => {
  return (
    <>
      <p>Fin !</p>
    </>
  );
};

const SwitchView = ({ toDisplay, props }) => {
  switch (toDisplay) {
    case Train.STATE_INTRO:
      return <IntroductionView />;
    case Train.STATE_PLAY:
      return <PlayView />;
    case Train.STATE_SUMMURY:
      return <SummuryView />;
    default:
      return "Error";
  }
};

class Train extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameState: Train.STATE_INTRO,
      question: {},
      inProgress: false,
      lastClicked: "",
      timer: 10,
      result: { good: 0, bad: 0 },
      error: null,
    };
  }

  /**
   * Get a new question (random type) from the server
   */
  getNewQuestion = () => {
    const minQuestionType = 1,
      maxQuestionType = 1;
    const questionType = Math.floor(Math.random() * (maxQuestionType - minQuestionType)) + minQuestionType;
    axios
      .get(`/api/v1/question/${questionType}`)
      .then((res) => {
        this.setState({
          gameState: Train.STATE_PLAY,
          question: res.data.question,
          inProgress: true,
          lastClicked: "",
          timer: 10,
          error: null,
        });
      })
      .catch(() =>
        this.setState({
          error: "Impossible de récupérer les données depuis le serveur.",
        })
      );
  };

  /**
   * Generate the text of the question according to its type
   * @returns {string} Text of the question
   */
  generateQuestionText() {
    const { type, subject } = this.state.question;
    let text;
    switch (type) {
      case 1:
        text = 'Quelle molécule fait partie de la classe "' + subject + '" ?';
        break;
      default:
        text = "Erreur : type de question invalide.";
    }

    return text;
  }

  /**
   * Update the timer
   */
  updateTimer = (value) => {
    let { inProgress, result } = this.state;

    if (!inProgress) return false;
    if (value === 0) {
      result.bad += 1;
      inProgress = false;
    }

    this.setState({
      inProgress: inProgress,
      timer: value,
      result: result,
    });
  };

  /**
   * Handle a click on an answer button
   * @param isRightAnswer True if the click is performed on the right answer
   */
  handleAnswerClick = (isRightAnswer, value) => {
    if (!this.state.inProgress) {
      return;
    }

    const result = this.state.result;
    const { goodPoint, badPoint } = isRightAnswer ? { goodPoint: 1, badPoint: 0 } : { goodPoint: 0, badPoint: 1 };
    this.setState({
      inProgress: false,
      lastClicked: value,
      result: {
        good: result.good + goodPoint,
        bad: result.bad + badPoint,
      },
    });
  };

  render() {
    const { gameState, error } = this.state;

    return (
      <main id="quiz">
        {error !== null && <Message type="error" content={error} />}
        <SwitchView toDisplay={gameState} props={this.state} />
      </main>
    );
  }
}

Train.STATE_INTRO = 0;
Train.STATE_PLAY = 1;
Train.STATE_SUMMURY = 2;

export default Train;
