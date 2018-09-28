import * as React from 'react';
import { css } from 'emotion';
import { mix } from 'polished';

const classes = {
  button: css`
    font: inherit;
    font-size: 16px;
    background: none;
    border: none;
    padding: 8px 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.22);
    font-weight: bold;
    :disabled {
      color: ${mix(0.5, 'white', 'grey')};
    }
  `,
};

interface Props {
  disabled?: boolean;
  onClick: () => any;
  label: string;
}

const GameControlButton = ({ disabled, onClick, label }: Props) => (
  <button
    className={classes.button}
    disabled={disabled}
    onClick={onClick}
  >
    {label}
  </button>
);

export default GameControlButton;
