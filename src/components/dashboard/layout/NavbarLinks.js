import React, { Component } from "react";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
import Person from "@material-ui/icons/Person";
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from "@material-ui/icons/Notifications";
import DashboardIcon from "@material-ui/icons/Dashboard";
import Button from '@material-ui/core/Button';

class NavbarLinks extends Component {
  constructor() {
    super();
    this.state = {
      openNoti: false
    };
    this.handleToggles = this.handleToggles.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleToggles() {
    if (this.state.openNoti === true) {
      this.setState({ openNoti: false });
    } 
    if (this.state.openNoti === false) {
      this.setState({ openNoti: true });
    }
  }
  handleClose() {
    this.setState({ open: false });
  }

  render() {
    const { notifications } = this.props;
    return (
      <div id="links">

        {/* Dashboard */}
        <Link to="/">
          <Button
          aria-label="Dashboard">
            <DashboardIcon />
            <Hidden mdUp implementation="css">
              <p>|</p>
            </Hidden>
          </Button>
        </Link>

        {/* Notifications */}
        <div>
          <Button
            aria-owns={this.state.openNoti ? "menu-list-grow" : null}
            aria-haspopup="true"
            onClick={this.handleToggles}>
            <Badge badgeContent={notifications.length} color="secondary">
              <NotificationsIcon />
            </Badge>
            <Hidden mdUp implementation="css">
              <p onClick={this.handleClick}>|</p>
            </Hidden>
          </Button>
          {/* Notifications Dropdown */}
          <Poppers
            open={this.state.openNoti}
            anchorEl={this.anchorEl}
            transition
            disablePortal>
            {({ TransitionProps, placement }) => (
                <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom"
                }}>
                    <Paper>
                        <ClickAwayListener onClickAway={this.handleClose}>
                            <MenuList role="menu">
                              {/* If there are no notifications, display No Notifications */}
                              {notifications.length === 0 ? <MenuItem>No Notifications</MenuItem> : notifications.map((notification, index) => {
                                return (
                                  <MenuItem className="notification-item" key={index} onClick={this.handleToggles}>
                                    <Link to={`/notifications/#${notification.type}`}>{notification.name}</Link>
                                    <span className="notification-date">{notification.date}</span>
                                  </MenuItem>
                                )
                              })}
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                </Grow>
            )}
          </Poppers>
        </div>

        {/* Profile */}
        <Link to="/profile">
          <Button>
            <Person />
          </Button>
        </Link>

      </div>
    );
  }
}

NavbarLinks.propTypes = {
    notifications: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
    notifications: state.siteData.notifications
});

export default connect(mapStateToProps)(NavbarLinks);