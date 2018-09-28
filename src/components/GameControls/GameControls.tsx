import * as React from 'react';
import { connect } from 'react-redux';
import { css } from 'emotion';
import { GameStatus } from '../../state/enums';
import { State } from '../../state/models';
import * as actions from '../../state/actions';
import GameControlButton from '../GameControlButton';

const enhance = connect(
  ({ status }: State) => ({
    gameOver: status === GameStatus.Ended,
    paused: status === GameStatus.Paused,
  }),
  actions,
);

const classes = {
  container: css`
    display: flex;
    justify-content: space-between;
    margin: 24px 0;
  `,
};

interface Props {
  gameOver: boolean;
  paused: boolean;
  pause: typeof actions.pause;
  restart: typeof actions.restart;
  resume: typeof actions.resume;
}

const GameControls = ({
  gameOver,
  paused,
  pause,
  restart,
  resume,
}: Props) => (
  <div className={classes.container}>
    <GameControlButton
      onClick={pause}
      disabled={gameOver || paused}
      label="Pause"
    />
    <GameControlButton
      onClick={resume}
      disabled={!paused}
      label="Resume"
    />
    <GameControlButton onClick={restart} label="Restart" />
  </div>
);

export default enhance(GameControls);
