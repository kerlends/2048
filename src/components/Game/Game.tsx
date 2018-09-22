import * as React from 'react';
import { connect } from 'react-redux';
import { css } from 'emotion';
import * as actions from '../../state/actions';
import { Direction } from '../../state/enums';
import { State } from '../../state/models';
import Tile, { ITile } from '../Tile';
import GameOverOverlay from '../GameOverOverlay';

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
  restart: typeof actions.restart;
}

class Game extends React.Component<Props> {
  componentDidMount() {
    this.setEventListeners();
  }

  componentDidUpdate(lastProps: Props) {
    if (this.props.gameOver && !lastProps.gameOver)
      this.removeEventListeners();
    else if (!this.props.gameOver && lastProps.gameOver)
      this.setEventListeners();
  }

  componentWillUnmount() {
    this.removeEventListeners();
  }

  setEventListeners = () => {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('touchstart', this.handleTouchStart, {
      passive: false,
    });
    window.addEventListener('touchmove', this.handleTouchEnd, {
      passive: false,
    });
    window.addEventListener('touchend', this.handleTouchEnd, {
      passive: false,
    });
  };

  removeEventListeners = () => {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener(
      'touchstart',
      this.handleTouchStart,
      false,
    );
    window.removeEventListener(
      'touchmove',
      this.handleTouchMove,
      false,
    );
    window.removeEventListener(
      'touchend',
      this.handleTouchEnd,
      false,
    );
  };

  moveUp = () => this.props.move(Direction.Up);

  moveDown = () => this.props.move(Direction.Down);

  moveLeft = () => this.props.move(Direction.Left);

  moveRight = () => this.props.move(Direction.Right);

  restart = () => this.props.restart();

  touches: {
    x: number;
    y: number;
  } = {
    x: 0,
    y: 0,
  };

  handleKeyDown = (evt: KeyboardEvent) => {
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
        return;
      }
    }
  };

  handleTouchStart = (evt: TouchEvent) => {
    if (evt.targetTouches.length > 1) return;

    const touches = evt.touches[0];

    if (!touches) return;

    evt.preventDefault();

    this.touches = {
      x: touches.clientX,
      y: touches.clientY,
    };
  };

  handleTouchMove = (evt: TouchEvent) => {
    evt.preventDefault();
  };

  handleTouchEnd = (evt: TouchEvent): void => {
    if (evt.targetTouches.length > 0) return;

    evt.preventDefault();

    const touches = evt.changedTouches[0];

    if (!touches) return;

    const deltaX = touches.clientX - this.touches.x;
    const deltaY = touches.clientY - this.touches.y;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (Math.max(absDeltaX, absDeltaY) > 10) {
      if (absDeltaX > absDeltaY)
        deltaX > 0 ? this.moveRight() : this.moveLeft();
      else deltaY > 0 ? this.moveDown() : this.moveUp();
    }
  };

  getTileSize = () => {
    const size = this.props.grid.length;
    return Math.min(140, (window.innerWidth - 50) / size);
  };

  getTiles = (): ITile[] => {
    const { grid } = this.props;

    const size = this.getTileSize();

    const tiles: ITile[] = [];
    grid.forEach((row, y) =>
      row.forEach((cell, x) => {
        if (cell)
          tiles.push({
            id: cell.id,
            value: cell.value,
            mergedFrom: cell.parents,
            position: { x, y },
            size,
          });
      }),
    );

    return tiles;
  };

  render() {
    const { gameOver, score, grid } = this.props;

    const boardSize = grid.length * this.getTileSize() + 4;

    const tiles = this.getTiles();

    return (
      <React.Fragment>
        <div
          className={css`
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: ${boardSize}px;
            margin: 0 auto;
          `}
        >
          <h1>2048</h1>
          <h4>Score: {score}</h4>
          <button
            className={css`
              font: inherit;
              font-size: 18px;
              background: none;
              border: none;
              padding: 4px 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.22);
            `}
            onClick={this.restart}
          >
            Start over
          </button>
        </div>
        <div
          className={css`
            position: relative;
            height: ${boardSize}px;
            width: ${boardSize}px;
            border: 1px solid #d3d3d3;
            border-radius: 3px;
            box-sizing: border-box;
            margin: 0 auto;
          `}
        >
          {gameOver && (
            <GameOverOverlay onRestartClick={this.restart} />
          )}
          {tiles.map((tile) => (
            <Tile {...tile} key={tile.id} />
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default enhance(Game);
