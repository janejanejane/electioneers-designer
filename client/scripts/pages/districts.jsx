import React from 'react';

import { connect } from 'react-redux';

import { selectFile, loadFileIfNeeded } from '../actions';

import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import DropdownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import RaisedButton from 'material-ui/lib/raised-button';

import DistrictsList from '../components/districts-list';

import CreateDistrictDialog from '../components/create-district-dialog';

const DistrictsPage = React.createClass({
  displayName: 'Districts',
  getInitialState() {
    return {
      layoutValue: 1,
      createDialogOpen: false
    };
  },
  getDefaultProps() {
    return {
      title: 'Districts'
    };
  },
  componentDidMount: function() {
    const { dispatch } = this.props;
    const selectedFile = this.props.params.filename;
    dispatch( loadFileIfNeeded( selectedFile ) );
    dispatch( selectFile( selectedFile ) );
  },
  handleLayoutChange( e, index, value ) {
    this.setState({
      layoutValue: value
    });
  },
  handleShowCreateDialog() {
    this.setState({
      createDialogOpen: true
    });
  },
  handleHideCreateDialog() {
    this.setState({
      createDialogOpen: false
    });
  },
  handleCreateSubmitDialog() {
    console.log( 'Submit Dialog' );
  },
  render() {
    return (
      <div>
        <Toolbar>
          <ToolbarGroup>
            <DropdownMenu value={this.state.layoutValue} onChange={this.handleLayoutChange}>
              <MenuItem value={1} primaryText='List'/>
              <MenuItem value={2} primaryText='Dots'/>
            </DropdownMenu>
            <RaisedButton
              label='Create'
              primary={ true }
              onTouchTap={ this.handleShowCreateDialog }>
            </RaisedButton>
          </ToolbarGroup>
        </Toolbar>
        <DistrictsList districts={this.props.districts}></DistrictsList>
        <CreateDistrictDialog
          open={this.state.createDialogOpen}
          onClose={this.handleHideCreateDialog}
          onSubmit={this.handleCreateSubmitDialog}/>
      </div>
    );
  }
});

function mapStateToProps( state ) {
  const {
    selectedFile,
    districts
  } = state;

  return {
    selectedFile,
    districts
  };
}

export default connect( mapStateToProps )( DistrictsPage );
