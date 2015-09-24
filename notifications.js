var Notifications = {
  afterAuthorize: undefined,

  apiAvailable: function() {
    if (!("Notification" in window)) {
      return false;
    } else {
      return true;
    }
  },

  isAuthorized: function() {
    if (!this.apiAvailable()) return false;
    return (Notification.permission === 'granted' ? true : false);
  },

  authorize: function( element, message ) {
    if (!this.apiAvailable()) return false;
    var self = this;
    Notification.requestPermission(function(status){
      if (self.isAuthorized()) {
        self.accept( element, message );
        if(typeof self.afterAuthorize !== 'undefined') self.afterAuthorize();
      }
      else{
        self.denied( element, message );
      }
    });
  },

  show: function(title, options, actions, timer) {
    if (!this.apiAvailable()) return false;
    timer   = (timer === undefined ? 5000 : timer);
    options = (options === undefined ? {} : options);

    var self = this;

    if (this.isAuthorized()) {
      var notification = new Notification(title, options);

      if(actions !== undefined && actions !== null){
        if(typeof actions.onclick === 'function')
          notification.onclick = actions.onclick;
        if(typeof actions.onshow === 'function')
          notification.onshow = actions.onshow;
        if(typeof actions.onerror === 'function')
          notification.onerror = actions.onerror;
        if(typeof actions.onclose === 'function')
          notification.onclose = actions.onclose;
      }

      setTimeout(function(){
        notification.close();
      }, timer);
    } else {
      this.authorize(function() {
        self.show(title, options, timer);
      });
    }
  },

  isBlocked: function() {
    if (!this.apiAvailable()) return false;
    return (Notification.permission === 'denied' ? true : false);
  },

  checkForPermission: function() {
    return Notification.permission;
  },

  accept: function( element, message ) {
    element.html(message.accept)
  },

  denied: function( element, message ) {
    element.html(message.denied)
  }
};
