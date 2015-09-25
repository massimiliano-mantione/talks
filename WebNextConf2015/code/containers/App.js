import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TodosReact from '../components/Todos';
import TodosWebComponents from '../components/polymer/Todos';
import * as TodoActions from '../actions/todos';
// Filter: import * as FilterActions from '../actions/filter';

class App extends Component {
  render() {
    // Filter: take { filter } from props (add to App.propTypes)
    const { todos, dispatch } = this.props;
    // Filter: const filterActions = bindActionCreators(FilterActions, dispatch);
    const actions = bindActionCreators(TodoActions, dispatch);

    // Use TodosReact or TodosWebComponents
    return (
      <TodosReact todos={todos} actions={actions} />
    );
  }
}

App.propTypes = {
  todos: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  // Filter: add filter: state.filter
  return {
    todos: state.todos
  };
}

export default connect(mapStateToProps)(App);
