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
import { getOrders } from 'services/order';
import { newPlaylist } from 'services/playlist';

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

class OrdersTable extends Component {
  signal = false;

  state = {
    isLoading: false,
    orders: [],
    ordersTotal: 0
  };

  async newPlaylist() {
    try {
      this.setState({ isLoading: true });

      await newPlaylist();

      const { orders, ordersTotal } = await getOrders();

      if (this.signal) {
        this.setState({
          isLoading: false,
          orders,
          ordersTotal
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

  async getOrders() {
    try {
      this.setState({ isLoading: true });

      const { orders, ordersTotal } = await getOrders();

      if (this.signal) {
        this.setState({
          isLoading: false,
          orders,
          ordersTotal
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

  componentDidMount() {
    this.signal = true;

    this.getOrders();
  }

  componentWillUnmount() {
    this.signal = false;
  }

  render() {
    const { classes, className } = this.props;
    const { isLoading, orders, ordersTotal } = this.state;

    const rootClassName = classNames(classes.root, className);
    const showOrders = !isLoading && orders.length > 0;

    return (
      <Portlet className={rootClassName}>
        <PortletHeader noDivider>
          <PortletLabel
            subtitle={`${ordersTotal} in total`}
            title="Playlists"
          />
          <PortletToolbar>
            <Button
              className={classes.newEntryButton}
              size="small"
              onClick = {newPlaylist}
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
            {showOrders && (
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
                  {orders.map(order => (
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

OrdersTable.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(OrdersTable);
