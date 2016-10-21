"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var ReactDOM = require('react-dom');
var OutsideClickHandler = require('./OnClickHandler');
var Modal = (function (_super) {
    __extends(Modal, _super);
    function Modal(props) {
        _super.call(this, props);
        var isOpen = false;
        if (props.isOpen != undefined) {
            isOpen = props.isOpen;
        }
        this.state = {
            isOpen: isOpen
        };
    }
    Modal.prototype.componentWillReceiveProps = function (nextProps) {
        var isOpen = false;
        if (nextProps.isOpen != undefined) {
            isOpen = nextProps.isOpen;
        }
        this.setState({
            isOpen: isOpen
        });
    };
    Modal.prototype.componentDidMount = function () {
        var _this = this;
        if (this.props.isCloseOnOutSideClick)
            this.clickOutsideHandler = new OutsideClickHandler(ReactDOM.findDOMNode(this.refs['Modal']), function () {
                _this.handleClose(true);
            });
        if (this.props.isCloseOnEscape)
            window.addEventListener('keydown', this.handleKeyPress.bind(this));
        if (this.props.type !== 'popup' && !this.props.isMobileDevice && TweenMax) {
            TweenMax.from(this.refs['modalContent'], 1, { y: 200, opacity: 0, ease: Elastic.easeOut.config(1, 0.5), force3D: true }, 0.2);
        }
        if (this.props.isPreventScrolling) {
            var element = document.body;
            //if(this.state.isOpen || this.props.isOpen)
            element.classList.add("modal-open");
        }
    };
    Modal.prototype.componentWillUnmount = function () {
        if (this.clickOutsideHandler)
            this.clickOutsideHandler.dispose();
        window.removeEventListener('keydown', this.handleKeyPress.bind(this));
        var element = document.body;
        element.classList.remove("modal-open");
    };
    Modal.prototype.componentWillUpdate = function (nextProps, nextState) {
        var element = document.body;
        if (nextProps.isOpen == true && this.props.isPreventScrolling) {
            element.classList.add("modal-open");
        }
        else {
            element.classList.remove("modal-open");
        }
    };
    Modal.prototype.handleKeyPress = function (event) {
        //escape key
        if (this.refs['Modal'] && event.keyCode == 27 && this.props.isCloseOnEscape) {
            this.handleClose();
        }
    };
    Modal.prototype.handleClose = function (isOutSideClick) {
        if (isOutSideClick === void 0) { isOutSideClick = false; }
        if (this.refs['Modal'] && (!isOutSideClick || (isOutSideClick && this.props.isCloseOnOutSideClick))) {
            this.setState({
                isOpen: false
            }, function () {
                if (this.props.onClose) {
                    this.props.onClose();
                }
            });
        }
    };
    Modal.prototype.render = function () {
        return (<div ref='Modal'>
				<div ref='modalBg' className={"cf-modal " + (this.props.type == 'popup' ? 'cf-modal--popup ' : '') + (this.state.isOpen ? 'reveal ' : '') + (this.props.customParentClass ? this.props.customParentClass : '')}>
					<div ref='modalContent' className={"cf-modal__content " + (this.props.customClass ? this.props.customClass : '') + ' ' + (this.props.size)}>
						{this.props.isShowCloseIcon == true ? <div className='cf-modal__close' onClick={this.handleClose.bind(this, false)}></div> : null}
						{this.props.header ? <div className={this.props.customHeaderClass}>{this.props.header}</div> : null}
						{this.props.children}
						{this.props.footer ? <div className={this.props.customFooterClass}>{this.props.footer}</div> : null}
					</div>
				</div>
			</div>);
    };
    Modal.defaultProps = {
        isOpen: false,
        customClass: '',
        size: 'small',
        isCloseOnOutSideClick: true,
        isCloseOnEscape: true,
        customHeaderClass: '',
        customFooterClass: '',
        isShowCloseIcon: false,
        isPreventScrolling: true
    };
    Modal.propTypes = {
        isOpen: React.PropTypes.bool,
        customClass: React.PropTypes.string,
        size: React.PropTypes.string,
        onClose: React.PropTypes.func,
        isCloseOnOutSideClick: React.PropTypes.bool,
        isCloseOnEscape: React.PropTypes.bool,
        header: React.PropTypes.any,
        footer: React.PropTypes.any,
        customHeaderClass: React.PropTypes.string,
        customFooterClass: React.PropTypes.string,
        isShowCloseIcon: React.PropTypes.bool,
        isPreventScrolling: React.PropTypes.bool,
        isMobileDevice: React.PropTypes.bool
    };
    return Modal;
}(React.Component));
export default Modal
