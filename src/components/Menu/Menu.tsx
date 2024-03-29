import * as React from 'react'

interface Props {
  children: React.ReactType,
}

class Menu extends React.Component<Props> {
  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        {children}
      </React.Fragment>
    );
  }
}

export default Menu;