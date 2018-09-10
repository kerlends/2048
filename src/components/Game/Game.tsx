import * as React from 'react';
import { assoc } from 'ramda';
import Board from '../Board';
import { ITile } from '../Tile/Tile';
import { Direction } from '../../enums';
import { getTileAtPosition } from './Game.utils';

interface Props {
  size: number;
  numStartTiles: number;
}

interface State {
  ready: boolean;
  tiles: ITile[];
}

class Game extends React.Component {
  props: Props;

  state: State = {
    ready: false,
    tiles: [],
  };

  componentDidMount() {
    const root = Math.sqrt(this.props.size);

    if (!Number.isInteger(root))
      throw new Error(
        'Board size has to have an even number of rows and columns.',
      );

    this.initialize();
  }

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

      for (let x = 0; x < root; x++) {
        for (let y = 0; y < root; y++) {
          const tile: ITile = {
            position: { x, y },
            value: 0,
            id: id++,
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

  private getIndexForTile = (tile: ITile): number => {
    let index: number = 0;

    this.state.tiles.forEach((t, ix) => {
      if (tile.id === t.id) index = ix;
    });

    return index;
  };

  private moveTilesUp = () =>
    this.setState((prevState: State) => {
      let tiles = [...prevState.tiles];

      for (let i = 0; i < tiles.length; i++) {
        const tile: ITile = tiles[i];
        let foundTile: ITile | null = null;

        while (tile.position.y > 0 || !foundTile) {
          tile.position.y -= 1;

          const t = getTileAtPosition(tiles, tile.position);

          if (t.value > 0) {
            const index = this.getIndexForTile(t);
            tiles = assoc(
              index.toString(),
              {
                ...t,
                value: t.value + tile.value,
              },
              tiles,
            );
            break;
          }
        }
      }

      return {
        tiles,
      };
    });

  public reset = () => {
    this.initialize();
  };

  public move = (direction: Direction) => {
    switch (direction) {
      case Direction.Up: {
        this.moveTilesUp();
        break;
      }
      default:
        break;
    }
  };

  render() {
    const { size } = this.props;
    const { ready, tiles } = this.state;

    return ready ? (
      <div>
        <div style={{ margin: 16 }}>
          <button onClick={this.reset}>Reset</button>
          <button onClick={() => this.move(Direction.Up)}>
            Move up
          </button>
        </div>
        <Board tiles={tiles} size={size} />
      </div>
    ) : null;
  }
}

export default Game;
