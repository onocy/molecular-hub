import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Grid } from '@material-ui/core';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

// Redux

import { connect } from 'react-redux';
import { getPlaylists, addPlaylist } from 'actions';

// Custom components
import {
  PlaylistTable
} from './components';

// Component styles
const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 4
  },
  item: {
    height: '100%'
  }
});

class Dashboard extends Component {
  render() {
    const { classes } = this.props;

    return (
      <DashboardLayout title="Dashboard">
        <div className={classes.root}>
          <Grid container spacing={4}>
            <Grid item lg={12} md={12} xl={12} xs={12}>
              <PlaylistTable className={classes.item} />
            </Grid>
          </Grid>
        </div>
      </DashboardLayout>
    );
  }
}

const mapStateToProps = state => ({
  playlists: state
});

const mapDispatchToProps = dispatch => {
  return {
    addPlaylist: () => dispatch(addPlaylist), 
    getPlaylist: () => dispatch(getPlaylists)
  }
};

const PlaylistContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);



Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PlaylistContainer);
