import * as React from 'react';
import Transition from 'react-transition-group/Transition';
import { css } from '@emotion/css';
import { Position } from '../../state/models';
import { getBaseStyles, transitionDuration } from './Tile.utils';

const transitionStyles = {
  appearing: {
    scale: 0,
  },
  entering: {
    scale: 0,
  },
  entered: {
    scale: 1,
  },
  exited: {
    scale: 0,
  },
} as any;

type ID = string;

type MergedFrom = [ID, ID] | null;

export interface ITile {
  position: Position;
  value: number;
  size: number;
  id: ID;
  innerRef?: React.Ref<HTMLDivElement>;
  mergedFrom?: MergedFrom | null;
}

const Tile = ({ value, position, size, mergedFrom = null }: ITile) => {

  const renderTile = (state: string) => {
    const baseStyles = getBaseStyles(value);
    const x = position.x * size;
    const y = position.y * size;

    const { scale } = transitionStyles[state];
    const transformStyles = css`
      transform: scale(${scale}) translate(${x}px, ${y}px);
      transform-origin: ${x + size / 2}px ${y + size / 2}px;
      height: ${size - 2}px;
      width: ${size - 2}px;
    `;

    return (
      <div className={css(transformStyles, baseStyles)}>
        <span>{value}</span>
      </div>
    );
  };

    return (
      <Transition
        appear={!mergedFrom}
        timeout={transitionDuration}
        in
      >
        {renderTile}
      </Transition>
    );
}

export default Tile;
