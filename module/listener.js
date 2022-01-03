let taskObj = new Object();
taskObj.Data = {
    site_url: "https://circuitalminds.github.io",
    api_url: "https://circuitalminds.herokuapp.com"
};


taskObj.initWorker = function( workerObj ) {
    console.log("start");
    var Interval = setInterval( function() {
        if ( workerObj["status"] ) {
            workerObj.init();
        } else {
            console.log("ok");
            clearInterval(Interval);
        };
    }, workerObj["timer"]);
    return
};

var alarm = {
  remind: function(aMessage) {
    alert(aMessage);
    delete this.timeoutID;
  },

  setup: function() {
    this.cancel();
    var self = this;
    this.timeoutID = window.setTimeout(function(msg) {self.remind(msg);}, 1000, "Wake up!");
  },

  cancel: function() {
    if(typeof this.timeoutID == "number") {
      window.clearTimeout(this.timeoutID);
      delete this.timeoutID;
    }
  }
};
window.onclick = function() { alarm.setup() };
