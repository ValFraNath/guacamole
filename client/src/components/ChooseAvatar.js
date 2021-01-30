import { ArrowLeftIcon, ArrowRightIcon } from "@modulz/radix-icons";
import axios from "axios";
import PropTypes from "prop-types";
import React, { Component } from "react";

import variables from "../styles/base/_variables.module.scss";

const NUMBER_OF_EYES = Number(variables.numberChoicesEyes);
const NUMBER_OF_HANDS = Number(variables.numberChoicesHands);
const NUMBER_OF_HATS = Number(variables.numberChoicesHats);
const NUMBER_OF_MOUTHES = Number(variables.numberChoicesMouthes);

const Select = (props) => {
  return (
    <div className="choice">
      <ArrowLeftIcon
        onClick={() => {
          props.onValueChange(props.value - 1);
        }}
        className={props.value === 0 ? "disabled" : ""}
        height="30px"
        width="30px"
      />

      <ArrowRightIcon
        onClick={() => {
          props.onValueChange(props.value + 1);
        }}
        className={props.value >= props.maxValue - 1 ? "disabled" : ""}
        height="30px"
        width="30px"
      />
    </div>
  );
};

Select.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  onValueChange: PropTypes.func.isRequired,
};

const InputColor = (props) => {
  return (
    <input
      name={props.name}
      style={{ height: "25px" }}
      type="color"
      value={props.value}
      onChange={(event) => {
        props.onValueChange(event.target.value);
      }}
    />
  );
};

InputColor.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onValueChange: PropTypes.func.isRequired,
};

function randomHexColor() {
  const hexCode = "0123456789abcdef";

  let color = "#";
  for (let i = 0; i < 6; i++) color += hexCode[Math.floor(Math.random() * 16)];

  return color;
}

class ChooseAvatar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      avatarChooserState: "saved",
    };
  }

  randomAvatar = () => {
    this.setState({ avatarChooserState: "not-saved" });
    this.props.handleInputEyes(Math.floor(Math.random() * NUMBER_OF_EYES));
    this.props.handleInputHands(Math.floor(Math.random() * NUMBER_OF_HANDS));
    this.props.handleInputHat(Math.floor(Math.random() * NUMBER_OF_HATS));
    this.props.handleInputMouth(Math.floor(Math.random() * NUMBER_OF_MOUTHES));
    this.props.handleInputColorBody(randomHexColor());
    this.props.handleInputColorBG(randomHexColor());
  };

  handleSaveAvatar = () => {
    this.setState({ avatarChooserState: "saving" });

    axios
      .patch(`/api/v1/users/me`, {
        avatar: {
          eyes: this.props.choiceEyes,
          hands: this.props.choiceHands,
          hat: this.props.choiceHat,
          mouth: this.props.choiceMouth,
          colorBody: this.props.choiceColorBody,
          colorBG: this.props.choiceColorBG,
        },
      })
      .then(() => {
        this.setState({ avatarChooserState: "saved", message: "" });
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          message: "Erreur lors de la requête. Veuillez réessayer plus tard",
          avatarChooserState: "not-saved",
        });
      });
  };

  render() {
    return (
      <div id="change-avatar">
        <span>Yeux</span>
        <Select
          name="choice-eyes"
          value={this.props.choiceEyes}
          maxValue={NUMBER_OF_EYES}
          onValueChange={(ev) => {
            this.setState({ avatarChooserState: "not-saved" });
            this.props.handleInputEyes(ev);
          }}
        />

        <span>Mains</span>
        <Select
          name="choice-hands"
          value={this.props.choiceHands}
          maxValue={NUMBER_OF_HANDS}
          onValueChange={(ev) => {
            this.setState({ avatarChooserState: "not-saved" });
            this.props.handleInputHands(ev);
          }}
        />

        <span>Chapeau</span>
        <Select
          name="choice-hat"
          value={this.props.choiceHat}
          maxValue={NUMBER_OF_HATS}
          onValueChange={(ev) => {
            this.setState({ avatarChooserState: "not-saved" });
            this.props.handleInputHat(ev);
          }}
        />

        <span>Bouche</span>
        <Select
          name="choice-mouth"
          value={this.props.choiceMouth}
          maxValue={NUMBER_OF_MOUTHES}
          onValueChange={(ev) => {
            this.setState({ avatarChooserState: "not-saved" });
            this.props.handleInputMouth(ev);
          }}
        />

        <span>Couleur du corps</span>
        <InputColor
          name="choice-body"
          value={this.props.choiceColorBody}
          onValueChange={(ev) => {
            this.setState({ avatarChooserState: "not-saved" });
            this.props.handleInputColorBody(ev);
          }}
        />

        <span>Couleur de fond</span>
        <InputColor
          name="choice-background"
          value={this.props.choiceColorBG}
          onValueChange={(ev) => {
            this.setState({ avatarChooserState: "not-saved" });
            this.props.handleInputColorBG(ev);
          }}
        />

        <button onClick={this.randomAvatar} className="btn">
          Générer un avatar aléatoire
        </button>

        <button
          onClick={this.handleSaveAvatar}
          className="btn"
          disabled={this.state.avatarChooserState === "saved"}
        >
          {this.state.avatarChooserState === "saved" && "Avatar sauvegardé"}
          {this.state.avatarChooserState === "saving" && "Sauvegarde en cours..."}
          {this.state.avatarChooserState === "not-saved" && "Sauvegarder l'avatar"}
        </button>

        {this.state.message !== null && <span className="error">{this.state.message}</span>}
      </div>
    );
  }
}

ChooseAvatar.propTypes = {
  handleInputEyes: PropTypes.func.isRequired,
  handleInputHands: PropTypes.func.isRequired,
  handleInputHat: PropTypes.func.isRequired,
  handleInputMouth: PropTypes.func.isRequired,
  handleInputColorBody: PropTypes.func.isRequired,
  handleInputColorBG: PropTypes.func.isRequired,
  choiceEyes: PropTypes.number,
  choiceHands: PropTypes.number,
  choiceHat: PropTypes.number,
  choiceMouth: PropTypes.number,
  choiceColorBody: PropTypes.string,
  choiceColorBG: PropTypes.string,
};

export default ChooseAvatar;
