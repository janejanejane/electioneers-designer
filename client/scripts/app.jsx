import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, RouteHandler } from 'react-router';

require( '../styles/_import.less' );

import { saveFile } from './actions';
import { readMessage } from './actions/messages';

import Breadcrumb from './components/breadcrumb.jsx';
import Sidebar from './components/sidebar.jsx';
import Snackbar from './components/snackbar.jsx';

import AppBar from 'material-ui/lib/app-bar';
import RaisedButton from 'material-ui/lib/raised-button';


const App = React.createClass({
  displayName: 'App',

  propTypes: {
    isFetching: PropTypes.bool.isRequired,
    didInvalidate: PropTypes.bool.isRequired,
    files: PropTypes.arrayOf( PropTypes.shape({
      name: PropTypes.string.isRequired,
      lastModified: PropTypes.string.isRequired
    }).isRequired ).isRequired,
    selectedFile: PropTypes.string
  },

  getInitialState: function() {
    return {
      sidebarOpen: false,
      messages: []
    };
  },

  handleToggle() {
    this.setState({ sidebarOpen: !this.state.open });
  },

  handleClose( event ) {
    this.setState({ sidebarOpen: false });
  },

  shiftMessage( activeMessage ) {
    const { dispatch } = this.props;
    dispatch( readMessage( activeMessage.id ) );
  },

  handleSaveButton() {
    const { dispatch } = this.props;
    dispatch( saveFile( this.props.selectedFile ) );
  },

  render() {
    const selectedFile = !this.props.selectedFile ?
                        'Designer' : this.props.selectedFile;
    let subtitle = this.props.routes[ 1 ] ? ' > ' + this.props.routes[ 1 ].name : '';

    if ( subtitle === ' > Home' ) {
      subtitle = '';
    }

    const title = selectedFile + subtitle;

    let saveButton = <div></div>;
    if ( this.props.isDirty ) {
      saveButton = <RaisedButton label='Save' onTouchTap={this.handleSaveButton}></RaisedButton>;
    }

    return (
      <div>
        <AppBar title={title}
          onLeftIconButtonTouchTap={this.handleToggle}
          iconElementRight={saveButton}>

        </AppBar>
        <Sidebar
          routes={this.props.routes}
          open={this.state.sidebarOpen}
          selectedFile={this.props.selectedFile}
          handleClose={this.handleClose}/>
        <div
          style={{
            margin: '8px'
          }}
          >
          {this.props.children}
        </div>
        <Snackbar messages={this.props.messages} onHide={this.shiftMessage}/>
      </div>
    );

  }

});

function mapStateToProps( state ) {
  const {
    isFetching,
    didInvalidate,
    items: files
  } = state.savedFiles || {
    isFetching: false,
    didInvalidate: false,
    items: []
  };

  const selectedFile = state.selectedFile;
  const messages = state.messages;
  const isDirty = state.isDirty;

  return {
    selectedFile,
    files,
    didInvalidate,
    isFetching,
    messages,
    isDirty
  };
}

export default connect( mapStateToProps )( App );
