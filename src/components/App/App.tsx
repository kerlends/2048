import * as React from 'react';
//import Game from '../Game';
import Game from '../NewGame';

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
    return <Game />;
  }
}

export default App;
