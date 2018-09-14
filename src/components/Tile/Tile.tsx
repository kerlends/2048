import * as React from 'react';
import { css } from 'emotion';
import { Position } from '../../models';
import { baseTileStyle, tileStyles } from './Tile.utils';

export interface ITile {
  position: Position;
  value: number | null;
  size: number;
  id: number;
}

class Tile extends React.Component {
  props: ITile;

  render() {
    const { size, value, position } = this.props;
    const className = value ? tileStyles[value] : false;

    return (
      <div
        className={css`
          position: absolute;
          top: ${position.y * size}px;
          left: ${position.x * size}px;
          margin: 2px;
          display: flex;
          justify-content: center;
          align-items: center;
          height: ${size}px;
          width: ${size}px;

          ${baseTileStyle} ${className};
        `}
      >
        <span>{value}</span>
      </div>
    );
  }
}

export default Tile;
