import * as React from 'react';
import { css } from '@emotion/css';
import Tile, { ITile } from '../Tile';

const toPositiveInteger = (num: number) => {
  if (num < 0) num = Math.abs(num);

  return !Number.isInteger(num) ? Math.floor(num) : num;
};

interface Props {
  size: number;
  tiles: ITile[];
}


const Board = ({ tiles }: Props) => {

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

export default Board;

export type { Props as IBoard };
