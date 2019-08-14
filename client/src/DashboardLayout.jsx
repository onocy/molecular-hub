import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Grid } from '@material-ui/core';

// Shared layouts
import { Dashboard } from 'Dashboard';

// Redux
import { connect } from 'react-redux';
import { getPlaylists, addPlaylist } from 'actions';

// Custom components
import {
  PlaylistTable
} from 'PlaylistTable';

// Component styles
const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 4
  },
  item: {
    height: '100%'
  }
});

class DashboardLayout extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Dashboard title="Dashboard">
        <div className={classes.root}>
          <Grid container spacing={4}>
            <Grid item lg={12} md={12} xl={12} xs={12}>
              <PlaylistTable className={classes.item} />
            </Grid>
          </Grid>
        </div>
      </Dashboard>
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
)(DashboardLayout);



DashboardLayout.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PlaylistContainer);
