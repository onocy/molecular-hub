import React, { Component } from 'react';

// Externals
import classNames from 'classnames';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

import { PlayArrow as PlayIcon, Edit } from '@material-ui/icons';


// Material components
import {
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';

// Shared services
import { getPlaylists, newPlaylist } from 'services/playlist';

// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletToolbar,
  PortletContent,
  Status, 
} from 'components';

// Component styles
import styles from './styles';

const statusColors = {
  playing: 'success',
  queued: 'warning',
  waiting: 'danger'
};

class PlaylistTable extends Component {
  signal = false;

  state = {
    isLoading: false,
    playlists: [],
    playlistsTotal: 0
  };

  async newPlaylist() {
    try {
      this.setState({ isLoading: true });

      await newPlaylist();

      const { playlists, playlistsTotal } = await getPlaylists();

      if (this.signal) {
        this.setState({
          isLoading: false,
          playlists,
          playlistsTotal
        });
      }
    } catch (error) {
      if (this.signal) {
        this.setState({
          isLoading: false,
          error
        });
      }
    }
  }
  

  async getPlaylists() {
    try {
      this.setState({ isLoading: true });
      
      const { playlists, playlistsTotal } = await getPlaylists();
      
      if (this.signal) {
        this.setState({
          isLoading: false,
          playlists,
          playlistsTotal
        });
      }
    } catch (error) {
      if (this.signal) {
        this.setState({
          isLoading: false,
          error
        });
      }
    }
    this.setState(this.state);
  }

  componentDidMount() {
    this.signal = true;
    this.getPlaylists();
  }

  componentWillUnmount() {
    this.signal = false;
  }

  render() {
    const { classes, className } = this.props;
    const { isLoading, playlists, playlistsTotal } = this.state;

    const rootClassName = classNames(classes.root, className);
    const showPlaylists = !isLoading && playlistsTotal > 0;

    return (
      <Portlet className={rootClassName}>
        <PortletHeader noDivider>
          <PortletLabel
            subtitle={`${playlistsTotal} in total`}
            title="Playlists"
          />
          <PortletToolbar>
            <Button
              className={classes.newEntryButton}
              size="small"
              onClick={newPlaylist}
              variant="outlined">
              New Playlist
            </Button>
          </PortletToolbar>
        </PortletHeader>
        <PerfectScrollbar>
          <PortletContent className={classes.portletContent} noPadding>
            {isLoading && (
              <div className={classes.progressWrapper}>
                <CircularProgress />
              </div>
            )}
            {showPlaylists && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Name</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell align="left">Date Created</TableCell>
                    <TableCell align="left">Schedule Time</TableCell>
                    <TableCell align="left">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {playlists.map(order => (
                    <TableRow className={classes.tableRow} hover key={order.id}>
                      <TableCell className={classes.customerCell}>
                        {order.name}
                      </TableCell>
                      <TableCell>
                        <Button color = "default">
                          <Edit/>
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button color = "default">
                          <PlayIcon style={{ color: 'green' }}/>
                        </Button>
                      </TableCell>
                      <TableCell>
                        {moment(order.createdAt).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell>
                        {order.scheduleTime !== null ? moment(order.scheduleTime).format('DD/MM/YYYY') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className={classes.statusWrapper}>
                          <Status
                            className={classes.status}
                            color={statusColors[order.status]}
                            size="sm"
                          />
                          {order.status}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </PortletContent>
        </PerfectScrollbar>
      </Portlet>
    );
  }
}

PlaylistTable.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PlaylistTable);
