import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

// Externals
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@material-ui/core';

// Material icons
import {
  ArrowForwardIos as ArrowForwardIosIcon,
  PlaylistAddCheck as PlaylistAddIcon, 
  PlaylistAdd as PlaylistIcon,
  DonutLarge as DonutIcon
} from '@material-ui/icons';


const styles = theme => ({
  root: {
    width: '350px',
    maxWidth: '100%'
  },
  header: {
    backgroundColor: theme.palette.background.default,
    backgroundImage: 'url("/images/round.png")',
    backgroundPositionX: 'right',
    backgroundPositionY: 'center',
    backgroundSize: 'contain',
    paddingBottom: '34px',
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '34px'
  },
  subtitle: {
    color: theme.palette.text.secondary
  },
  content: {},
  listItem: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.background.default
    }
  },
  listItemIcon: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    padding: '10px',
    borderRadius: '50%',
    marginRight: theme.spacing.unit * 2
  },
  listItemTextSecondary: {
    marignTop: '4px',
    color: theme.palette.text.secondary
  },
  arrowForward: {
    color: theme.palette.text.secondary,
    height: '16px',
    width: '16px'
  },
  footer: {
    paddingBottom: theme.spacing.unit,
    display: 'flex',
    justifyContent: 'center'
  },
  empty: {
    textAlign: 'center',
    padding: theme.spacing.unit * 3
  },
  emptyImageWrapper: {
    marginBottom: theme.spacing.unit * 3
  },
  emptyImage: {
    width: '240px',
    maxWidth: '100%',
    height: 'auto'
  }
});


const icons = {
  playlist: {
    icon: <PlaylistAddIcon />,
    color: 'blue'
  },
  playlistAdd: {
    icon: <PlaylistIcon />,
    color: 'green'
  },
  molecule: {
    icon: <DonutIcon />,
    color: 'green'
  },
};

class NotificationList extends Component {
  render() {
    const { className, classes, notifications, onSelect } = this.props;

    const rootClassName = classNames(classes.root, className);

    return (
      <div className={rootClassName}>
        {notifications.length > 0 ? (
          <Fragment>
            <div className={classes.header}>
              <Typography variant="h6">User Notifications</Typography>
              <Typography
                className={classes.subtitle}
                variant="body2"
              >
                {notifications.length} new notifications
              </Typography>
            </div>
            <div className={classes.content}>
              <List component="div">
                {notifications.map(notification => (
                  <Link
                    key={notification.id}
                    to="#"
                  >
                    <ListItem
                      className={classes.listItem}
                      component="div"
                      onClick={onSelect}
                    >
                      <ListItemIcon
                        className={classes.listItemIcon}
                        style={{ color: icons[notification.type].color }}
                      >
                        {icons[notification.type].icon}
                      </ListItemIcon>
                      <ListItemText
                        classes={{ secondary: classes.listItemTextSecondary }}
                        primary={notification.title}
                        secondary={notification.when}
                      />
                      <ArrowForwardIosIcon className={classes.arrowForward} />
                    </ListItem>
                    <Divider />
                  </Link>
                ))}
              </List>
              <div className={classes.footer}>
                <Button
                  color="primary"
                  component={Link}
                  size="small"
                  to="#"
                  variant="contained"
                >
                  See all
                </Button>
              </div>
            </div>
          </Fragment>
        ) : (
          <div className={classes.empty}>
            <div className={classes.emptyImageWrapper}>
              <img
                alt="Empty list"
                className={classes.emptyImage}
                src="/images/empty.png"
              />
            </div>
            <Typography variant="h4">There's nothing here...</Typography>
          </div>
        )}
      </div>
    );
  }
}

NotificationList.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  notifications: PropTypes.array.isRequired,
  onSelect: PropTypes.func
};

NotificationList.defaultProps = {
  notifications: [],
  onSelect: () => {}
};

export default withStyles(styles)(NotificationList);
