var React = require('react');
var PropTypes = React.PropTypes;
/*
 * Original author: Irakli Gozalishvili (Gozala)
 * Taken from: https://github.com/Gozala/firefox.html/blob/react/js/element.js
 * Converted to JS5 using babel and adjusted to be used without modules.
 * License: MPL (Mozilla Public License v. 2.0, http://mozilla.org/mpl/2.0/).
 */

var isPreMountHook = function (field) { return field && field.mount; };
var isPostMountHook = function (field) { return field && field.mounted; };
var isUnmountHook = function (field) { return field && field.unmount; };
var isUpdateHook = function (field) { return field && field.write; };
var isConstractorHook = function (field) { return field && field.construct; };

export default function Reactify(name) {
  var fields = arguments[1] === undefined ? {} : arguments[1];

  // In react you can actually define custom HTML element it's
  // just set of attributes you'll be able to set will be limited
  // to React's white list. To workaround that we define React
  // custom HTML element factory & custom react component that
  // will render that HTML element via custom factory.
  var Node = React.createFactory(name);
  var keys = Object.keys(fields);
  var mountHooks = keys.filter(key => isPreMountHook(fields[key]));
  var mountedHooks = keys.filter(key => isPostMountHook(fields[key]));
  var unmountHooks = keys.filter(key => isUnmountHook(fields[key]));
  var updateHooks = keys.filter(key => isUpdateHook(fields[key]));
  var constractorHooks = keys.filter(key => isConstractorHook(fields[key]));

  // React component is a wrapper around the our custom HTML Node
  // who's whole purpose is to update attributes of the node that
  // are not recognized by react.
  var NodeWrapper = React.createClass({
    displayName: 'html:' + name,
    getInitialState: () => {
      var state = {};
      keys.forEach(key => {
        state[key] = fields[key];
      });
      constractorHooks.forEach(key => {
        state[key] = fields[key].construct();
      });
      return state;
    },
    // Reflect attributes not recognized by react.
    componentDidMount: function componentDidMount() {
      var node = this.getDOMNode();
      var present = this.props;
      var hooks = this.state;

      if (mountHooks.length > 0) {
        mountHooks.forEach(key => {
          var hook = hooks[key];
          var value = present[key];
          hook.mount(node, value);
        });

        // Pre mount fields need to be set before node
        // is in the document. Since react does not have
        // an appropriate hook we replace node with itself
        // to trigger desired behavior.
        node.parentNode.replaceChild(node, node);
      }

      mountedHooks.forEach(key => {
        var hook = hooks[key];
        hook.mounted(node, present[key]);
      });
    },
    componentWillUnmount: function componentWillUnmount() {
      var node = this.getDOMNode();
      var hooks = this.state;

      unmountHooks.forEach(key => {
        var hook = hooks[key];
        hook.unmount(node);
      });
    },
    // Reflect attribute changes not recognized by react.
    componentDidUpdate: function componentDidUpdate(past) {
      var node = this.getDOMNode();
      var present = this.props;
      var hooks = this.state;

      updateHooks.forEach(key => {
        var hook = hooks[key];
        hook.write(node, present[key], past[key]);
      });
    },
    // Render renders wrapped HTML node.
    render: function render() {
      return Node(this.props, this.props.children);
    }
  });
  NodeWrapper.propTypes = {
    children: PropTypes.array.isRequired
  };
  return NodeWrapper;
}

// Option can be used to define attribute on the element
// that is set once before element is inserted into a
// document (mounted). Changes to this option are ignored
// & in general use of `Attribute` is preferred, this should
// be reserved only for attributes changes to which aren't picked
// up after node is in the tree.
// Example: Reactify("iframe", { browser: Option("mozbrowser") })
var Option = function (name) {
  if (!(this instanceof Option)) {
    return new Option(name);
  }
  this.name = name;
};
Option.prototype = {
  constructor: Option,
  mount: function mount(node, value) {
    node.setAttribute(this.name, value);
  }
};
Reactify.Option = Option;

// Attribute can be used to define field mapped to a
// DOM attribute with a given `name`. If the field is
// set to `undefined` or `null` attribute is removed
// othrewise it's set to given value.
// Example: Reactify("hbox", {flex: Attribute("flex")})
var Attribute = function (name, writer, force) {
  if (!(this instanceof Attribute)) {
    return new Attribute(name, writer, force);
  }
  this.name = name;
  this.writer = writer;
  this.force = force;
};
Attribute.prototype = {
  constructor: Attribute,
  mounted: function mounted(node, value) {
    if (value !== void 0) {
      node.setAttribute(this.name, value);
    }
  },
  write: function write(node, present, past) {
    if (present !== past || this.force) {
      if (present === void 0 && ! force) {
        node.removeAttribute(this.name);
      } else {
        if (typeof this.writer !== 'function') {
          node.setAttribute(this.name, present);
        } else {
          this.writer(node, present);
        }
      }
    }
  }
};
Reactify.Attribute = Attribute;

// Field can be used to define fields that can't be
// mapped to an attribute in the DOM. Field is defined
// by providing a function that will be invoked target
// `node` `current` value & `past` value and it's supposed
// to reflect changes in the DOM. Note that on initial
// render `past` will be `void(0)`.
//
// Example:
// Reactify("iframe", {focused: (node, current, past) => {
//   if (current) {
//     node.focus()
//   }
// }})
var Field = function (write) {
  if (!(this instanceof Field)) {
    return new Field(write);
  }
  this.write = write;
};
Field.prototype = {
  constructor: Attribute,
  mounted: function mounted(node, value) {
    this.write(node, value, void 0);
  }
};
Reactify.Field = Field;

// Event can be used to define event handler fields, for
// the given event `type`. When event of that type occurs
// event handler assigned to the associated field will be
// invoked. Optionally `read` function can be passed as a
// second argument, in which case event handler will be
// invoked with `read(event)` instead of `event`.
// Example:
// Reactify("iframe", {onTitleChange: Event("mozbrowsertitlechange")})
var Event = function (type, read, capture) {
  var capture = capture === undefined ? false : capture;
  if (!(this instanceof Event)) {
    return new Event(type, read);
  }
  this.type = type;
  this.read = read;
  this.capture = capture;
};
Event.prototype = {
  constructor: Event,
  construct: function construct() {
    return new this.constructor(this.type, this.read, this.capture);
  },
  mounted: function mounted(node, handler) {
    this.handler = handler;
    node.addEventListener(this.type, this, this.capture);
  },
  unmount: function unmount(node) {
    node.removeEventListener(this.type, this, this.capture);
  },
  write: function write(node, present) {
    this.handler = present;
  },
  handleEvent: function handleEvent(event) {
    if (this.handler) {
      var e = this.read ? this.read(event) : event;
      if (e) {
        this.handler(e);
      }
    }
  }
};
Reactify.Event = Event;

// CapturedEvent can be used same as `Event` with a difference
// that events listeners will be added with a capture `true`.
var CapturedEvent = function (type, read) {
  if (!(this instanceof CapturedEvent)) {
    return new Event(type, read, true);
  }
  this.type = type;
  this.read = read;
  this.capture = true;
};
CapturedEvent.prototype = Event.prototype;
Reactify.CapturedEvent = CapturedEvent;
