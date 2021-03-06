import React, { Component } from 'react';

import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import PickyDateTime from 'react-picky-date-time';
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Close from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';

const notificationOptions = ['Work', 'School', 'Personal'];

class Calendar extends Component {
    constructor() {
        super();
        this.state = {
            showPickyDateTime: true,
            showForm: false,
            pickedDate: '',
            pickedType: 'Work',
            pickedTitle: ''
        }
        this.hideWidget = this.hideWidget.bind(this);
        this.onDatePicked = this.onDatePicked.bind(this);
        this.selectType = this.selectType.bind(this);
        this.selectTitle = this.selectTitle.bind(this);
        this.addReminder = this.addReminder.bind(this);
        this.hideForm = this.hideForm.bind(this);
    }
    onYearPicked(res) {
        // console.log(res.year)
    }
    onMonthPicked(res) {
        // console.log(res);
    }
    onDatePicked(res) {
        const format = (d, m) => {
            this.setState({ pickedDate: parseInt(m, 10) + '/' + d, showForm: true})
        }
        format(res.date, res.month);
    }
    hideWidget() {
        const { setWidgets } = this.props;
		const { bookmarks, uploader, crypto, clock, weather, tasks } = this.props.activeWidgets;
        // Hide tasks widget
        var obj = {
            bookmarks,
            calendar: false,
            crypto,
            clock,
            tasks,
			weather,
			uploader,
        }
        setWidgets(obj);
    }
    selectType(e) {
        this.setState({ pickedType: e.target.value });
    }
    selectTitle(e) {
        this.setState({ pickedTitle: e.target.value });
    }
    addReminder() {
        var newId = (this.props.user.notifications.length === 0 ? 0 : this.props.user.notifications[this.props.user.notifications.length - 1].id + 1);
        var newNoti = {
            id: newId,
            type: this.state.pickedType.toLowerCase(),
            name: this.state.pickedTitle,
            date: this.state.pickedDate
        }
        this.props.updateNotifications([...this.props.user.notifications, newNoti], this.props.user._id, this.props.user);
        this.setState({ pickedTitle: '', showForm: false });
    }
    hideForm() {
        this.setState({ showForm: false })
    }
    render() {
        const { showPickyDateTime } = this.state
        return (
            <div id="calendar" className="widget">
                <div className="delete-widget" onClick={this.hideWidget}><Close /></div>
                <Modal id="calendar-modal" open={this.state.showForm} >
                    <div id="add-reminder" style={{background: 'white'}}>
                        <ClickAwayListener onClickAway={this.hideForm}>
                            <div className="form">
                                <h1>Add Reminder</h1>
                                <TextField
                                    id="pick-date"
                                    label="Date"
                                    defaultValue={this.state.pickedDate}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <TextField
                                    id="pick-type"
                                    select
                                    value={this.state.pickedType}
                                    onChange={this.selectType}
                                    label="Type"
                                    SelectProps={{ native: true }}>
                                    {notificationOptions.map(option => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </TextField>
                                <TextField
                                    autoFocus
                                    id="pick-title"
                                    label="Title"
                                    onChange={this.selectTitle}
                                    value={this.state.pickedTitle}
                                />
                                <Button onClick={this.addReminder} variant="contained" color="primary">
                                    <AddIcon />
                                </Button>
                            </div>
                        </ClickAwayListener>
                    </div>
                </Modal>
                <PickyDateTime
                size="xs"
                mode={0}
                show={showPickyDateTime}
                locale="en-us"
                onClose={() => this.setState({ showPickyDateTime: false })}
                onYearPicked={res => this.onYearPicked(res)}
                onMonthPicked={res => this.onMonthPicked(res)}
                onDatePicked={res => this.onDatePicked(res)}
                onResetDate={res => this.onResetDate(res)}
                onSecondChange={res => this.onSecondChange(res)}
                onMinuteChange={res => this.onMinuteChange(res)}
                onHourChange={res => this.onHourChange(res)}
                onMeridiemChange={res => this.onMeridiemChange(res)}
                onResetTime={res => this.onResetTime(res)}
                onClearTime={res => this.onClearTime(res)}
                />
            </div>
        )
    }
}

export default Calendar;