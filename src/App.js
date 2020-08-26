import React, {Component} from 'react';
import Menu from './components/MenuComponents';
import { DISHES } from './shared/dishes';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dishes: DISHES
    };
  }
  render(){
    return (
      <Menu dishes={this.state.dishes} />
    )
  }
}

export default App;
