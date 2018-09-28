import * as React from 'react';
import { connect } from 'react-redux';
import { css } from 'emotion';
import { restart } from '../../state/actions';
import { GameStatus } from '../../state/enums';
import { State } from '../../state/models';

const classes = {
  overlay: css`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 125;
  `,
  button: css`
    background: orange;
    border: none;
    font: inherit;
    font-size: 2rem;
    color: white;
    text-shadow: 0 0px 1px rgba(0, 0, 0, 0.6);
    padding: 12px 24px;
    border-radius: 12px;
  `,
  pausedMessage: css`
    font-size: 3rem;
    color: white;
    text-shadow: 0 0px 1px rgba(0, 0, 0, 0.6);
  `,
};

const enhance = connect(
  ({ grid, size, status }: State) => ({
    gameOver: status === GameStatus.Ended,
    paused: status === GameStatus.Paused,
  }),
  { onRestartClick: restart },
);

interface Props {
  gameOver: boolean;
  onRestartClick: typeof restart;
  paused: boolean;
}

const GameOverlay = ({ gameOver, onRestartClick, paused }: Props) => {
  if (!paused && !gameOver) return null;

  return (
    <div className={classes.overlay}>
      {gameOver ? (
        <button onClick={onRestartClick} className={classes.button}>
          Start over?
        </button>
      ) : (
        <p className={classes.pausedMessage}>Paused</p>
      )}
    </div>
  );
};

export default enhance(GameOverlay);
