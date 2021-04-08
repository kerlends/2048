import { reverse } from 'ramda';
import { getLuminance, mix } from 'polished';
import { css } from '@emotion/css';
import { identity, memoizeWith } from 'ramda';

export const tileSize = 60;

export const transitionDuration = 155;

const buildShadeRange = () => {
  const denom = 10;
  const range: string[] = [];
  let modifier = 0;
  while (modifier <= denom) {
    range.push(mix(modifier++ / denom, 'black', 'white'));
  }
  return range;
};

interface ShadeColorMap {
  [prop: number]: {
    background: string;
    color: string;
  };
}

const buildShadeColorMap = (): ShadeColorMap => {
  const shades = reverse(buildShadeRange());
  const map: ShadeColorMap = {};
  let pow = 2;
  while (shades.length) {
    const shade = shades.pop();
    if (typeof shade !== 'string') break;

    const color = getLuminance(shade) < 0.2 ? 'white' : 'black';

    map[pow] = {
      background: shade,
      color,
    };
    pow = pow * 2;
  }
  return map;
};

export const shadeColors = buildShadeColorMap();

const buildFontStyles = () => {
  let base = 2;
  let exponent = 1;
  let limit = 11;

  const tileStylesMap: {[key: number]: string} = {};

  while (exponent <= limit) {
    const power = Math.pow(base, exponent);
    let fontSize = null;

    if (power >= 100 && power < 1000) fontSize = '35px';
    else if (power >= 1000) fontSize = '25px';

    tileStylesMap[power] = css`
      font-size: ${fontSize};
    `;

    exponent += 1;
  }

  return tileStylesMap;
};

export const tileFontStyles = buildFontStyles();

export const baseTileStyles = css`
  border-radius: 3px;
  text-align: center;
  font-weight: bold;
  z-index: 10;
  font-size: 45px;

  transition: transform ${transitionDuration}ms ease-in-out;
  position: absolute;
  top: 0;
  left: 0;
  margin: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(211, 211, 211, 0.5);
  box-sizing: border-box;
`;

export const getBaseStyles = memoizeWith(identity, (value: number) =>
  css(shadeColors[value], tileFontStyles[value], baseTileStyles),
);
