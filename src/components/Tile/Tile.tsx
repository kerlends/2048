import * as React from 'react';
import { css } from 'emotion';
import { Position } from '../../models';
import { baseTileStyle, tileStyles } from './Tile.utils';

export interface ITile {
  position: Position;
  value: number;
  id: number
}

class Tile extends React.Component {
  props: ITile;

  render() {
    const { value } = this.props;
    const className = value ? tileStyles[value] : false;

    return (
      <div
        className={css`
          margin: 2px;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 50px;
          width: 50px;

          ${baseTileStyle} ${className};
        `}
      >
        <span>{value}</span>
      </div>
    );
  }
}

export default Tile;
