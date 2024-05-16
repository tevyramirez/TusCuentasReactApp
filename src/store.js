// store.js

import { createStore } from 'redux';
import { combineReducers } from 'redux';
import propietariosReducer from './reducers/propietariosReducer';

const mainReducer = combineReducers({
  propietariosState: propietariosReducer
});

const store = createStore(mainReducer);