import { combineReducers } from 'redux';
import todos from './todos';
// Filter: import filter from './filter';

// Filter: add filter
const rootReducer = combineReducers({
  todos
});

export default rootReducer;
