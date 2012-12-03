// Generated by CoffeeScript 1.4.0
var Controller, Facade, MacroCommand, Mediator, Model, Notification, Notifier, Observer, Proxy, SimpleCommand, View, namespace,
  __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

namespace = function(target, name, block) {
  var item, top, _i, _len, _ref, _ref1;
  if (arguments.length < 3) {
    _ref = [(typeof exports !== 'undefined' ? exports : window)].concat(__slice.call(arguments)), target = _ref[0], name = _ref[1], block = _ref[2];
  }
  top = target;
  _ref1 = name.split('.');
  for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
    item = _ref1[_i];
    target = target[item] || (target[item] = {});
  }
  return block(target, top);
};

Controller = (function() {
  var instance;

  instance = null;

  Controller.prototype.view = null;

  Controller.prototype.commandMap = null;

  function Controller() {
    if (instance) {
      throw new Error(Controller.SINGLETON_MSG);
    }
    this.commandMap = {};
    this.initializeController();
  }

  Controller.prototype.initializeController = function() {
    return this.view = View.getInstance();
  };

  Controller.prototype.executeCommand = function(note) {
    var command, commandClassRef;
    commandClassRef = this.commandMap[note.getName()];
    if (commandClassRef) {
      command = new commandClassRef();
      if (command.execute) {
        return command.execute(note);
      }
    }
  };

  Controller.prototype.registerCommand = function(notificationName, commandClassRef) {
    if (!(this.commandMap[notificationName] != null)) {
      this.view.registerObserver(notificationName, new Observer(this.executeCommand, this));
    }
    return this.commandMap[notificationName] = commandClassRef;
  };

  Controller.prototype.hasCommand = function(notificationName) {
    return this.commandMap[notificationName] != null;
  };

  Controller.prototype.removeCommand = function(notificationName) {
    if (this.hasCommand(notificationName)) {
      return this.view.removeObserver(name, this);
    }
  };

  Controller.getInstance = function() {
    return instance != null ? instance : instance = new Controller();
  };

  Controller.SINGLETON_MSG = "Controller Singleton already constructed!";

  return Controller;

})();

namespace('puremvc', function(exports) {
  return exports.Controller = Controller;
});

Model = (function() {
  var instance;

  instance = null;

  Model.prototype.proxyMap = null;

  function Model() {
    if (instance) {
      throw new Error(Model.SINGLETON_MSG);
    }
    this.proxyMap = {};
    this.initializeModel();
  }

  Model.prototype.initializeModel = function() {};

  Model.prototype.registerProxy = function(proxy) {
    this.proxyMap[proxy.getProxyName()] = proxy;
    return proxy.onRegister();
  };

  Model.prototype.retrieveProxy = function(proxyName) {
    return this.proxyMap[proxyName] || null;
  };

  Model.prototype.hasProxy = function(proxyName) {
    return this.proxyMap[proxyName] != null;
  };

  Model.prototype.removeProxy = function(proxyName) {
    var proxy;
    proxy = this.proxyMap[proxyName];
    if (!proxy) {
      return null;
    }
    delete this.proxyMap[proxyName];
    proxy.onRemove();
    return proxy;
  };

  Model.getInstance = function() {
    return instance != null ? instance : instance = new Model();
  };

  Model.SINGLETON_MSG = "Model Singleton already constructed!";

  return Model;

})();

namespace('puremvc', function(exports) {
  return exports.Model = Model;
});

/*
A Singleton `View` implementation.

In PureMVC, the `View` class assumes these responsibilities:

  * Maintain a cache of `Mediator` instances.
  * Provide methods for registering, retrieving, and removing `Mediators`.
  * Notifiying `Mediators` when they are registered or removed.
  * Managing the observer lists for each `Notification` in the application.
  * Providing a method for attaching `Observers` to an `Notification`'s observer list.
  * Providing a method for broadcasting an `Notification`.
  * Notifying the `Observers` of a given `Notification` when it broadcast.
*/


