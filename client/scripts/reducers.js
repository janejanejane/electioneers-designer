import { combineReducers } from 'redux';
import {
  SELECT_FILE,
  UNSELECT_FILE,
  REQUEST_FILES,
  RECEIVE_FILES,
  REQUEST_ADD_FILE,
  RECIEVE_ADD_FILE,
  REQUEST_DELETE_FILE,
  RECIEVE_DELETE_FILE,
  REQUEST_LOAD_FILE,
  RECIEVE_LOAD_FILE,
  REQUEST_SAVE_FILE,
  RECIEVE_SAVE_FILE} from './actions';

import {
  BATCH_GENERATE_FAMILY,
  EDIT_FAMILY,
  PAIR_FAMILY
} from './actions/population';

import {
  EDIT_DISTRICT,
  CREATE_DISTRICT,
  PAIR_DISTRICT
} from './actions/district';

import {
  REQUEST_GRAPHICS_FILE,
  RECIEVE_GRAPHICS_FILE
} from './actions/graphics';

import {
  batchGenerateFamily,
  editFamily,
  formatFamilyData,
  pairFamily
} from './reducers/population';

import {
  editDistrict,
  createDistrict,
  pairDistrict
} from './reducers/district';

function addFile( state, action ) {
  return [
    ...state,
    action.file
  ];
}

function deleteFile( state, action ) {
  // find index
  console.log( action, state );
  return state.filter( item => item.name !== action.name );
}

function savedFiles( state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action ) {
  switch ( action.type ) {
    case REQUEST_FILES:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      });
    case RECEIVE_FILES:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.files
      });
    case REQUEST_ADD_FILE:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: true
      });
    case RECIEVE_ADD_FILE:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: addFile( state.items, action )
      });
    case REQUEST_DELETE_FILE:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: true
      });
    case RECIEVE_DELETE_FILE:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: deleteFile( state.items, action )
      });
    default:
      return state;
  }
}

function selectedFile( state = null, action ) {
  switch ( action.type ) {
    case SELECT_FILE:
      return action.name;
    case UNSELECT_FILE:
      return null;
    default:
      return state;
  }
}

function districts( state = [], action ) {
  switch ( action.type ) {
    case RECIEVE_LOAD_FILE:
      return action.districts;
    case EDIT_DISTRICT:
      return editDistrict( state, action );
    case CREATE_DISTRICT:
      return createDistrict( state, action );
    case PAIR_DISTRICT:
      return pairDistrict( state, action );
    default:
      return state;
  }
}

function population( state = [], action ) {
  switch ( action.type ) {
    case RECIEVE_LOAD_FILE:
      return formatFamilyData( state, action );
    case BATCH_GENERATE_FAMILY:
      return batchGenerateFamily( state, action );
    case EDIT_FAMILY:
      return editFamily( state, action );
    case PAIR_FAMILY:
      return pairFamily( state, action );
    default:
      return state;
  }
}

function isDirty( state = false, action ) {
  switch ( action.type ) {
    case RECIEVE_LOAD_FILE:
      return false;
    case RECIEVE_SAVE_FILE:
      return false;
    case BATCH_GENERATE_FAMILY:
      return true;
    case EDIT_FAMILY:
      return true;
    case EDIT_DISTRICT:
      return true;
    case CREATE_DISTRICT:
      return true;
    case PAIR_FAMILY:
      return true;
    case PAIR_DISTRICT:
      return true;
    default:
      return state;
  }
}

function message( state = null, action ) {
  switch ( action.type ) {
    case RECIEVE_SAVE_FILE:
      return 'Saved ' + action.name;
    default:
      return state;
  }
}

function config( state = {}, action ) {
  switch ( action.type ) {
    case RECIEVE_LOAD_FILE:
      return action.config;
    default:
      return state;
  }
}

function graphics( state = {}, action ) {
  switch ( action.type ) {
    case RECIEVE_GRAPHICS_FILE:
      return action.graphics;
    default:
      return state;
  }
}

function graphicsLoaded( state = false, action ) {
  switch ( action.type ) {
    case REQUEST_GRAPHICS_FILE:
      return false;
    case RECIEVE_GRAPHICS_FILE:
      return true;
    default:
      return state;
  }
}

const designerApp = combineReducers({
  savedFiles,
  selectedFile,
  districts,
  population,
  isDirty,
  graphics,
  graphicsLoaded,
  message,
  config
});

export default designerApp;
