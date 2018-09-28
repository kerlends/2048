export enum ActionTypes {
  Initialize = '@@app/initialize',
  Move = '@@app/move',
  Pause = '@@app/pause',
  Resume = '@@app/resume',
  Restart = '@@app/restart',
  Tick = '@@app/tick',
}

export enum GameStatus {
  Initializing,
  Running,
  Paused,
  Ended,
}

export enum Direction {
  Up,
  Down,
  Left,
  Right,
}
