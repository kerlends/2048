import { mix } from 'polished';
import { css } from 'emotion';

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
      color: ${styles.color};
      background: ${styles.background};
      font-size: ${styles.fontSize};
    `;

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
`;
