import * as React from 'react';
import Transition from 'react-transition-group/Transition';
import { memoize } from 'ramda';
import { css } from 'emotion';
import { Position } from '../../state/models';
import {
  baseTileStyle,
  shadeColors,
  tileStyles,
  transitionDuration,
} from './Tile.utils';

const getClassName = memoize((value: number) =>
  css(shadeColors[value], tileStyles[value]),
);

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
};

type ID = string;

type MergedFrom = [ID, ID] | null;

interface DefaultProps {
  mergedFrom: MergedFrom;
}

export interface ITile {
  position: Position;
  value: number;
  size: number;
  id: ID;
  innerRef?: React.Ref<HTMLDivElement>;
  mergedFrom?: MergedFrom;
}

type Props = ITile & DefaultProps;

class Tile extends React.PureComponent {
  public static defaultProps: DefaultProps = {
    mergedFrom: null,
  };

  props: Props;

  renderTile = (state: string) => {
    const { id, size, value, position } = this.props;
    const className = getClassName(value);
    const x = position.x * size;
    const y = position.y * size;

    const styles = transitionStyles[state];
    return (
      <div
        data-id={id}
        className={css`
          transform: scale(${styles.scale}) translate(${x}px, ${y}px);
          transform-origin: ${x + size / 2}px ${y + size / 2}px;
          height: ${size - 2}px;
          width: ${size - 2}px;

          ${baseTileStyle} ${className};
        `}
      >
        <span>{value}</span>
      </div>
    );
  };

  render() {
    return (
      <Transition
        appear={!this.props.mergedFrom}
        in
        timeout={transitionDuration}
      >
        {this.renderTile}
      </Transition>
    );
  }
}

export default Tile;
