import * as React from 'react';
import { css } from 'emotion';
import { splitEvery } from 'ramda';
import Tile, { ITile } from '../Tile/Tile';

const toPositiveInteger = (num: number) => {
  if (num < 0) num = Math.abs(num);

  return !Number.isInteger(num) ? Math.floor(num) : num;
};

type Row = ITile[];

interface Props {
  size: number;
  tiles: ITile[];
}

class Board extends React.Component {
  props: Props;

  render() {
    const { tiles } = this.props;

    const root = toPositiveInteger(Math.sqrt(tiles.length));

    const rows: Row[] = splitEvery(root, tiles);

    return (
      <div>
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={css`
              display: flex;
            `}
          >
            {row.map((tile, tileIndex) => (
              <Tile {...tile} key={tileIndex} />
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default Board;

export { Props as IBoard };
