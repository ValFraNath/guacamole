import { LapTimerIcon, CounterClockwiseClockIcon } from "@modulz/radix-icons";

import { PropTypes } from "prop-types";
import React from "react";
import { useQuery } from "react-query";

import { Link } from "react-router-dom";

import AnimationWithAction from "../components/animations/AnimAction";
import Avatar from "../components/Avatar";
import Plural from "../components/Plural";
import RemainingTime from "../components/RemainingTime";
import Loading from "../components/status/Loading";
import PageError from "../components/status/PageError";

import fightAnimAction from "../images/sprites/fight-action-240.png";
import fightAnimLoop from "../images/sprites/fight-loop-240.png";
import waitingAnimAction from "../images/sprites/waiting-action-120.png";
import waitingAnimLoop from "../images/sprites/waiting-loop-120.png";

import { incrementDate } from "../utils/handleDates";

const HomePageHeader = ({ user }) => (
  <header>
    <div id="header-background"></div>
    <Avatar size="125px" infos={user.avatar} />

    <div>
      <h1>{user.pseudo}</h1>
      <p>
        {user.victories} <Plural word="victoire" count={user.victories} />
      </p>
      <p>
        {user.defeats} <Plural word="défaite" count={user.defeats} />
      </p>
    </div>
  </header>
);

HomePageHeader.propTypes = {
  user: PropTypes.shape({
    pseudo: PropTypes.string.isRequired,
    victories: PropTypes.number.isRequired,
    defeats: PropTypes.number.isRequired,
    avatar: PropTypes.shape({
      eyes: PropTypes.number,
      hands: PropTypes.number,
      hat: PropTypes.number,
      mouth: PropTypes.number,
      colorBody: PropTypes.string,
      colorBG: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

const HomePage = () => {
  function displayResultDuel(user, opponent) {
    if (user === opponent) return "Égalité :";
    if (user > opponent) return "Vous avez gagné :";
    return "Vous avez perdu :";
  }

  const { isLoading, data: duels, isError } = useQuery("duels");
  const { data: currentUser } = useQuery(["user", "me"], { refetchOnMount: "always" });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <PageError message="Erreur lors du chargement de la page" />;
  }

  const { usersData } = duels;

  return (
    <main id="homepage">
      <HomePageHeader user={currentUser} />

      <div id="links">
        <Link to="/train" className="btn">
          Entraînement
        </Link>
        <Link to="/duel/create" className="btn">
          Nouveau duel
        </Link>
      </div>

      <section>
        <h2>
          <AnimationWithAction
            size={120}
            loopImage={{
              imageLink: fightAnimLoop,
              nbFrames: 14,
              duration: 1,
            }}
            actionImage={{
              imageLink: fightAnimAction,
              nbFrames: 14,
              duration: 0.8,
            }}
            timeBetweenAction={[2, 6]}
          />
          Ton tour
        </h2>
        {duels.toPlay.length === 0 ? (
          <p>Aucun défi à relever pour le moment.</p>
        ) : (
          <>
            {duels.toPlay.map((value) => (
              <article key={value.id}>
                <Avatar size="75px" infos={usersData[value.opponent]?.avatar} />
                <Link to={`/duel/${value.id}`} className="challenges-text">
                  <div>
                    <h3>{value.opponent}</h3>
                    <p className="time">
                      <LapTimerIcon />
                      <RemainingTime
                        finalDate={incrementDate({ hours: 24 }, new Date(value.opponentLastPlayed))}
                      />
                    </p>
                    <p>
                      Tour {value.currentRound} : {value.userScore} - {value.opponentScore}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </>
        )}
      </section>

      <section>
        <h2>
          <AnimationWithAction
            size={60}
            loopImage={{
              imageLink: waitingAnimLoop,
              nbFrames: 24,
              duration: 1,
            }}
            actionImage={{
              imageLink: waitingAnimAction,
              nbFrames: 24,
              duration: 1,
            }}
            timeBetweenAction={[2, 6]}
          />
          En attente
        </h2>
        {duels.pending.length === 0 ? (
          <p>Aucun défi à en attente pour le moment.</p>
        ) : (
          <>
            {duels.pending.map((value) => (
              <article key={value.id}>
                <Link to={`/duel/${value.id}`} className="challenges-text">
                  <h3>{value.opponent}</h3>
                  <p className="time">
                    <LapTimerIcon />
                    <RemainingTime
                      finalDate={incrementDate({ hours: 24 }, new Date(value.lastPlayed))}
                    />
                  </p>
                  <p>En train de jouer le tour {value.currentRound}...</p>
                </Link>
                <Avatar size="75px" infos={usersData[value.opponent]?.avatar} />
              </article>
            ))}
          </>
        )}
      </section>

      {duels.finished.length > 0 && (
        <section>
          <h2>Terminés</h2>
          <>
            {duels.finished
              .sort((a, b) => b.finishedDate - a.finishedDate)
              .map((value) => (
                <article key={value.id}>
                  <Avatar size="75px" infos={usersData[value.opponent]?.avatar} />
                  <Link to={`/duel/${value.id}`} className="challenges-text">
                    <h3>{value.opponent} </h3>
                    <p className="time">
                      <CounterClockwiseClockIcon />
                      {new Date(value.finishedDate).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                      })}
                    </p>
                    <p>
                      {displayResultDuel(value.userScore, value.opponentScore)} {value.userScore} -{" "}
                      {value.opponentScore}
                    </p>
                  </Link>
                </article>
              ))}
          </>
        </section>
      )}
    </main>
  );
};

export default HomePage;