View = (function() {
  var instance;

  instance = null;

  View.prototype.mediatorMap = null;

  View.prototype.observerMap = null;

  function View() {
    if (instance) {
      throw new Error(View.SINGLETON_MSG);
    }
    this.mediatorMap = {};
    this.observerMap = {};
    this.initializeView();
  }

  View.prototype.initializeView = function() {};

  View.prototype.registerObserver = function(notificationName, observer) {
    var _base, _ref;
    if ((_ref = (_base = this.observerMap)[notificationName]) == null) {
      _base[notificationName] = [];
    }
    return this.observerMap[notificationName].push(observer);
  };

  View.prototype.notifyObservers = function(notification) {
    var observer, observers, observers_ref, _i, _len, _results;
    observers_ref = this.observerMap[notification.getName()];
    if (observers_ref) {
      observers = observers_ref.slice(0);
      _results = [];
      for (_i = 0, _len = observers.length; _i < _len; _i++) {
        observer = observers[_i];
        _results.push(observer.notifyObserver(notification));
      }
      return _results;
    }
  };

  View.prototype.removeObserver = function(notificationName, notifyContext) {
    var i, observer, observers, _i, _len;
    observers = observerMap[notificationName];
    for (i = _i = 0, _len = observers.length; _i < _len; i = ++_i) {
      observer = observers[i];
      if (observer.compareNotifyContext(notifyContext)) {
        observers.splice(i, 1);
        break;
      }
    }
    if (observers.length <= 0) {
      return delete this.observerMap[name];
    }
  };

  View.prototype.registerMediator = function(mediator) {
    var interest, interests, observer, _i, _len;
    if (this.mediatorMap[mediator.getMediatorName()]) {
      return null;
    }
    this.mediatorMap[mediator.getMediatorName()] = mediator;
    interests = mediator.listNotificationInterests();
    if (interests.length > 0) {
      observer = new Observer(mediator.handleNotification, mediator);
      for (_i = 0, _len = interests.length; _i < _len; _i++) {
        interest = interests[_i];
        this.registerObserver(interest, observer);
      }
    }
    return mediator.onRegister();
  };

  View.prototype.retrieveMediator = function(mediatorName) {
    return this.mediatorMap[mediatorName] || null;
  };

  View.prototype.removeMediator = function(mediatorName) {
    var interest, mediator, _i, _len, _ref;
    mediator = this.mediatorMap[mediatorName];
    if (mediator) {
      _ref = mediator.listNotificationInterests();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        interest = _ref[_i];
        this.removeObserver(interest, mediator);
      }
      delete this.mediatorMap[mediatorName];
      mediator.onRemove();
    }
    return mediator;
  };

  View.prototype.hasMediator = function(mediatorName) {
    return this.mediatorMap[mediatorName] != null;
  };

  View.getInstance = function() {
    return instance != null ? instance : instance = new View();
  };

  View.SINGLETON_MSG = "View Singleton already constructed!";

  return View;

})();

namespace('puremvc', function(exports) {
  return exports.View = View;
});

Facade = (function() {
  var instance;

  instance = null;

  function Facade() {
    if (instance) {
      throw new Error(Facade.SINGLETON_MSG);
    }
    this.initializeFacade();
  }

  Facade.prototype.initializeFacade = function() {
    this.initializeModel();
    this.initializeController();
    return this.initializeView();
  };

  Facade.prototype.initializeController = function() {
    var _ref;
    return (_ref = this.controller) != null ? _ref : this.controller = Controller.getInstance();
  };

  Facade.prototype.initializeModel = function() {
    var _ref;
    return (_ref = this.model) != null ? _ref : this.model = Model.getInstance();
  };

  Facade.prototype.initializeView = function() {
    var _ref;
    return (_ref = this.view) != null ? _ref : this.view = View.getInstance();
  };

  Facade.prototype.registerCommand = function(notificationName, commandClassRef) {
    return this.controller.registerCommand(notificationName, commandClassRef);
  };

  Facade.prototype.removeCommand = function(notificationName) {
    return this.controller.removeCommand(notificationName);
  };

  Facade.prototype.hasCommand = function(notificationName) {
    return this.controller.hasCommand(notificationName);
  };

  Facade.prototype.registerProxy = function(proxy) {
    return this.model.registerProxy(proxy);
  };

  Facade.prototype.retrieveProxy = function(proxyName) {
    return this.model.retrieveProxy(proxyName);
  };

  Facade.prototype.removeProxy = function(proxyName) {
    var _ref;
    return (_ref = this.model) != null ? _ref.removeProxy(proxyName) : void 0;
  };

  Facade.prototype.hasProxy = function(proxyName) {
    return this.model.hasProxy(proxyName);
  };

  Facade.prototype.sendNotification = function(notificationName, body, type) {
    return this.notifyObservers(new Notification(notificationName, body, type));
  };

  Facade.prototype.notifyObservers = function(notification) {
    var _ref;
    return (_ref = this.view) != null ? _ref.notifyObservers(notification) : void 0;
  };

  Facade.prototype.registerMediator = function(mediator) {
    var _ref;
    return (_ref = this.view) != null ? _ref.registerMediator(mediator) : void 0;
  };

  Facade.prototype.retrieveMediator = function(mediatorName) {
    return this.view.retrieveMediator(mediatorName);
  };

  Facade.prototype.removeMediator = function(mediatorName) {
    return this.view.removeMediator(mediatorName);
  };

  Facade.prototype.hasMediator = function(mediatorName) {
    return this.view.hasMediator(mediatorName);
  };

  Facade.getInstance = function() {
    return instance != null ? instance : instance = new Facade();
  };

  Facade.SINGLETON_MSG = "Facade Singleton already constructed!";

  return Facade;

})();

namespace('puremvc', function(exports) {
  return exports.Facade = Facade;
});

Notifier = (function() {

  Notifier.prototype.facade = null;

  function Notifier() {
    this.facade = Facade.getInstance();
  }

  Notifier.prototype.sendNotification = function(notificationName, body, type) {
    return this.facade.sendNotification(notificationName, body, type);
  };

  return Notifier;

})();

