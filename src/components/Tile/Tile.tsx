import * as React from 'react';
import Transition from 'react-transition-group/Transition';
import { css } from 'emotion';
import { Position } from '../../state/models';
import { baseTileStyle, shadeColors, tileStyles } from './Tile.utils';

const duration = 150;

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
  transitionDuration: number;
}

export interface ITile {
  position: Position;
  value: number;
  size: number;
  id: ID;
  innerRef?: React.Ref<HTMLDivElement>;
  mergedFrom?: MergedFrom;
  transitionDuration?: number;
}

type Props = ITile & DefaultProps;

class Tile extends React.Component {
  public static defaultProps: DefaultProps = {
    mergedFrom: null,
    transitionDuration: 150,
  };

  props: Props;

  render() {
    const {
      id,
      innerRef,
      mergedFrom,
      size,
      value,
      position,
      transitionDuration,
    } = this.props;
    const className = value
      ? css(shadeColors[value], tileStyles[value])
      : false;
    const x = position.x * size;
    const y = position.y * size;

    return (
      <Transition appear={!mergedFrom} in timeout={duration}>
        {(state) => {
          const styles = transitionStyles[state];
          return (
            <div
              data-id={id}
              className={css`
                transition: transform ${transitionDuration}ms
                  ease-in-out;
                transform: scale(${styles.scale})
                  translate(${x}px, ${y}px);
                transform-origin: ${x + size / 2}px ${y + size / 2}px;
                position: absolute;
                top: 0;
                left: 0;
                margin: 2px;
                display: flex;
                justify-content: center;
                align-items: center;
                height: ${size - 2}px;
                width: ${size - 2}px;
                border: 1px solid rgba(211, 211, 211, 0.5);
                box-sizing: border-box;

                ${baseTileStyle} ${className};
              `}
              ref={innerRef}
            >
              <span>{value}</span>
            </div>
          );
        }}
      </Transition>
    );
  }
}

export default Tile;
