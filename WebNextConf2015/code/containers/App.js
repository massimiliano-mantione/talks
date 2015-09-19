import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import MainSection from '../components/MainSection';
import PolymerHeader from '../components/polymer/Header';
import PolymerMainSection from '../components/polymer/MainSection';
import * as TodoActions from '../actions/todos';

class TodosReact extends Component {
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
TodosReact.propTypes = {
  todos: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

class TodosWebComponents extends Component {
  render() {
    const { todos, actions } = this.props;

    return (
      <div>
        <PolymerHeader addTodo={actions.addTodo} />
        <PolymerMainSection todos={todos} actions={actions} />
      </div>
    );
  }
};
TodosWebComponents.propTypes = {
  todos: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

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
