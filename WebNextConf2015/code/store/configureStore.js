import { compose, createStore } from 'redux';
import { devTools, persistState } from 'redux-devtools';
import rootReducer from '../reducers';

export default function configureStore(initialState) {
  // Enable Redux devtools only if we are using hot reloading
  var storeCreator = createStore;
  if (module.hot) {
    storeCreator = compose(
      devTools(),
      // Lets you write ?debug_session=<name> in address bar to persist debug sessions
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(createStore);
  }

  const store = storeCreator(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
