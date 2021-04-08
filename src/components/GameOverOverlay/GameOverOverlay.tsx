import * as React from 'react';
import { css } from '@emotion/css';

interface Props {
  onRestartClick: (evt: React.SyntheticEvent) => any;
}

const GameOverOverlay = ({ onRestartClick }: Props) => (
  <div
    className={css`
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 125;
    `}
  >
    <button
      onClick={onRestartClick}
      className={css`
        background: orange;
        border: none;
        font: inherit;
        font-size: 2rem;
        color: white;
        text-shadow: 0 0px 1px rgba(0, 0, 0, 0.6);
        padding: 12px 24px;
        border-radius: 12px;
      `}
    >
      Start over?
    </button>
  </div>
);

export default GameOverOverlay;