namespace('puremvc', function(exports) {
  return exports.Notifier = Notifier;
});

Notification = (function() {

  function Notification(name, body, type) {
    this.name = name;
    this.body = body;
    this.type = type;
  }

  Notification.prototype.getName = function() {
    return this.name;
  };

  Notification.prototype.getBody = function() {
    return this.body;
  };

  Notification.prototype.setBody = function(body) {
    this.body = body;
  };

  Notification.prototype.getType = function() {
    return this.type;
  };

  Notification.prototype.setType = function(type) {
    this.type = type;
  };

  Notification.prototype.toString = function() {
    return "Notification Name: " + name + "\nBody: " + (this.body || null) + "\nType: " + (this.type || null);
  };

  return Notification;

})();

namespace('puremvc', function(exports) {
  return exports.Notification = Notification;
});

Observer = (function() {

  Observer.prototype.facade = null;

  function Observer(notifyMethod, notifyContext) {
    this.setNotifyMethod(notifyMethod);
    this.setNotifyContext(notifyContext);
  }

  Observer.prototype.setNotifyMethod = function(notifyMethod) {
    this.notifyMethod = notifyMethod;
  };

  Observer.prototype.setNotifyContext = function(notifyContext) {
    this.notifyContext = notifyContext;
  };

  Observer.prototype.getNotifyMethod = function() {
    return this.notifyMethod;
  };

  Observer.prototype.getNotifyContext = function() {
    return this.notifyContext;
  };

  Observer.prototype.notifyObserver = function(notification) {
    return this.getNotifyMethod().call(this.getNotifyContext(), notification);
  };

  Observer.prototype.compareNotifyContext = function(object) {
    return obj === this.getNotifyContext();
  };

  return Observer;

})();

namespace('puremvc', function(exports) {
  return exports.Observer = Observer;
});

MacroCommand = (function(_super) {

  __extends(MacroCommand, _super);

  MacroCommand.prototype.subCommands = null;

  function MacroCommand() {
    MacroCommand.__super__.constructor.call(this);
    this.subCommands = [];
    this.initializeMacroCommand();
  }

  MacroCommand.prototype.initializeMacroCommand = function() {};

  MacroCommand.prototype.addSubCommand = function(commandClassRef) {
    return this.subCommands.push(commandClassRef);
  };

  MacroCommand.prototype.execute = function(notification) {
    var commandClassRef, _i, _len, _ref;
    _ref = this.subCommands;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      commandClassRef = _ref[_i];
      new commandClassRef().execute(notification);
    }
    return null;
  };

  return MacroCommand;

})(Notifier);

namespace('puremvc', function(exports) {
  return exports.MacroCommand = MacroCommand;
});

SimpleCommand = (function(_super) {

  __extends(SimpleCommand, _super);

  function SimpleCommand() {
    return SimpleCommand.__super__.constructor.apply(this, arguments);
  }

  SimpleCommand.prototype.execute = function(notification) {};

  return SimpleCommand;

})(Notifier);

namespace('puremvc', function(exports) {
  return exports.SimpleCommand = SimpleCommand;
});

Mediator = (function(_super) {

  __extends(Mediator, _super);

  function Mediator(mediatorName, viewComponent) {
    this.mediatorName = mediatorName != null ? mediatorName : this.NAME;
    this.viewComponent = viewComponent;
    Mediator.__super__.constructor.call(this);
  }

  Mediator.prototype.getMediatorName = function() {
    return this.mediatorName;
  };

  Mediator.prototype.getViewComponent = function() {
    return this.viewComponent;
  };

  Mediator.prototype.setViewComponent = function(viewComponent) {
    this.viewComponent = viewComponent;
  };

  Mediator.prototype.listNotificationInterests = function() {
    return [];
  };

  Mediator.prototype.handleNotification = function(notification) {};

  Mediator.prototype.onRegister = function() {};

  Mediator.prototype.onRemove = function() {};

  Mediator.prototype.NAME = 'Mediator';

  return Mediator;

})(Notifier);

namespace('puremvc', function(exports) {
  return exports.Mediator = Mediator;
});

Proxy = (function(_super) {

  __extends(Proxy, _super);

  function Proxy(proxyName, data) {
    this.proxyName = proxyName != null ? proxyName : this.NAME;
    this.data = data;
    Proxy.__super__.constructor.call(this);
  }

  Proxy.prototype.getProxyName = function() {
    return this.proxyName;
  };

  Proxy.prototype.setData = function(data) {
    this.data = data;
  };

  Proxy.prototype.getData = function() {
    return this.data;
  };

  Proxy.prototype.onRegister = function() {};

  Proxy.prototype.onRemove = function() {};

  Proxy.prototype.NAME = 'Proxy';

  return Proxy;

})(Notifier);

namespace('puremvc', function(exports) {
  return exports.Proxy = Proxy;
});