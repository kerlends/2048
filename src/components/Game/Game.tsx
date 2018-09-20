import * as React from 'react';
import { connect } from 'react-redux';
import { css } from 'emotion';
import * as actions from '../../state/actions';
import { Direction } from '../../state/enums';
import { State } from '../../state/models';
import Tile, { ITile } from '../Tile';

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

class Game extends React.Component<Props> {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress = (evt: KeyboardEvent) => {
    switch (evt.keyCode) {
      case 38: {
        return this.moveUp();
      }
      case 40: {
        return this.moveDown();
      }
      case 37: {
        return this.moveLeft();
      }
      case 39: {
        return this.moveRight();
      }
      default: {
        return console.log(evt.keyCode);
      }
    }
  };

  moveUp = () => this.props.move(Direction.Up);
  moveDown = () => this.props.move(Direction.Down);
  moveLeft = () => this.props.move(Direction.Left);
  moveRight = () => this.props.move(Direction.Right);

  render() {
    const { score, grid } = this.props;

    const tiles: ITile[] = [];

    grid.forEach((row, y) =>
      row.forEach((cell, x) => {
        if (cell)
          tiles.push({
            id: cell.id,
            value: cell.value,
            mergedFrom: cell.parents,
            position: { x, y },
            size: 0,
          });
      }),
    );

    const size = grid.length;
    const tileSize = Math.min(80, (window.innerWidth - 50) / size);
    const boardSize = size * tileSize + 4;

    return (
      <React.Fragment>
        <h4>Score: {score}</h4>
        <div
          className={css`
            position: relative;
            height: ${boardSize}px;
            width: ${boardSize}px;
            border: 1px solid #d3d3d3;
            border-radius: 3px;
            box-sizing: border-box;
          `}
        >
          {tiles.map((tile) => (
            <Tile {...tile} size={tileSize} key={tile.id} />
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default enhance(Game);
