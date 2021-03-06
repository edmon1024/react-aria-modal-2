'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var FocusTrap = require('focus-trap-react');
var displace = require('react-displace');

var Modal = function (_React$Component) {
  _inherits(Modal, _React$Component);

  function Modal() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Modal);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Modal.__proto__ || Object.getPrototypeOf(Modal)).call.apply(_ref, [this].concat(args))), _this), _this.getApplicationNode = function () {
      if (_this.props.getApplicationNode) return _this.props.getApplicationNode();
      return _this.props.applicationNode;
    }, _this.checkUnderlayClick = function (event) {
      if (_this.dialogNode && _this.dialogNode.contains(event.target)) return;
      _this.exit();
    }, _this.checkDocumentKeyDown = function (event) {
      if (event.key === 'Escape' || event.key === 'Esc' || event.keyCode === 27) {
        _this.exit();
      }
    }, _this.exit = function () {
      if (_this.props.onExit) {
        _this.props.onExit();
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Modal, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      if (!this.props.titleText && !this.props.titleId) {
        throw new Error('react-aria-modal instances should have a `titleText` or `titleId`');
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var props = this.props;
      if (props.onEnter) {
        props.onEnter();
      }

      // Timeout to ensure this happens *after* focus has moved
      var applicationNode = this.getApplicationNode();
      setTimeout(function () {
        if (applicationNode) {
          applicationNode.setAttribute('aria-hidden', 'true');
        }
      }, 0);

      if (props.escapeExits) {
        document.addEventListener('keydown', this.checkDocumentKeyDown);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var applicationNode = this.getApplicationNode();
      if (applicationNode) {
        applicationNode.setAttribute('aria-hidden', 'false');
      }
      document.removeEventListener('keydown', this.checkDocumentKeyDown);
    }
  }, {
    key: 'render',
    value: function render() {
      var props = this.props;

      var style = {};
      if (props.includeDefaultStyles) {
        style = {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1050,
          overflowX: 'hidden',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          textAlign: 'center'
        };

        if (props.underlayColor) {
          style.background = props.underlayColor;
        }

        if (props.underlayClickExits) {
          style.cursor = 'pointer';
        }
      }

      if (props.underlayStyle) {
        for (var key in props.underlayStyle) {
          if (!props.underlayStyle.hasOwnProperty(key)) continue;
          style[key] = props.underlayStyle[key];
        }
      }

      var underlayProps = {
        className: props.underlayClass,
        style: style
      };

      if (props.underlayClickExits) {
        underlayProps.onClick = this.checkUnderlayClick;
      }

      for (var prop in this.props.underlayProps) {
        underlayProps[prop] = this.props.underlayProps[prop];
      }

      var verticalCenterStyle = {};
      if (props.includeDefaultStyles) {
        verticalCenterStyle = {
          display: 'inline-block',
          height: '100%',
          verticalAlign: 'middle'
        };
      }

      var verticalCenterHelperProps = {
        key: 'a',
        style: verticalCenterStyle
      };

      var dialogStyle = {};
      if (props.includeDefaultStyles) {
        dialogStyle = {
          display: 'inline-block',
          textAlign: 'left',
          top: 0,
          maxWidth: '100%',
          cursor: 'default',
          outline: props.focusDialog ? 0 : null
        };

        if (props.verticallyCenter) {
          dialogStyle.verticalAlign = 'middle';
          dialogStyle.top = 0;
        }
      }

      if (props.dialogStyle) {
        for (var _key2 in props.dialogStyle) {
          if (!props.dialogStyle.hasOwnProperty(_key2)) continue;
          dialogStyle[_key2] = props.dialogStyle[_key2];
        }
      }

      var dialogProps = {
        key: 'b',
        ref: function (el) {
          this.dialogNode = el;
        }.bind(this),
        role: props.alert ? 'alertdialog' : 'dialog',
        id: props.dialogId,
        className: props.dialogClass,
        style: dialogStyle
      };
      if (props.titleId) {
        dialogProps['aria-labelledby'] = props.titleId;
      } else if (props.titleText) {
        dialogProps['aria-label'] = props.titleText;
      }
      if (props.focusDialog) {
        dialogProps.tabIndex = '-1';
      }

      // Apply data- and aria- attributes passed as props
      for (var _key3 in props) {
        if (/^(data-|aria-)/.test(_key3)) {
          dialogProps[_key3] = props[_key3];
        }
      }

      var childrenArray = [React.createElement('div', dialogProps, props.children)];

      if (props.verticallyCenter) {
        childrenArray.unshift(React.createElement('div', verticalCenterHelperProps));
      }

      var focusTrapOptions = props.focusTrapOptions || {};
      if (props.focusDialog || props.initialFocus) {
        focusTrapOptions.initialFocus = props.focusDialog ? '#' + this.props.dialogId : props.initialFocus;
      }
      focusTrapOptions.escapeDeactivates = props.escapeExits;

      return React.createElement(FocusTrap, {
        focusTrapOptions: focusTrapOptions,
        paused: props.focusTrapPaused
      }, React.createElement('div', underlayProps, childrenArray));
    }
  }]);

  return Modal;
}(React.Component);

Modal.defaultProps = {
  underlayProps: {},
  dialogId: 'react-aria-modal-dialog',
  underlayClickExits: true,
  escapeExits: true,
  underlayColor: 'rgba(0,0,0,0.5)',
  includeDefaultStyles: true,
  focusTrapPaused: false,
  scrollDisabled: true
};


var DisplacedModal = displace(Modal);

DisplacedModal.renderTo = function (input) {
  return displace(Modal, { renderTo: input });
};

module.exports = DisplacedModal;