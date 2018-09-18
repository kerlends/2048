import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../state/actions';
import { Direction } from '../../state/enums';
import { State } from '../../state/models';
import Board from '../Board';
import { ITile } from '../Tile';

const enhance = connect(
  ({ gameOver, grid, score, size }: State) => ({
    gameOver,
    grid,
    score,
    size,
  }),
  actions,
);

interface Props {
  gameOver: boolean;
  grid: State['grid'];
  move: typeof actions.move;
  score: number;
  size: number;
}

class NewGame extends React.Component<Props> {
  moveUp = () => this.props.move(Direction.Up);
  moveDown = () => this.props.move(Direction.Down);
  moveLeft = () => this.props.move(Direction.Left);
  moveRight = () => this.props.move(Direction.Right);

  render() {
    const { score, size, grid } = this.props;
    const tiles: ITile[] = grid.map((tile) => ({
      ...tile,
      size: 0,
    }));

    return (
      <React.Fragment>
        <h4>Score: {score}</h4>
        <div
          style={{
            margin: 4,
            display: 'flex',
          }}
        >
          <button onClick={this.moveUp}>↑</button>
          <button onClick={this.moveDown}>↓</button>
          <button onClick={this.moveLeft}>←</button>
          <button onClick={this.moveRight}>→</button>
        </div>
        <Board size={size} tiles={tiles} />
      </React.Fragment>
    );
  }
}

export default enhance(NewGame);
