import React, { Component, PropTypes } from 'react';
import Header from './Header';
import MainSection from './MainSection';

class Todos extends Component {
  render() {
    const { todos, actions } = this.props;

    return (
      <div>
        <Header addTodo={actions.addTodo} />
        <MainSection todos={todos} actions={actions} />
      </div>
    );
  }
}

Todos.propTypes = {
  todos: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

export default Todos;
