import { reverse } from 'ramda';
import { getLuminance, mix } from 'polished';
import { css } from 'emotion';

export const transitionDuration = 155;

const buildShadeRange = () => {
  const denom = 10;
  const range = [];
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
  const map = {};
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

const textBrightColor = '#f9f6f2';
const tileColor = '#eee4da';
const tileGoldColor = '#edc22e';

const colorMap = {
  2: [false, false],
  4: [false, false],
  8: ['#f78e48', true],
  16: ['#fc5e2e', true],
  32: ['#ff3333', true],
  64: ['#ff0000', true],
  128: [false, true],
  256: [false, true],
  512: [false, true],
  1024: [false, true],
  2048: [false, true],
};

interface TileStyles {
  color: string | null;
  background: string;
  boxShadow: string | null;
  fontSize: string | null;
}

const buildColors = () => {
  let base = 2;
  let exponent = 1;
  let limit = 11;

  const tileStylesMap = {};

  while (exponent <= limit) {
    const power = Math.pow(base, exponent);

    const goldPercent = (exponent - 1) / (limit - 1);

    const nthColor = colorMap[power];

    const specialBackground = nthColor[0];
    const brightColor = nthColor[1];

    const styles: TileStyles = {
      background: mix(goldPercent, tileGoldColor, tileColor),
      fontSize: null,
      color: brightColor ? textBrightColor : null,
      boxShadow: null,
    };

    if (specialBackground) {
      styles.background = mix(
        0.55,
        specialBackground,
        styles.background,
      );
    }

    if (power >= 100 && power < 1000) styles.fontSize = '35px';
    else if (power >= 1000) styles.fontSize = '25px';

    tileStylesMap[power] = css`
      font-size: ${styles.fontSize};
    `;

    /*
    tileStylesMap[power] = css`
      color: ${styles.color};
      background: ${styles.background};
      font-size: ${styles.fontSize};
    `;
     */

    exponent += 1;
  }

  return tileStylesMap;
};

export const tileStyles = buildColors();

export const baseTileStyle = css`
  border-radius: 3px;
  background: ${tileColor};
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
