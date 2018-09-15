import * as React from 'react';
import Button from '@material-ui/core/Button';
//import { reverse } from 'ramda';
import Board from '../Board';
import { ITile } from '../Tile/Tile';
import { Direction } from '../../enums';
import { Position } from '../../models';
import {
  copy,
  getTileAtPosition,
  sortVertically,
  sortHorizontally,
  updateTiles,
} from './Game.utils';

interface Props {
  size: number;
  numStartTiles: number;
}

interface State {
  dataView: boolean;
  ready: boolean;
  tiles: ITile[];
  previousTiles: ITile[];
  shouldAddTile: boolean;
}

class Game extends React.Component {
  props: Props;

  state: State = {
    dataView: false,
    ready: false,
    tiles: [],
    previousTiles: [],
    shouldAddTile: false,
  };

  componentDidMount() {
    const root = Math.sqrt(this.props.size);

    if (!Number.isInteger(root))
      throw new Error(
        'Board size has to have an even number of rows and columns.',
      );

    this.initialize();
  }

  componentDidUpdate(_: Props, lastState: State) {
    if (this.state.shouldAddTile && !lastState.shouldAddTile) {
      this.createTile();
      this.setState({
        shouldAddTile: false,
      });
    }
  }

  private positionIsEmpty = (position: Position): boolean => {
    const tile = getTileAtPosition(this.state.tiles, position);

    if (!tile) return true;

    return !tile.value;
  };

  private getBlankTiles = () => {
    const blankTiles: ITile[] = [];

    for (const tile of this.state.tiles) {
      if (!tile.value) blankTiles.push(tile);
    }

    return blankTiles;
  };

  private getRandomBlankTileIndex = () => {
    const blankTiles = this.getBlankTiles();

    if (!blankTiles.length) return null;

    return Math.floor(Math.random() * blankTiles.length);
  };

  private createTile = () => {
    const value = Math.random() < 0.9 ? 2 : 4;
    const blankTileIndex = this.getRandomBlankTileIndex();

    return new Promise((resolve) =>
      this.setState(
        (prevState: State) => ({
          tiles: prevState.tiles.map((tile, index) => {
            if (index === blankTileIndex)
              return {
                ...tile,
                value,
              };
            return tile;
          }),
        }),
        resolve,
      ),
    );
  };

  private setupEmptyBoard = () =>
    new Promise((resolve) => {
      const { size } = this.props;

      const root = Math.sqrt(size);

      if (!Number.isInteger(root))
        throw new Error(
          'Board size has to have an even number of rows and columns.',
        );

      const tiles: ITile[] = [];

      let id = 0;

      for (let y = 0; y < root; y++) {
        for (let x = 0; x < root; x++) {
          const tile: ITile = {
            position: { x, y },
            value: null,
            id: id++,
            size: 0,
          };

          tiles.push(tile);
        }
      }

      this.setState({ tiles }, resolve);
    });

  private setupInitialTiles = () =>
    Promise.all(
      Array.from(new Array(this.props.numStartTiles)).map(() =>
        this.createTile(),
      ),
    );

  private setReady = (ready: boolean) =>
    new Promise((resolve) =>
      this.setState((prevState: State) => {
        if (prevState.ready === ready) return null;

        return { ready };
      }, resolve),
    );

  private initialize = async () => {
    await this.setReady(false);
    await this.setupEmptyBoard();
    await this.setupInitialTiles();
    await this.setReady(true);
  };

  private getVectorForDirection = (
    direction: Direction,
  ): Position => {
    switch (direction) {
      case Direction.Up:
        return { x: 0, y: -1 };
      case Direction.Down:
        return { x: 0, y: 1 };
      case Direction.Left:
        return { x: -1, y: 0 };
      case Direction.Right:
        return { x: 1, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  };

  private findFurthestPositions = (
    tile: ITile,
    dir: Direction,
  ): {
    farthest: Position;
    next: Position;
  } => {
    const vector = this.getVectorForDirection(dir);
    let cell: Position = Object.assign({}, tile.position);
    let previous: Position;

    do {
      previous = cell;
      cell = {
        x: previous.x + vector.x,
        y: previous.y + vector.y,
      };
    } while (
      cell.x >= 0 &&
      cell.x < 4 &&
      cell.y >= 0 &&
      cell.y < 4 &&
      this.positionIsEmpty(cell)
    );

    return {
      farthest: previous,
      next: cell,
    };
  };

  private getSortedTiles = (dir: Direction): ITile[] => {
    const { tiles } = this.state;
    switch (dir) {
      case Direction.Up:
      case Direction.Down:
        return sortVertically(tiles);
      //return reverse(sortVertically(tiles));
      case Direction.Left:
      case Direction.Right:
        return sortHorizontally(tiles);
      //return reverse(sortHorizontally(tiles));
      default:
        return tiles;
    }
  };

  public reset = () => {
    this.initialize();
  };

  public toggleDataView = () =>
    this.setState((prevState: State) => ({
      dataView: !prevState.dataView,
    }));

  private move = (direction: Direction) => {
    this.setState(() => {
      let moved = true;

      const tiles = this.getSortedTiles(direction);

      const movedTiles: ITile[] = copy(tiles);

      for (let i = 0; i < movedTiles.length; i++) {
        const tile = movedTiles[i];

        if (!!tile.value) {
          const positions = this.findFurthestPositions(
            tile,
            direction,
          );

          const nextTile = getTileAtPosition(
            movedTiles,
            positions.next,
          );

          if (
            nextTile &&
            nextTile.value &&
            nextTile.value === tile.value &&
            !nextTile.mergedFrom
          ) {
            nextTile.value = tile.value * 2;
            nextTile.mergedFrom = [tile, nextTile];
            tile.value = null;
            updateTiles(movedTiles, nextTile);
            updateTiles(movedTiles, tile);
          } else {
            const farthestTile = getTileAtPosition(
              movedTiles,
              positions.farthest,
            );
            const value = tile.value;

            tile.value = null;
            updateTiles(movedTiles, tile);

            if (farthestTile) {
              farthestTile.value = value;
              updateTiles(movedTiles, farthestTile);
            }
          }
        }
      }

      return {
        tiles: movedTiles,
        previousTiles: tiles,
        shouldAddTile: moved,
      };
    });
  };

  public moveUp = () => this.move(Direction.Up);
  public moveDown = () => this.move(Direction.Down);
  public moveLeft = () => this.move(Direction.Left);
  public moveRight = () => this.move(Direction.Right);

  render() {
    const { size } = this.props;
    const { dataView, ready, tiles, previousTiles } = this.state;

    return ready ? (
      <div>
        <div style={{ margin: 16 }}>
          <Button onClick={this.reset}>Reset</Button>
          <div>
            <Button onClick={this.moveUp}>↑</Button>
            <Button onClick={this.moveDown}>↓</Button>
            <Button onClick={this.moveLeft}>←</Button>
            <Button onClick={this.moveRight}>→</Button>
          </div>
          <Button onClick={this.toggleDataView}>
            Toggle data view
          </Button>
        </div>
        {!dataView ? (
          <Board tiles={tiles} size={size} />
        ) : (
          <div style={{ height: 450, overflow: 'auto' }}>
            <pre>
              {JSON.stringify({ tiles, previousTiles }, null, 2)}
            </pre>
          </div>
        )}
      </div>
    ) : null;
  }
}

export default Game;
