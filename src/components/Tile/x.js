const mix = require('polished').mix;
const { reverse } = require('ramda');

const buildShadeRange = () => {
  const denom = 10;
  const range = [];
  let modifier = 0;
  while (modifier <= denom) {
    range.push(mix(modifier++ / denom, 'black', 'white'));
  }
  return range;
};

const buildShadeColorMap = () => {
  const shades = reverse(buildShadeRange());
  const map = {};
  let pow = 2;
  while (shades.length) {
    map[pow] = shades.pop();
    pow = pow * 2;
  }
  return map;
};

console.log(buildShadeColorMap());
