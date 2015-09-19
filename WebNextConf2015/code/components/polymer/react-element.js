/*
 * Original author: Irakli Gozalishvili (Gozala)
 * Taken from: https://github.com/Gozala/firefox.html/blob/react/js/element.js
 * Converted to JS5 using babel and adjusted to be used without modules.
 * License: MPL (Mozilla Public License v. 2.0, http://mozilla.org/mpl/2.0/).
 */

'use strict';

var ReactElement = (function () {
  var isPreMountHook = function isPreMountHook(field) {
    return field && field.mount;
  };
  var isPostMountHook = function isPostMountHook(field) {
    return field && field.mounted;
  };
  var isUnmountHook = function isUnmountHook(field) {
    return field && field.unmount;
  };
  var isUpdateHook = function isUpdateHook(field) {
    return field && field.write;
  };
  var isConstractorHook = function isConstractorHook(field) {
    return field && field.construct;
  };

  var result = function result(name) {
    var fields = arguments[1] === undefined ? {} : arguments[1];

    // In react you can actually define custom HTML element it's
    // just set of attributes you'll be able to set will be limited
    // to React's white list. To workaround that we define React
    // custom HTML element factory & custom react component that
    // will render that HTML element via custom factory.
    var Node = React.createFactory(name);
    var keys = Object.keys(fields);
    var mountHooks = keys.filter(function (key) {

      if (isPreMountHook(fields[key])) {
        console.log(' *** element ' + name + ': isPreMountHook ' + key);
      }

      return isPreMountHook(fields[key]);
    });
    var mountedHooks = keys.filter(function (key) {

      if (isPostMountHook(fields[key])) {
        console.log(' *** element ' + name + ': isPostMountHook ' + key);
      }

      return isPostMountHook(fields[key]);
    });
    var unmountHooks = keys.filter(function (key) {

      if (isUnmountHook(fields[key])) {
        console.log(' *** element ' + name + ': isUnmountHook ' + key);
      }

      return isUnmountHook(fields[key]);
    });
    var updateHooks = keys.filter(function (key) {

      if (isUpdateHook(fields[key])) {
        console.log(' *** element ' + name + ': isUpdateHook ' + key);
      }

      return isUpdateHook(fields[key]);
    });
    var constractorHooks = keys.filter(function (key) {

      if (isConstractorHook(fields[key])) {
        console.log(' *** element ' + name + ': isConstractorHook ' + key);
      }

      return isConstractorHook(fields[key]);
    });

    // React component is a wrapper around the our custom HTML Node
    // who's whole purpose is to update attributes of the node that
    // are not recognized by react.
    var Type = React.createClass({
      displayName: "html:" + name,
      getInitialState: function getInitialState() {

        console.log(' --- getInitialState ' + name);

        //var state = Object.assign({}, fields);
        var state = {};
        keys.forEach(function(key){ state[key] = fields[key]; });
        constractorHooks.forEach(function (key) {

          console.log('getInitialState ' + name + ': key ' + key);

          state[key] = fields[key].construct();
        });
        return state;
      },
      // Reflect attributes not recognized by react.
      componentDidMount: function componentDidMount() {

        console.log(' --- componentDidMount ' + name);

        var node = this.getDOMNode();
        var present = this.props;
        var hooks = this.state;

        if (mountHooks.length > 0) {
          mountHooks.forEach(function (key) {
            var hook = hooks[key];
            var value = present[key];
            hook.mount(node, value);
          });

          // Pre mount fields need to be set before node
          // is in the document. Since react does not has
          // an appropriate hook we replace node with itself
          // to trigger desired behavior.
          node.parentNode.replaceChild(node, node);
        }

        mountedHooks.forEach(function (key) {
          var hook = hooks[key];

          console.log('componentDidMount ' + name + ': key ' + key);

          hook.mounted(node, present[key]);
        });
      },
      componentWillUnmount: function componentWillUnmount() {

        console.log(' --- componentWillUnmount ' + name);

        var node = this.getDOMNode();
        var hooks = this.state;

        unmountHooks.forEach(function (key) {
          var hook = hooks[key];

          console.log('componentWillUnmount ' + name + ': key ' + key);

          hook.unmount(node);
        });
      },
      // Reflect attribute changes not recognized by react.
      componentDidUpdate: function componentDidUpdate(past) {

        console.log(' --- componentDidUpdate ' + name);

        var node = this.getDOMNode();
        var present = this.props;
        var hooks = this.state;

        updateHooks.forEach(function (key) {
          var hook = hooks[key];

          console.log('componentDidUpdate ' + name + ':     key ' + key);
          console.log('componentDidUpdate ' + name + ':    past ' + past[key]);
          console.log('componentDidUpdate ' + name + ': present ' + present[key]);

          hook.write(node, present[key], past[key]);
        });
      },
      // Render renders wrapped HTML node.
      render: function render() {

        console.log(' --- render ' + name);

        return Node(this.props, this.props.children);
      }
    });
    //return React.createFactory(Type);
    return Type;
  };
  result.isPreMountHook = isPreMountHook;
  result.isPostMountHook = isPostMountHook;
  result.isUpdateHook = isUpdateHook;
  result.isConstractorHook = isConstractorHook;

  // Option can be used to define attribute on the element
  // that is set once before element is inserted into a
  // document (mounted). Changes to this option are ignored
  // & in general use of `Attribute` is preferred, this should
  // be reserved only for attributes changes to which aren't picked
  // up after node is in the tree.
  // Example: Element("iframe", { browser: Option("mozbrowser") })
  var Option = (function (_Option) {
    function Option() {
      return _Option.apply(this, arguments);
    }

    Option.toString = function () {
      return _Option.toString();
    };

    return Option;
  })(function (name) {
    if (!(this instanceof Option)) {
      return new Option(name);
    }

    this.name = name;
  });
  Option.prototype = {
    constructor: Option,
    mount: function mount(node, value) {
      node.setAttribute(this.name, value);
    }
  };
  result.Option = Option;

  // Attribute can be used to define field mapped to a
  // DOM attribute with a given `name`. If the field is
  // set to `undefined` or `null` attribute is removed
  // othrewise it's set to given value.
  // Example: Element("hbox", {flex: Attribute("flex")})
  var Attribute = (function (_Attribute) {
    function Attribute() {
      return _Attribute.apply(this, arguments);
    }

    Attribute.toString = function () {
      return _Attribute.toString();
    };

    return Attribute;
  })(function (name) {
    if (!(this instanceof Attribute)) {
      return new Attribute(name);
    }

    this.name = name;
  });
  Attribute.prototype = {
    constructor: Attribute,
    mounted: function mounted(node, value) {
      if (value !== void 0) {
        node.setAttribute(this.name, value);
      }
    },
    write: function write(node, present, past) {
      if (present !== past) {
        if (present === void 0) {
          node.removeAttribute(this.name);
        } else {
          node.setAttribute(this.name, present);
        }
      }
    }
  };
  result.Attribute = Attribute;

  // Field can be used to define fields that can't be
  // mapped to an attribute in the DOM. Field is defined
  // by providing a function that will be invoked target
  // `node` `current` value & `past` value and it's supposed
  // to reflect changes in the DOM. Note that on initial
  // render `past` will be `void(0)`.
  //
  // Example:
  // Element("iframe", {focused: (node, current, past) => {
  //   if (current) {
  //     node.focus()
  //   }
  // }})
  var Field = (function (_Field) {
    function Field() {
      return _Field.apply(this, arguments);
    }

    Field.toString = function () {
      return _Field.toString();
    };

    return Field;
  })(function (write) {
    if (!(this instanceof Field)) {
      return new Field(write);
    }
    this.write = write;
  });
  Field.prototype = {
    constructor: Attribute,
    mounted: function mounted(node, value) {
      this.write(node, value, void 0);
    }
  };
  result.Field = Field;

  // Event can be used to define event handler fields, for
  // the given event `type`. When event of that type occurs
  // event handler assigned to the associated field will be
  // invoked. Optionally `read` function can be passed as a
  // second argument, in which case event handler will be
  // invoked with `read(event)` instead of `event`.
  // Example:
  // Element("iframe", {onTitleChange: Event("mozbrowsertitlechange")})
  var Event = (function (_Event) {
    function Event() {
      return _Event.apply(this, arguments);
    }

    Event.toString = function () {
      return _Event.toString();
    };

    return Event;
  })(function (type, read) {
    var capture = arguments[2] === undefined ? false : arguments[2];

    if (!(this instanceof Event)) {
      return new Event(type, read);
    }
    this.type = type;
    this.read = read;
    this.capture = capture;
  });
  Event.prototype = {
    constructor: Event,
    construct: function construct() {
      return new this.constructor(this.type, this.read, this.capture);
    },
    capture: false,
    mounted: function mounted(node, handler) {

      console.log(' +++ added event listener for ' + this.type + ': ' + handler + '(node: ' + node.tagName + ')');

      this.handler = handler;
      node.addEventListener(this.type, this, this.capture);
    },
    unmount: function unmount(node) {

      console.log(' +++ removed event listener for ' + this.type);

      node.removeEventListener(this.type, this, this.capture);
    },
    write: function write(node, present) {

      console.log(' +++ assigned event listener for ' + this.type + ': ' + present);

      this.handler = present;
    },
    handleEvent: function handleEvent(event) {
      if (this.handler) {
        this.handler(this.read ? this.read(event) : event);
      }
    }
  };
  result.Event = Event;

  // CapturedEvent can be used same as `Event` with a difference
  // that events listeners will be added with a capture `true`.
  var CapturedEvent = (function (_CapturedEvent) {
    function CapturedEvent() {
      return _CapturedEvent.apply(this, arguments);
    }

    CapturedEvent.toString = function () {
      return _CapturedEvent.toString();
    };

    return CapturedEvent;
  })(function (type, read) {
    if (!(this instanceof CapturedEvent)) {
      return new Event(type, read);
    }

    this.type = type;
    this.read = read;
    this.capture = true;
  });
  CapturedEvent.prototype = Event.prototype;
  result.CapturedEvent = CapturedEvent;

  return result;
})();
