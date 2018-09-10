import * as React from 'react';
import Game from '../Game';

interface State {
  size: number;
}

class App extends React.Component {
  state: State = {
    size: 16,
  };

  handleSizeInputBlur = (
    evt: React.SyntheticEvent<HTMLInputElement>,
  ) => {
    const value = parseInt(evt.currentTarget.value, 10) || 16;

    if (!Number.isNaN(value)) this.setState({ value });
  };

  public render() {
    return <Game size={16} numStartTiles={2} />;
  }
}

export default App;
