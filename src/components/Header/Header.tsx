import * as React from 'react';
import { connect } from 'react-redux';
import { css } from 'emotion';
import { State } from '../../state/models';

const pickScoreProps = ({ hiScore, score }: State) => ({
  hiScore,
  score,
});

const enhance = connect(pickScoreProps);

const classes = {
  container: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 auto;
  `,
};

interface Props {
  hiScore: number;
  score: number;
}

const Header = ({ hiScore, score, ...props }: Props) => (
  <div className={classes.container}>
    <h1>2048</h1>
    <h4>score: {score}</h4>
    <h4>top: {hiScore}</h4>
  </div>
);

export default enhance(Header);
