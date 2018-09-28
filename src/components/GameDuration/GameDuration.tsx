import * as React from 'react';
import { connect } from 'react-redux';
import { State } from '../../state/models';

const enhance = connect(({ duration }: State) => ({
  duration,
}));

interface Props {
  duration: number;
}

const GameDuration = ({ duration }: Props) => (
  <span>{`Time elapsed: ${duration}`}</span>
);

export default enhance(GameDuration);
