import * as React from 'react';
import { css } from 'emotion';
import Tile, { ITile } from '../Tile/Tile';

const toPositiveInteger = (num: number) => {
  if (num < 0) num = Math.abs(num);

  return !Number.isInteger(num) ? Math.floor(num) : num;
};

interface Props {
  size: number;
  tiles: ITile[];
}

class Board extends React.Component {
  props: Props;

  render() {
    const { tiles } = this.props;

    const root = toPositiveInteger(Math.sqrt(tiles.length));

    const tileSize = Math.min(80, (window.innerWidth - 50) / root);

    return (
      <React.Fragment>
        <div
          className={css`
            position: relative;
            height: ${tileSize * root}px;
            width: ${tileSize * root}px;
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

export default Board;

export { Props as IBoard };
