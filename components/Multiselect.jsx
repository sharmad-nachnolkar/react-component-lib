"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
optionsText: Name of the Key from datasource provided to pickup while displaying text in drop down.
                Not required if you are suplying a custom template through optionsRenderer method
                default value - "key"
optionsValue: Name of the Key from datasource provided to pickup while using as value in drop down.
                Needs to be supplied always else it will search for default value
                default value - "value"
searchKeys : array of strings of keys from datasource on which the drop down has to be searchable
optionsRenderer: Method which the user can supply if he wants to display a custom template in drop down
                    Can return string or JSX
dataSource:  The source of data to populate drop down
multiSelect: Whether multiple dates can be selected
onChange: Event exposed to user. Can specify a callback function which will get fired on
            onChange of drop down. Fires even if same value is selected again and again.
            More like a onSelect event then onChange.
            The function will get the current selected value. Even in case of multiSelect
            it will get the value on click of which the event was trigerred and not the
            entire array.
            To get all values user may use the getValue function
isMobileDevice: sets drop down as modal if device is mobile
*/
var React = require('react');
var ReactDOM = require('react-dom');
var listensToClickOutside = require('./OnClickHandler');
var helpers = require('./helpers');
var isEqual = require('lodash.isequal');
var Validations = require('./validations');
var Modal = require('./Modal');
var OPTIONS_TEXT = 'optionsText';
var OPTIONS_VALUE = 'optionsValue';
var OPTIONS_LABEL = 'optionsLabel';
var SEARCH_KEYS = 'searchKeys';
var OPTIONS_RENDERER = 'optionsRenderer';
var INDEX = "__index__";
var helperObj = new helpers();
var RichMultiSelect = (function (_super) {
    __extends(RichMultiSelect, _super);
    function RichMultiSelect(props) {
        _super.call(this, props);
        var selectedIndices = [];
        selectedIndices = this.getIndicesFromDataSource(this.props);
        /*	var validationArray = this.props.validations;
            var data = (selectedIndices.length>0)? selectedIndices.length : '';
            var validationResult: IValidationResult = ValidationObj.isValid(validationArray, { 'value':data, fieldName:'Select' });
    */
        var filteredData = this.addIndexToDataSource(this.props.dataSource);
        this.state = {
            isOpen: false,
            selectedIndices: selectedIndices,
            filteredData: filteredData,
            highlightedIndex: -1,
            isValid: true,
            validationMsg: '',
            isShowErrors: false
        };
    }
    RichMultiSelect.prototype.componentDidMount = function () {
        var _this = this;
        /*this.clickOutsideHandler = new listensToClickOutside(ReactDOM.findDOMNode(this.refs['RichMultiSelect']), function () { _this.toggleDisplay(true); });
        this.eventHandleKeyPress = this.handleOutSideKeyPress.bind(this);
        window.addEventListener('keydown', this.eventHandleKeyPress);*/
    };
    RichMultiSelect.prototype.componentWillUnmount = function () {
        //this.clickOutsideHandler.dispose();
        //window.removeEventListener('keydown', this.eventHandleKeyPress);
    };
    RichMultiSelect.prototype.handleOutSideKeyPress = function (event) {
        event.keyCode == 27 && this.props.isCloseOnEscape && this.toggleDisplay(true);
    };
    RichMultiSelect.prototype.componentWillReceiveProps = function (nextProps) {
        var selectedIndices = [];
        selectedIndices = this.getIndicesFromDataSource(nextProps);
        var filteredData = this.addIndexToDataSource(nextProps.dataSource);
        //var validationResult: IValidationResult = ValidationObj.isValid(nextProps.validations, { 'value': selectedIndices, 'fieldName': 'Select' })
        this.setState({
            selectedIndices: selectedIndices,
            filteredData: filteredData
        });
    };
    RichMultiSelect.prototype.addIndexToDataSource = function (dataSource) {
        var obj = {};
        var returnData = [];
        for (var i = 0; i < dataSource.length; i++) {
            obj = dataSource[i];
            obj[INDEX] = i;
            returnData.push(JSON.parse(JSON.stringify(obj)));
        }
        return returnData;
    };
    RichMultiSelect.prototype.getIndicesFromDataSource = function (props) {
        var selectedIndices = [];
        var foundIndex;
        if (this.props.multiSelect && props.values) {
            for (var i = 0; i < props.values.length; i++) {
                foundIndex = this.matchValuesInDataSource(props, props.values[i]);
                if (foundIndex > -1) {
                    selectedIndices.push(foundIndex);
                }
            }
        }
        else {
            foundIndex = this.matchValuesInDataSource(props, props.values);
            if (foundIndex > -1) {
                selectedIndices = [foundIndex];
            }
        }
        return selectedIndices;
    };
    RichMultiSelect.prototype.getValueFromDataSource = function (props, propertyName, option) {
        var value;
        if (typeof (option) != "object") {
            value = option;
        }
        else {
            value = helperObj.getPropertyValue(option, props, propertyName);
        }
        return value;
    };
    RichMultiSelect.prototype.matchValuesInDataSource = function (props, value) {
        var loopValue;
        var foundIndex = -1;
        for (var j = 0; j < props.dataSource.length; j++) {
            loopValue = this.getValueFromDataSource(props, OPTIONS_VALUE, props.dataSource[j]);
            if (isEqual(loopValue, value)) {
                foundIndex = j;
                break;
            }
        }
        return foundIndex;
    };
    RichMultiSelect.prototype.getValues = function () {
        var selectedValues = [];
        for (var _i = 0, _a = this.state.selectedIndices; _i < _a.length; _i++) {
            var index = _a[_i];
            selectedValues.push(this.getValueFromDataSource(this.props, OPTIONS_VALUE, this.props.dataSource[index]));
        }
        if (this.props.multiSelect) {
            return selectedValues;
        }
        else {
            return selectedValues[0];
        }
    };
    RichMultiSelect.prototype.getSelectedLabels = function () {
        var selectedLabels = [];
        for (var _i = 0, _a = this.state.selectedIndices; _i < _a.length; _i++) {
            var index = _a[_i];
            selectedLabels.push(this.getValueFromDataSource(this.props, OPTIONS_TEXT, this.props.dataSource[index]));
        }
        if (this.props.multiSelect) {
            return selectedLabels;
        }
        else {
            return selectedLabels[0];
        }
    };
    RichMultiSelect.prototype.getSelectedIndices = function () {
        if (this.props.multiSelect) {
            return this.state.selectedIndices;
        }
        else {
            if (this.state.selectedIndices.length > 0) {
                return this.state.selectedIndices[0];
            }
            else {
                return -1;
            }
        }
    };
    RichMultiSelect.prototype.getData = function (isFiltered) {
        if (isFiltered === void 0) { isFiltered = false; }
        return isFiltered == true ? this.state.filteredData : this.props.dataSource;
    };
    RichMultiSelect.prototype.onClose = function () {
        if (this.props.onClose) {
            this.props.onClose();
        }
    };
    RichMultiSelect.prototype.toggleDisplay = function (isOnlyClose) {
        var _this = this;
        if (isOnlyClose === void 0) { isOnlyClose = false; }
        if (isOnlyClose && !this.state.isOpen)
            return;
        var isOpen = isOnlyClose == true || this.props.disabled ? false : !this.state.isOpen;
        var prevOpenState = this.state.isOpen;
        this.setState({
            isOpen: isOpen,
            highlightedIndex: -1
        }, function () {
            if (isOpen == true) {
                var searchBoxNode = ReactDOM.findDOMNode(_this.refs['SearchBox']);
                !_this.props.isMobileDevice && searchBoxNode.focus();
                !prevOpenState && _this.props.onOpen && _this.props.onOpen();
            }
            if (isOpen == false) {
                _this.onClose();
            }
        });
    };
    RichMultiSelect.prototype.openDropDown = function () {
        var _this = this;
        var isOpen = this.props.disabled ? false : true;
        var prevOpenState = this.state.isOpen;
        this.setState({
            isOpen: isOpen,
            highlightedIndex: -1
        }, function () {
            var searchBoxNode = ReactDOM.findDOMNode(_this.refs['SearchBox']);
            if (searchBoxNode && !_this.props.isMobileDevice)
                searchBoxNode.focus();
            !prevOpenState && _this.props.onOpen && _this.props.onOpen();
        });
    };
    RichMultiSelect.prototype.clearValue = function (index, event) {
        var _this = this;
        var tempIndices;
        if (index == -1) {
            tempIndices = [];
        }
        else {
            tempIndices = this.state.selectedIndices;
            tempIndices.splice(index, 1);
        }
        /*var validationArray = this.props.validations;
        var data = (tempIndices.length>0)? tempIndices.length : '';
        var validationResult: IValidationResult = ValidationObj.isValid(validationArray, { 'value':data, 'fieldName':'Select' });
        */
        this.setState({
            selectedIndices: tempIndices
        }, function () {
            _this.isValid(false);
            // User defined function to do something on Onchange
            _this.props.onChange(null, -1);
        });
        event.preventDefault();
        event.stopPropagation();
    };
    RichMultiSelect.prototype.isValid = function (isShowErrors) {
        if (isShowErrors === void 0) { isShowErrors = false; }
        var validationObj;
        var values = [];
        for (var i = 0; i < this.state.selectedIndices.length; i++) {
            var option = this.props.dataSource[this.state.selectedIndices[i]];
            if (typeof (option) == "object") {
                option = option[this.props.optionsValue];
            }
            values.push(option);
        }
        //this is when state is not yet filled and isValid is called
        /*if(this.state.selectedIndices == undefined)
            values = this.props.values*/
        validationObj = Validations.validationHandler(values, this.props.validations);
        this.setState({
            isShowErrors: isShowErrors,
            isValid: validationObj['isValid'],
            validationMsg: validationObj['message']
        });
        return validationObj.isValid;
    };
    RichMultiSelect.prototype.setValue = function (option) {
        var _this = this;
        var selectedIndices;
        var selectedIndex;
        var loopValue;
        var currIndex;
        var currValue;
        currValue = this.getValueFromDataSource(this.props, OPTIONS_VALUE, option);
        for (var i = 0; i < this.props.dataSource.length; i++) {
            loopValue = this.getValueFromDataSource(this.props, OPTIONS_VALUE, this.props.dataSource[i]);
            if (isEqual(loopValue, currValue)) {
                currIndex = i;
                break;
            }
        }
        if (this.props.multiSelect) {
            selectedIndices = this.state.selectedIndices;
            selectedIndex = selectedIndices.indexOf(currIndex);
            if (selectedIndex > -1) {
                selectedIndices.splice(selectedIndex, 1);
            }
            else {
                selectedIndices.push(currIndex);
            }
        }
        else {
            selectedIndices = [];
            selectedIndices.push(currIndex);
        }
        /*var validationArray = this.props.validations;
        var data = (selectedIndices.length>0)? selectedIndices.length : '';
        var validationResult: IValidationResult = ValidationObj.isValid(validationArray, { 'value':data, 'fieldName':'Select' });
*/
        this.setState({
            selectedIndices: selectedIndices,
            isOpen: this.props.multiSelect,
            /*isValid: validationResult,
            showErrors:false,*/
            highlightedIndex: -1
        }, function () {
            _this.isValid(false);
            // User defined function to do something on Onchange
            _this.props.onChange(option, currIndex);
        });
        //clearing search box after value has been set
        if (this.refs['SearchBox'])
            this.refs['SearchBox']["value"] = "";
    };
    RichMultiSelect.prototype.search = function (event) {
        var searchQuery = event.target.value;
        var allOptions = this.props.dataSource;
        var searchedList = [];
        var optionsText;
        var self = this;
        var isCheckOptionsText = true;
        //searchedList = this.props.dataSource.map(function(option :any, index:number){
        var returnObj = {};
        for (var i = 0; i < this.props.dataSource.length; i++) {
            returnObj = JSON.parse(JSON.stringify(this.props.dataSource[i]));
            //returnObj[this.props.optionsText] = this.props.dataSource[i][this.props.optionsText]
            //returnObj[this.props.optionsValue] =  this.props.dataSource[i][this.props.optionsValue]
            returnObj[INDEX] = i;
            try {
                optionsText = self.getValueFromDataSource(self.props, OPTIONS_TEXT, this.props.dataSource[i]);
            }
            catch (e) {
                isCheckOptionsText = false;
            }
            if (isCheckOptionsText && optionsText.toString().toUpperCase().indexOf(searchQuery.toUpperCase()) >= 0) {
                searchedList.push(JSON.parse(JSON.stringify(returnObj)));
            }
            else if (isCheckOptionsText && optionsText.toString().toUpperCase().replace(/[^a-zA-Z0-9]/g, '').indexOf(searchQuery.toUpperCase()) >= 0) {
                searchedList.push(JSON.parse(JSON.stringify(returnObj)));
            }
            else {
                if (self.props.hasOwnProperty(SEARCH_KEYS) && self.props[SEARCH_KEYS].constructor === Array) {
                    for (var _i = 0, _a = self.props[SEARCH_KEYS]; _i < _a.length; _i++) {
                        var key = _a[_i];
                        if (typeof (key) != 'object') {
                            if (this.props.dataSource[i].hasOwnProperty(key) && this.props.dataSource[i][key].toString().toUpperCase().indexOf(searchQuery.toUpperCase()) >= 0) {
                                searchedList.push(JSON.parse(JSON.stringify(returnObj)));
                            }
                        }
                        else {
                            throw new Error('searchKeys cannot be an object. Invalid value.');
                        }
                    }
                }
            }
        }
        this.setState({
            filteredData: searchedList,
            isOpen: true,
            highlightedIndex: -1
        });
    };
    RichMultiSelect.prototype.populateDropDown = function (option, filteredIndex, actualIndex) {
        var currentValue;
        var checkBoxStyle = { visibility: 'hidden' };
        //var currentIndex = -1
        var currentValue = helperObj.getPropertyValue(option, this.props, OPTIONS_VALUE);
        //var loopValue
        /*for (var i = 0; i < this.props.dataSource.length; i++){
            loopValue = this.getValueFromDataSource(this.props, OPTIONS_VALUE, this.props.dataSource[i])
            if(isEqual(loopValue,currentValue)){
                currentIndex = i
            }
        }*/
        if (this.state.selectedIndices.indexOf(actualIndex) > -1 && this.state.isOpen && this.props.multiSelect) {
            checkBoxStyle = { visibility: 'visible' };
        }
        var optionTemplate = this.props.optionsRenderer(option, this.props);
        var group = this.props.defaultGroupName;
        if (this.props.groupBy == undefined || this.props.groupBy == "" || typeof (option) != "object") {
            group = "";
        }
        else if (typeof (option) == "object" && option.hasOwnProperty(this.props.groupBy)) {
            group = option[this.props.groupBy];
        }
        var isSelected = this.state.selectedIndices.indexOf(actualIndex) > -1 ? true : false;
        return ({
            'html': (<span className={'w--multi_select_dd_element ' + (isSelected == true ? this.props.selectedElementClass : '') + (this.state.highlightedIndex == filteredIndex ? ' ' + 'w--highlight_dd_option' : '')} ref={'dropDownListElement_' + filteredIndex} key={'dropDownListElement_' + filteredIndex} onClick={this.setValue.bind(this, option)}>
										{optionTemplate}
										</span>),
            'group': group
        });
    };
    RichMultiSelect.prototype.isScrolledIntoView = function (el, parent) {
        var elemTop = el.getBoundingClientRect().top;
        var elemBottom = el.getBoundingClientRect().bottom;
        var parentTop = parent.getBoundingClientRect().top;
        var parentBottom = parent.getBoundingClientRect().bottom;
        var buffer = 5;
        var scroll = 0;
        if (elemTop < parentTop) {
            scroll = (Math.abs(elemTop - parentTop) + buffer) * -1;
        }
        else if (elemBottom > parentBottom) {
            scroll = (Math.abs(parentBottom - elemBottom) + buffer);
        }
        //var isVisible = (elemTop >= 0) && (elemBottom <= parent.innerHeight);
        return scroll;
    };
    RichMultiSelect.prototype.handleKeyPress = function (event) {
        //event.preventDefault()
        var highlightedIndex = this.state.highlightedIndex;
        //pressing up or down arrow keys to scroll through the elements
        if (event.keyCode == 38 || event.keyCode == 40) {
            //prventing scroll on browser by preventing
            // this is to be done on keyCode 38 and 40 and not other since it will prevent the preessing of other keys
            event.preventDefault();
            if (event.keyCode == 38) {
                if (highlightedIndex <= 0) {
                    highlightedIndex = this.state.filteredData.length - 1;
                }
                else {
                    highlightedIndex = highlightedIndex - 1;
                }
            }
            else if (event.keyCode == 40) {
                if (highlightedIndex >= this.state.filteredData.length - 1) {
                    highlightedIndex = 0;
                }
                else {
                    highlightedIndex = highlightedIndex + 1;
                }
            }
            this.setState({
                highlightedIndex: highlightedIndex
            });
            var dropDownListElementNode = ReactDOM.findDOMNode(this.refs['dropDownListElement_' + highlightedIndex]);
            var dropDownListNode = ReactDOM.findDOMNode(this.refs['DropDownList']);
            //dropDownListNode.scrollBy(0, 30)
            if (dropDownListElementNode && dropDownListNode) {
                if (this.isScrolledIntoView(dropDownListElementNode, dropDownListNode) != 0) {
                    dropDownListElementNode.scrollIntoView(false);
                }
            }
        }
        else if (event.keyCode == 13 && highlightedIndex > -1) {
            this.setValue(this.state.filteredData[highlightedIndex]);
            this.setState({
                highlightedIndex: -1
            });
            this.toggleDisplay();
        }
        else if (event.keyCode == 13) {
            this.setValue(this.state.filteredData[0]);
            this.setState({
                highlightedIndex: -1
            });
            this.toggleDisplay();
        }
    };
    RichMultiSelect.prototype.showErrors = function () {
        if (!this.state.isValid) {
            this.setState({
                isShowErrors: true
            });
        }
    };
    RichMultiSelect.prototype.handleOpenOnKeyPress = function (event) {
        if (event.keyCode == 13)
            this.toggleDisplay();
    };
    RichMultiSelect.prototype.handleMultiSelectFocus = function (isClose) {
        if (isClose === void 0) { isClose = false; }
        this.toggleDisplay(isClose);
    };
    RichMultiSelect.prototype.render = function () {
        //styling and classes
        var dropDownListSyle = { maxHeight: '100px', overflowY: 'scroll', width: '100px' };
        var dropDownContentStyle = { visibility: this.state.isOpen == true ? 'visible' : 'hidden' };
        var caretUpStyle = { visibility: this.state.isOpen == true ? 'visible' : 'hidden' };
        var caretDownStyle = { visibility: this.state.isOpen == true ? 'hidden' : 'visible' };
        var optionCancelStyle = { display: this.props.multiSelect == true || this.props.showClear ? 'inline-block' : 'none' };
        var cancelAllOptionsStyle = { display: this.props.multiSelect == true && this.state.selectedIndices.length > 1 ? 'inline-block' : 'none' };
        var labelClass = (this.props.labelText != "" && this.state.selectedIndices.length > 0) ? 'label_show' : 'label_hide';
        var labelTextStyle = { display: this.props.labelText != "" && this.state.selectedIndices.length > 0 ? 'inherit' : 'none' };
        var searchBoxStyle = { display: this.props.isSearchable == true ? 'inherit' : 'none' };
        //styling in case of multiselect
        var itemClass = this.props.multiSelect == true ? 'select-item' : '';
        var self = this;
        var selectedLabelsArray = [];
        for (var _i = 0, _a = this.state.selectedIndices; _i < _a.length; _i++) {
            var index = _a[_i];
            selectedLabelsArray.push(this.props.optionsRenderer(this.props.dataSource[index], this.props, this.props.optionsLabel ? OPTIONS_LABEL : OPTIONS_TEXT));
        }
        var selectedLabels = selectedLabelsArray.length == 0 ?
            <div className='dd_placeholder'>{this.props.placeHolder}</div> :
            (selectedLabelsArray.map(function (option, i) {
                return (<span className={itemClass} key={'SelectedOption_' + i}>
											{option}
											<span className='select-item-icon' style={optionCancelStyle} onClick={self.clearValue.bind(self, i)}> x</span>
										</span>);
            }));
        /*	var dropDownRenderData = this.state.filteredData.map(function(option: any, i: number) {
                if(this.props.groupBy!=undefined && this.props.groupBy!=""){
                    if(option.hasOwnProperty(this.props.groupBy) && groups.indexOf(option[this.props.groupBy]) == -1){
                        groups.push(option[this.props.groupBy])
                    }
                }
                if(this.props.maxDisplay && number >= this.props.maxDisplay)
                    break
                return (self.populateDropDown(option, i, option[INDEX]))
            },this)*/
        var groups = [];
        var dropDownRenderData = [];
        for (var i = 0; i < this.state.filteredData.length; i++) {
            if (this.props.groupBy != undefined && this.props.groupBy != "") {
                if (this.state.filteredData[i].hasOwnProperty(this.props.groupBy) && groups.indexOf(this.state.filteredData[i][this.props.groupBy]) == -1) {
                    groups.push(this.state.filteredData[i][this.props.groupBy]);
                }
            }
            if (this.props.maxDisplay && i >= this.props.maxDisplay)
                break;
            dropDownRenderData.push((self.populateDropDown(this.state.filteredData[i], i, this.state.filteredData[i][INDEX])));
        }
        if (this.props.groupBy != undefined && this.props.groupBy != "" && this.props.groupPriorities) {
            //here order is important.. ie. groups.concat(this.props.groupPriorities) will not give the same output
            groups = helperObj.getUniqueArray(this.props.groupPriorities.concat(groups));
        }
        //if default group is not already present then push it
        if (this.props.groupBy != undefined && this.props.groupBy != "" && groups.indexOf(this.props.defaultGroupName) == -1) {
            groups.push(this.props.defaultGroupName);
        }
        var renderedDropDown = [];
        var isGroupDivPushed;
        if (this.props.groupBy != undefined && this.props.groupBy != "") {
            for (var i = 0; i < groups.length; i++) {
                //if visible groups prop is defined and current group is not part of it then
                //continue to next group
                if (this.props.visibleGroups && this.props.visibleGroups.length > 0
                    && this.props.visibleGroups.indexOf(groups[i]) == -1
                    && (this.refs['SearchBox'] == undefined || this.refs['SearchBox']["value"] == undefined || this.refs['SearchBox']["value"] == "")) {
                    continue;
                }
                isGroupDivPushed = false;
                for (var j = 0; j < dropDownRenderData.length; j++) {
                    if (dropDownRenderData[j].group == groups[i]) {
                        if (!isGroupDivPushed) {
                            renderedDropDown.push(<div key={'Group-' + groups[i]} className="w--multi_group_header"> <span className="hb">{groups[i]}</span></div>);
                            isGroupDivPushed = true;
                        }
                        renderedDropDown.push(dropDownRenderData[j].html);
                    }
                }
            }
        }
        else {
            for (var i = 0; i < dropDownRenderData.length; i++) {
                renderedDropDown.push(dropDownRenderData[i].html);
            }
        }
        var container = <div className={"w--multi_select_dd " + (this.state.isOpen ? 'reveal ' : '')}>
			{this.props.header ? <div className='w--multi_select_header'>{this.props.header}</div> : null}
			<div className="w--multi_select_keyword" style={searchBoxStyle}>
				<input ref='SearchBox' type="text" placeholder="Search..." onChange={this.search.bind(this)} onKeyDown={this.handleKeyPress.bind(this)}/>
			</div>
			<div className={"w--multi_select_options" + (this.props.isMobileDevice ? ' touch-scrolling' : '')} ref='DropDownList'>
				{renderedDropDown.length ? renderedDropDown : <div className="w--multi_select_dd_element">No results found</div>}
				{this.props.footer ? <div className='w--multi_select_footer'>{this.props.footer}</div> : null}
			</div>
		</div>;
        /*onFocus={this.openDropDown.bind(this)} onBlur={this.handleMultiSelectFocus.bind(this, true)} */
        return (<div ref='RichMultiSelect' className={"w--multi_select " + (this.props.customClass ? this.props.customClass : '') + ' ' + (this.props.disabled == true ? 'disabled' : '')} tabIndex={0} onKeyDown={this.handleKeyPress.bind(this)} onFocus={this.props.isMobileDevice ? null : this.openDropDown.bind(this)} onBlur={this.props.isMobileDevice ? null : this.handleMultiSelectFocus.bind(this, true)}>
				<div className="w--multi_select_handle" onClick={this.openDropDown.bind(this)}>
					<div className={labelClass}>{this.props.labelText}</div>
					<div className='selected_items'>{selectedLabels}
					{this.props.multiSelect == true && this.state.selectedIndices.length > 1 ?
            <span className="remove-all" onClick={this.clearValue.bind(this, -1)} style={cancelAllOptionsStyle}> X </span> : null}
					</div>
					<span className="w--multi_select_arrow"></span>
				</div>

				{this.state.isOpen && this.props.isMobileDevice ?
            <Modal onClose={this.toggleDisplay.bind(this, true)} isOpen={this.state.isOpen} isCloseOnOutSideClick={false} isCloseOnEscape={false} isShowCloseIcon={true} isPreventScrolling={false} customParentClass="cf-modal--dialogue dropdown-modal">
						{container}
					</Modal> : container}
			
			
			{this.state.isShowErrors && !this.state.isValid ? <p className='fs w--error'>{this.state.validationMsg}</p> : ''}
		</div>);
    };
    RichMultiSelect.defaultProps = {
        ref: '',
        showClear: false,
        optionsText: 'key',
        optionsValue: 'value',
        optionsLabel: undefined,
        multiSelect: false,
        searchKeys: [],
        placeHolder: 'Select an option...',
        labelText: 'Selected Value',
        dropDownDisplayBoxStyle: {
            colour: 'grey'
        },
        containerStyle: {
            border: '1px solid blue',
            width: 'auto',
            height: '200px',
            overflowY: 'auto',
            cursor: 'pointer'
        },
        optionsRenderer: function (data, configObject, propField) {
            if (propField === void 0) { propField = OPTIONS_TEXT; }
            return helperObj.getPropertyValue(data, configObject, propField);
        },
        dataSource: [],
        onChange: function (option, index) {
            // User defined function to fire on onChange event
        },
        isSearchable: true,
        validations: [],
        groupPriorities: [],
        defaultGroupName: 'Other',
        header: '',
        footer: '',
        visibleGroups: [],
        disabled: false,
        isCloseOnEscape: true,
        selectedElementClass: 'selected',
        isMobileDevice: false
    };
    RichMultiSelect.propTypes = {
        ref: React.PropTypes.string,
        optionsText: React.PropTypes.string,
        optionsValue: React.PropTypes.any,
        optionsLabel: React.PropTypes.any,
        searchKeys: helperObj.validateStringArray,
        placeHolder: React.PropTypes.string,
        dropDownDisplayBoxStyle: React.PropTypes.any,
        containerStyle: React.PropTypes.any,
        optionsRenderer: React.PropTypes.any,
        dataSource: React.PropTypes.any.isRequired,
        multiSelect: React.PropTypes.bool,
        onChange: React.PropTypes.any,
        values: React.PropTypes.any,
        isSearchable: React.PropTypes.bool,
        validations: React.PropTypes.any,
        groupBy: React.PropTypes.string,
        groupPriorities: helperObj.validateStringArray,
        defaultGroupName: React.PropTypes.string,
        labelText: React.PropTypes.string,
        header: React.PropTypes.any,
        footer: React.PropTypes.any,
        visibleGroups: React.PropTypes.any,
        disabled: React.PropTypes.bool,
        isCloseOnEscape: React.PropTypes.bool,
        selectedElementClass: React.PropTypes.string,
        isMobileDevice: React.PropTypes.bool,
        maxDisplay: React.PropTypes.number
    };
    return RichMultiSelect;
}(React.Component));
export default RichMultiSelect
