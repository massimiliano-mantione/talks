import * as types from '../constants/ActionTypes';

export function filter(kind) {
  return { type: types.FILTER, kind };
}
