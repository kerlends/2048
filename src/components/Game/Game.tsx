import * as React from 'react';
import Button from '@material-ui/core/Button';
import Board from '../Board';
import { ITile } from '../Tile/Tile';
import { Direction } from '../../enums';
import { getTileAtPosition } from './Game.utils';

interface Props {
  size: number;
  numStartTiles: number;
}

interface State {
  dataView: boolean;
  ready: boolean;
  tiles: ITile[];
}

class Game extends React.Component {
  props: Props;

  state: State = {
    dataView: false,
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

  private getIndexForTile = (tile: ITile): number => {
    let index: number = 0;

    this.state.tiles.forEach((t, ix) => {
      if (tile.id === t.id) index = ix;
    });

    return index;
  };

  private moveTilesUp = () =>
    new Promise((r) =>
      this.setState((prevState: State) => {
        let tiles = JSON.parse(JSON.stringify(prevState.tiles));

        for (let i = 0; i < tiles.length; i++) {
          const tile: ITile = tiles[i];

          if (!!tile.value) {
            const pos = { ...tile.position };

            while (pos.y > 0) {
              pos.y -= 1;

              const t = getTileAtPosition(tiles, pos);

              if (!!t.value) {
                tiles[this.getIndexForTile(t)].value =
                  t.value + tile.value;

                tiles[i].value = null;
                //break;
              } else {
                tiles[this.getIndexForTile(t)].value = tile.value;
                tiles[i].value = null;
              }
            }
          }
        }

        return {
          tiles,
        };
      }, r),
    );

  public reset = () => {
    this.initialize();
  };

  public toggleDataView = () =>
    this.setState((prevState: State) => ({
      dataView: !prevState.dataView,
    }));

  public move = async (direction: Direction) => {
    switch (direction) {
      case Direction.Up: {
        await this.moveTilesUp();
        break;
      }
      default:
        break;
    }

    this.createTile();
  };

  render() {
    const { size } = this.props;
    const { dataView, ready, tiles } = this.state;

    return ready ? (
      <div>
        <div style={{ margin: 16 }}>
          <Button onClick={this.reset}>Reset</Button>
          <Button onClick={() => this.move(Direction.Up)}>
            Move up
          </Button>
          <Button onClick={this.toggleDataView}>
            Toggle data view
          </Button>
        </div>
        {!dataView ? (
          <Board tiles={tiles} size={size} />
        ) : (
          <div style={{ height: 450, overflow: 'auto' }}>
            <pre>{JSON.stringify(tiles, null, 2)}</pre>
          </div>
        )}
      </div>
    ) : null;
  }
}

export default Game;
