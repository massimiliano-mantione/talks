import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TodosReact from '../components/Todos';
import TodosWebComponents from '../components/polymer/Todos';
import * as TodoActions from '../actions/todos';

class App extends Component {
  render() {
    const { todos, dispatch } = this.props;
    const actions = bindActionCreators(TodoActions, dispatch);

    return (
      <div>
        <TodosReact todos={todos} actions={actions} />
        <TodosWebComponents todos={todos} actions={actions} />
      </div>
    );
  }
}

App.propTypes = {
  todos: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    todos: state.todos
  };
}

export default connect(mapStateToProps)(App);
