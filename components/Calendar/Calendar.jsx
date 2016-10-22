"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../typings/tsd.d.ts" />
/*
Props -
prevMonths: No of previous months to show in calendar
nextMonths:No of next months to show in calendar
multiDate: Whether selection of multiple dates should be allowed.
if this is false then calendar will autoclose on selecting one date automatically else it wont close automatically
minDate:minimum possbile selectable date. By default -5 years of current date
maxDate:maximum selectable date. By default +5 years of current date
defaultDate:Date to populate on load
highlightedDates: Dates to be highlighted. Takes array of objects with 2 keys - date and description.
eg. {'date': moment('01-01-2016','DD-MM-YYYY'), 'description':'New Year Holiday'}
isBlockedDate: Custom Function supplied by user to block a particular date. Gets date as parameter and should return true/false
onSelectDate: Callback function to be fired when a date is selected. Gives the selected date as paramter
defaultDisplayMonthDate: Used to show default open month.. if default value is specified then the default open month is taken from defaultValue month
else defaultDisplayMonthDate prop is considered. If this is also not supplied then current month is shown open

*NOTE:- All Dates to be ideally supplied as moment objects. Similarly when dates are to be
extracted they will be in the form of moment objects.

Cases not handled:-
If user provides a default date which is blocked - What should be done?


The drop down of year shows max year and min year based on min date and max date
Also if user has selected Dec 2014 in dropdows and now he changes year to 2015
But say maxdate is specified as 31 Oct 2015.
Then the month drop down will automaticaly change to October. Also November and December will not
be shown in month drop down when year is selected as 2015.
Same in case of minDate.

When user tries to scroll through buttons then after the max/min date has been reached the scroll will
be disabled preventing further scroll.

*/
var React = require('react');
var ReactDOM = require('react-dom');
var listensToClickOutside = require('../dependencies/js/onClickHandler');
var helpers = require('../dependencies/js/helpers');
var moment = require('moment');
var Validations = require('../dependencies/js/validations');
var Modal = require('../Modal/Modal.jsx');
var helperObj = new helpers.default();
var daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
//require("css!./Calendar.css")
var Week = (function (_super) {
    __extends(Week, _super);
    function Week() {
        _super.apply(this, arguments);
    }
    Week.prototype.render = function () {
        var dayCellStyle;
        var defaultCellStyle = { cursor: 'pointer', color: 'black' };
        var greyedCellStyle = { cursor: 'pointer', color: 'rgba(128, 128, 128, 0.31)' };
        var selectedCellStyle = { cursor: 'pointer', color: 'white', fontWeight: 'bold', background: '#ff704c' };
        var highlightedCellStyle = { cursor: 'pointer', color: '#fff', fontWeight: 'bold', background: '#314451' };
        var blockedCellStyle = { cursor: 'not-allowed', color: 'grey' };
        var weekDays = [];
        var firstDay;
        var day;
        var date;
        var tooltip;
        for (var i = 1; i <= 7; i++) {
            dayCellStyle = defaultCellStyle;
            date = moment(this.props.firstDay, this.props.format).add(i - 1, 'days');
            day = moment(date, this.props.format).date();
            tooltip = '';
            //blocked on min / max date style
            if ((this.props.minDate != '' && moment(date, this.props.format).isBefore(moment(this.props.minDate, this.props.format)))
                || (this.props.maxDate != '' && moment(date, this.props.format).isAfter(moment(this.props.maxDate, this.props.format)))) {
                dayCellStyle = blockedCellStyle;
            }
            else if (this.props.isBlockedDate(date)) {
                dayCellStyle = blockedCellStyle;
            }
            else if (date.month() != this.props.currentDate.month()) {
                dayCellStyle = greyedCellStyle;
            }
            else if (helperObj.doesMomentObjectExist(date, this.props.selectedDates) > -1) {
                dayCellStyle = selectedCellStyle;
            }
            else {
                for (var _i = 0, _a = this.props.highlightedDates; _i < _a.length; _i++) {
                    var loopDate = _a[_i];
                    if (moment(date, this.props.format).isSame(moment(loopDate['date'], this.props.format), 'day')) {
                        tooltip = loopDate['description'];
                        dayCellStyle = highlightedCellStyle;
                        break;
                    }
                }
            }
            weekDays.push(<td key={'DateCell_' + date.format('YYYY-MM-DD')} title={tooltip} style={dayCellStyle} onClick={this.props.onChange.bind(this, date)}>{day}</td>);
        }
        return (<tr>{weekDays}</tr>);
    };
    return Week;
}(React.Component));
var Month = (function (_super) {
    __extends(Month, _super);
    function Month() {
        _super.apply(this, arguments);
    }
    Month.prototype.getMonthDropDown = function (displayedMonth, minMonth, maxMonth) {
        if (minMonth === void 0) { minMonth = 0; }
        if (maxMonth === void 0) { maxMonth = 11; }
        var _this = this;
        var options = moment.months().map(function (loopMonth, i) {
            if (i <= maxMonth && i >= minMonth) {
                return (<option key={'MonthDropDown_' + i.toString()} value={i.toString()}>{loopMonth}</option>);
            }
        });
        return (<select tabIndex={-1} value={displayedMonth.toString()} onChange={_this.props.handleMonthDropDownChange.bind(_this)}>{options}</select>);
    };
    Month.prototype.getYearDropDown = function (displayedYear) {
        var _this = this;
        var options = [];
        var currentYear = moment().year();
        var minYear = moment(this.props.minDate, this.props.format).year();
        var maxYear = moment(this.props.maxDate, this.props.format).year();
        for (var i = minYear; i <= maxYear; i++) {
            options.push(<option key={'YearDropDown_' + i.toString()} value={i.toString()}>{i}</option>);
        }
        return (<select tabIndex={-1} value={displayedYear.toString().toString()} onChange={_this.props.handleYearDropDownChange.bind(_this)}>{options}</select>);
    };
    Month.prototype.render = function () {
        var _this = this;
        var dayCellStyle = { margin: '4px', cursor: 'pointer' };
        var monthDisplayStyle = { textAlign: 'center', cursor: 'pointer' };
        var calendarDisplayStyle = { display: 'inline-block', margin: '8px' };
        var dropDownDisplayStyle = { visibility: this.props.index == 0 && this.props.isOpen == true && this.props.isShowDropDowns == true ? 'visible' : 'hidden' };
        var yearMonthDisplayStyle = { visibility: this.props.index != 0 && this.props.isOpen == true ? 'visible' : 'hidden' };
        var renderedDays = daysOfWeek.map(function (day, i) {
            return (<th key={'DayName_' + day}> {day} </th>);
        });
        var currentDate = this.props.displayedMonthDate;
        var firstDayInCalendar = moment(currentDate, this.props.format).startOf('month').day('Sunday');
        var firstDayOfWeek = firstDayInCalendar;
        var month = moment().month(moment(currentDate, this.props.format).month()).format('MMM');
        var year = moment(currentDate, this.props.format).year();
        var minMonth = 0;
        var maxMonth = 11;
        if (moment(currentDate).year() == moment(this.props.maxDate, this.props.format).year()) {
            maxMonth = moment(this.props.maxDate, this.props.format).month();
        }
        if (moment(currentDate).year() == moment(this.props.minDate, this.props.format).year()) {
            minMonth = moment(this.props.minDate, this.props.format).month();
        }
        var monthDropDown = this.getMonthDropDown(moment(currentDate, this.props.format).month(), minMonth, maxMonth);
        var yearDropDown = this.getYearDropDown(year);
        var weeks = [];
        for (var i = 0; i < 6; i++) {
            weeks.push(<Week key={'Week_' + i} firstDay={firstDayOfWeek} currentDate={currentDate} onChange={this.props.setDate.bind(this)} selectedDates={this.props.selectedDates} minDate={this.props.minDate} maxDate={this.props.maxDate} blockedDays={this.props.blockedDays} blockedDates={this.props.blockedDates} highlightedDates={this.props.highlightedDates} isBlockedDate={this.props.isBlockedDate} format={this.props.format}/>);
            firstDayOfWeek = moment(firstDayOfWeek.format(this.props.format), this.props.format).add(1, 'weeks');
            if ((firstDayOfWeek.year() > moment(currentDate, this.props.format).year())
                || (firstDayOfWeek.month() > moment(currentDate, this.props.format).month())) {
                break;
            }
        }
        return (<div className='w--calendar_month' key={month + ' ' + year}>
					<div className='w--calendar_month_header'>
							{monthDropDown}
							{yearDropDown}
					</div>
					<div className='w--calendar_month_table'>
						<table>
							<tbody>
								<tr>
								{renderedDays}
								</tr>
								{weeks}
							</tbody>
						</table>
					</div>
				</div>);
    };
    return Month;
}(React.Component));
var Calendar = (function (_super) {
    __extends(Calendar, _super);
    function Calendar(props) {
        _super.call(this, props);
        var selectedDates = [];
        var displayedMonthDate = moment();
        if (this.props.defaultDate) {
            selectedDates.push(moment(this.props.defaultDate, this.props.format));
            displayedMonthDate = moment(this.props.defaultDate, this.props.format);
        }
        else if (this.props.defaultDisplayMonthDate) {
            displayedMonthDate = moment(this.props.defaultDisplayMonthDate, this.props.format);
        }
        this.state = {
            selectedDates: selectedDates,
            displayedMonthDate: displayedMonthDate,
            isLeftScrollDisabled: false,
            isRightScrollDisabled: false,
            isOpen: this.props.defaultOpen,
            isValid: true,
            validationMsg: ''
        };
    }
    Calendar.prototype.componentDidMount = function () {
        var _this = this;
        var self = this;
        //handling closing of calendar when clicked outside
        this.clickOutsideHandler = new listensToClickOutside.default(ReactDOM.findDOMNode(this.refs['CalendarContainer']), function () {
            if (_this.props.isCloseOnOutSideClickAndScroll)
                _this.toggleDisplay(true);
        });
        //handling closing of calendar when scrolled out of view
        if (this.props.isCloseOnOutSideClickAndScroll)
            window.addEventListener("scroll", self.handlePageScroll.bind(self));
    };
    Calendar.prototype.componentWillUnmount = function () {
        var self = this;
        self.clickOutsideHandler.dispose();
        if (this.props.isCloseOnOutSideClickAndScroll)
            window.removeEventListener("scroll", self.handlePageScroll.bind(self));
    };
    Calendar.prototype.componentWillReceiveProps = function (nextProps) {
        var selectedDates = [];
        var displayedMonthDate = this.state.displayedMonthDate ? this.state.displayedMonthDate : moment();
        if (nextProps.defaultDate) {
            selectedDates.push(moment(nextProps.defaultDate, this.props.format));
            displayedMonthDate = moment(nextProps.defaultDate, this.props.format);
        }
        else if (nextProps.defaultDisplayMonthDate) {
            displayedMonthDate = moment(nextProps.defaultDisplayMonthDate, this.props.format);
        }
        this.setState({
            selectedDates: selectedDates,
            displayedMonthDate: displayedMonthDate,
            isOpen: nextProps.defaultOpen
        });
    };
    Calendar.prototype.getValues = function () {
        return this.state.selectedDates;
    };
    Calendar.prototype.handlePageScroll = function () {
        var calendarNode = ReactDOM.findDOMNode(this.refs['CalendarContainer']);
        if (this.state.isOpen && calendarNode.getBoundingClientRect().top <= 0) {
            this.setState({
                isOpen: false
            });
        }
    };
    Calendar.prototype.handleYearDropDownChange = function (event) {
        var year = parseInt(event.target.value);
        var newDisplayDate = moment(this.state.displayedMonthDate, this.props.format);
        var maxYear = moment(this.props.maxDate, this.props.format).year();
        var minYear = moment(this.props.minDate, this.props.format).year();
        var maxMonth = moment(this.props.maxDate, this.props.format).month();
        var minMonth = moment(this.props.minDate, this.props.format).month();
        // if month is greater than maxMonth then set it as displayed month
        if (year == maxYear && newDisplayDate.month() > maxMonth) {
            newDisplayDate.set('month', maxMonth);
        }
        // if month is lesser than minMonth then set it as the displayed month
        if (year == minYear && newDisplayDate.month() < minMonth) {
            newDisplayDate.set('month', minMonth);
        }
        newDisplayDate.set('year', year);
        //part to check whether right and left scroll should be disabled
        var minDisplayedMonth = newDisplayDate.add(this.props.prevMonths * -1, 'month');
        var maxDisplayedMonth = newDisplayDate.add(this.props.nextMonths, 'month');
        var isLeftScrollDisabled = false;
        var isRightScrollDisabled = false;
        if (this.props.minDate != ''
            && minDisplayedMonth.startOf('month').isBefore(moment(this.props.minDate, this.props.format).startOf('month'))) {
            isLeftScrollDisabled = true;
        }
        else if ((this.props.maxDate != ''
            && maxDisplayedMonth.startOf('month').isAfter(moment(this.props.maxDate, this.props.format)))) {
            isRightScrollDisabled = true;
        }
        this.setState({
            displayedMonthDate: newDisplayDate,
            isLeftScrollDisabled: isLeftScrollDisabled,
            isRightScrollDisabled: isRightScrollDisabled
        });
    };
    Calendar.prototype.handleMonthDropDownChange = function (event) {
        var month = parseInt(event.target.value);
        var newDisplayDate = moment(this.state.displayedMonthDate, this.props.format);
        newDisplayDate.set('month', month);
        this.setState({
            displayedMonthDate: newDisplayDate
        });
    };
    Calendar.prototype.changeDisplayedMonth = function (offset) {
        var newDisplayMonthDate = moment(this.state.displayedMonthDate, this.props.format).add(offset, 'month');
        // this is done because moment.add mutates the original object hence taking temp
        var tempNewDisplayMonth = moment(newDisplayMonthDate.format(this.props.format), this.props.format);
        var minDisplayedMonth = tempNewDisplayMonth.subtract(this.props.prevMonths, 'month');
        var maxDisplayedMonth = tempNewDisplayMonth.add(this.props.nextMonths, 'month');
        var isLeftScrollDisabled = false;
        var isRightScrollDisabled = false;
        if (this.props.minDate != ''
            && minDisplayedMonth.startOf('month').isBefore(moment(this.props.minDate, this.props.format).startOf('month'))) {
            isLeftScrollDisabled = true;
        }
        else if ((this.props.maxDate != ''
            && maxDisplayedMonth.startOf('month').isAfter(moment(this.props.maxDate, this.props.format)))) {
            isRightScrollDisabled = true;
        }
        else {
            this.setState({
                displayedMonthDate: newDisplayMonthDate
            });
        }
        this.setState({
            isLeftScrollDisabled: isLeftScrollDisabled,
            isRightScrollDisabled: isRightScrollDisabled
        });
    };
    Calendar.prototype.setDate = function (date) {
        var self = this;
        var selectedDates = this.state.selectedDates;
        if ((this.props.minDate != '' && moment(date, this.props.format).isBefore(moment(this.props.minDate, this.props.format)))
            || (this.props.maxDate != '' && moment(date, this.props.format).isAfter(moment(this.props.maxDate, this.props.format)))) {
        }
        else if (this.props.isBlockedDate(moment(date, this.props.format))) {
        }
        else {
            if (this.props.multiDate) {
                var existingIndex = helperObj.doesMomentObjectExist(date, selectedDates);
                if (existingIndex > -1) {
                    selectedDates.splice(existingIndex, 1);
                }
                else {
                    selectedDates.push(date);
                }
            }
            else {
                selectedDates = [date];
            }
            //var selectedMonthDate = moment(date)
            var validationObj = Validations.default.validationHandler(selectedDates, this.props.validations);
            this.setState({
                selectedDates: selectedDates,
                isOpen: this.props.multiDate == true ? true : false,
                isValid: validationObj['isValid'],
                validationMsg: validationObj['message'],
                isShowErrors: false
            }, function () {
                //User can provide function here to do custom things in onSelectDate prop
                if (this.props.onSelectDate) {
                    this.props.onSelectDate(date);
                }
            });
        }
    };
    Calendar.prototype.clearDate = function (index) {
        var selectedDates = this.state.selectedDates;
        if (index == -1) {
            selectedDates = [];
        }
        else {
            selectedDates.splice(index, 1);
        }
        this.setState({
            selectedDates: selectedDates
        });
    };
    Calendar.prototype.toggleDisplay = function (isOnlyClose) {
        if (isOnlyClose === void 0) { isOnlyClose = false; }
        var self = this;
        this.setState({
            isOpen: isOnlyClose == true ? false : !this.state.isOpen
        }, function () {
            if (self.state.isOpen === false) {
                self.onClose();
            }
        });
    };
    Calendar.prototype.onClose = function () {
        if (this.props.onClose)
            this.props.onClose();
    };
    Calendar.prototype.isValid = function (isShowErrors) {
        if (isShowErrors === void 0) { isShowErrors = false; }
        var validationObj = Validations.default.validationHandler(this.state.selectedDates, this.props.validations);
        if (isShowErrors) {
            this.setState({
                isShowErrors: true,
                isValid: validationObj['isValid'],
                validationMsg: validationObj['message']
            });
        }
        return validationObj.isValid;
    };
    Calendar.prototype.handleOpenOnKeyPress = function (event) {
        if (event.keyCode == 13)
            this.toggleDisplay();
    };
    Calendar.prototype.handleCalendarFocus = function (isClose) {
        if (isClose === void 0) { isClose = false; }
        this.toggleDisplay(isClose);
    };
    Calendar.prototype.render = function () {
        var _this = this;
        var optionCancelStyle = { visibility: this.props.multiDate == true ? 'visible' : 'hidden' };
        var calendarContainerStyle = { visibility: this.state.isOpen == true ? 'visible' : 'hidden' };
        var leftScrollDisplayStyle = {
            cursor: this.state.isLeftScrollDisabled == true ?
                'not-allowed' : 'pointer'
        };
        var rightScrollDisplayStyle = {
            cursor: this.state.isRightScrollDisabled == true ?
                'not-allowed' : 'pointer'
        };
        var selectedDates = this.state.selectedDates.map(function (date, i) {
            return (<span key={'SelectedDate_' + i}>
											<span onClick={_this.toggleDisplay.bind(_this)}>{moment(date, _this.props.format).format('DD MMM YYYY')} </span>
											<i style={optionCancelStyle} className='fa fa-times' onClick={_this.clearDate.bind(_this, i)}> </i>
										</span>);
        });
        var labelClass = selectedDates.length > 0 ? 'label_minimised' : 'label_full';
        var months = [];
        for (var i = 0 - this.props.prevMonths; i <= this.props.nextMonths; i++) {
            //months.push(this.renderCalendar(moment(this.state.displayedMonthDate).add(i,'month'), i))
            months.push(<Month key={'Month_' + i} minDate={this.props.minDate} maxDate={this.props.maxDate} highlightedDates={this.props.highlightedDates} selectedDates={this.state.selectedDates} displayedMonthDate={moment(this.state.displayedMonthDate, this.props.format).add(i, 'month')} isOpen={this.state.isOpen} index={i} setDate={this.setDate.bind(this)} handleMonthDropDownChange={this.handleMonthDropDownChange.bind(this)} handleYearDropDownChange={this.handleYearDropDownChange.bind(this)} isBlockedDate={this.props.isBlockedDate} isShowDropDowns={this.props.isShowDropDowns} format={this.props.format}/>);
        }
        var selector = this.state.isOpen ? <div className={"w--calendar_dd " + (this.state.isOpen ? 'reveal' : '')}>
					<span className='w--calendar_prev' style={leftScrollDisplayStyle} onClick={this.changeDisplayedMonth.bind(this, -1)}>{'\u2190'}</span>
					<span className='w--calendar_next' style={rightScrollDisplayStyle} onClick={this.changeDisplayedMonth.bind(this, 1)}>{'\u2192'}</span>
					{months}
				</div> : null;
        return (<div className={"w--calendar " + "w--calendar-column-" + months.length + " " + this.props.customClass} ref='CalendarContainer' key={'CalendarContainer'}>
				{this.props.displayCalendarHandle === true ?
            (<div className={"w--calendar_handle " + this.props.selectedClass} onClick={this.toggleDisplay.bind(this)}>
							<div className={labelClass}> {this.state.selectedDates.toString().length > 0 ?
                (this.props.titleText || this.props.labelText) :
                this.props.labelText} 
							</div>
							<div> {selectedDates} </div>

							<span>
								<i className='fa fa-2x fa-times' onClick={this.clearDate.bind(this, -1)}> </i>
							</span>
							<span className="w--calendar_edit">
								{this.props.buttonText || ''}
							</span>
						</div>) :
            null}
				{this.state.isOpen && this.props.isMobileDevice ?
            <Modal onClose={this.toggleDisplay.bind(this, true)} isOpen={this.state.isOpen} isCloseOnOutSideClick={false} header={this.props.labelText} customHeaderClass="modal_header modal_header--title" isCloseOnEscape={false} isShowCloseIcon={true} isPreventScrolling={false} customParentClass="cf-modal--dialogue dropdown-modal">
						{selector}
					</Modal> : selector}
				{this.state.isValid == false && this.state.isShowErrors == true ?
            <div className={'error-label ' + (this.props.errorClass)}>{this.state.validationMsg}</div>
            : null}
		    </div>);
    };
    Calendar.defaultProps = {
        prevMonths: 0,
        nextMonths: 0,
        multiDate: false,
        minDate: moment().subtract(5, 'year'),
        maxDate: moment().add(5, 'year'),
        //blockedDates:['2016-01-01', '2016-02-10'],
        //blockedDays:[3,6],
        highlightedDates: [],
        isBlockedDate: function (date) {
        },
        onSelectDate: function (currentSelectedValue) {
        },
        defaultOpen: false,
        labelText: "Date",
        isShowDropDowns: true,
        displayCalendarHandle: true,
        selectedClass: '',
        validations: [],
        customClass: '',
        format: 'YYYY-MM-DD',
        isCloseOnOutSideClickAndScroll: true,
        isMobileDevice: false
    };
    Calendar.propTypes = {
        prevMonths: React.PropTypes.number,
        nextMonths: React.PropTypes.number,
        multiDate: React.PropTypes.bool,
        minDate: React.PropTypes.any,
        maxDate: React.PropTypes.any,
        defaultDate: React.PropTypes.any,
        highlightedDates: React.PropTypes.any,
        isBlockedDate: React.PropTypes.any,
        onSelectDate: React.PropTypes.any,
        labelText: React.PropTypes.string,
        titleText: React.PropTypes.string,
        isShowDropDowns: React.PropTypes.bool,
        selectedClass: React.PropTypes.string,
        defaultDisplayMonthDate: React.PropTypes.any,
        defaultOpen: React.PropTypes.any,
        validations: React.PropTypes.any,
        customClass: React.PropTypes.string,
        format: React.PropTypes.string,
        displayCalendarHandle: React.PropTypes.bool,
        isCloseOnOutSideClickAndScroll: React.PropTypes.bool
    };
    return Calendar;
}(React.Component));
export default Calendar
