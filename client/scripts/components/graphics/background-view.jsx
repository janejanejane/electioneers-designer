import React, { PropTypes } from 'react';

import RaisedButton from 'material-ui/lib/raised-button';

import ImagesList from './images-list';
import ImageDetails from './image-details';

export default React.createClass({
  propTypes: {
    backgrounds: PropTypes.array.isRequired,
    baseUrl: PropTypes.string.isRequired
  },
  getInitialState() {
    return {
      selected: this.props.districts[ 0 ]
    };
  },
  handleSelectItem( index ) {
    // set selected based on item
    const { backgrounds } = this.props;
    const i = backgrounds.findIndex( ( d ) => d.id === index );
    this.setState({
      selected: this.props.backgrounds[ i ]
    });
  },
  handleShowUploadImage( ) {
    this.props.onUploadModal( 'backgrounds' );
  },
  render() {
    return (
      <div>
        <div className='row'>
          <div className='col-xs-4'>
            <RaisedButton label='Add' primary={true} onTouchTap={this.handleShowUploadImage}/>
            <ImagesList
              images={this.props.backgrounds}
              baseUrl={this.props.baseUrl}
              onChange={this.handleSelectItem}/>
          </div>
          <div className='col-xs-8'>
            <ImageDetails
              image={this.state.selected}
              baseUrl={this.props.baseUrl}
              />
          </div>
        </div>
      </div>
    );
  }
});
