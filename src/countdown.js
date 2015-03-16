var visible = false;

var digits = function(number) {
  return ("0" + number).slice(-2);
};

var nextTick = function(trains, callback) {
  console.log('countdown tick');
  if (! visible) return;
  
  var now = new Date();
  var times = [];
  
  for (var i = 0, len = trains.length; i < len; i++) {
    var diff = trains[i].date - now;
    if (diff > 0) {
      var hours = Math.floor(diff / 3600000);
      var mins = Math.floor(((diff % 86400000) % 3600000) / 60000);

      if (hours) {
        times.push(digits(hours) + ':' + digits(mins));
      } else {
        times.push(mins);
      }
    }
  }
  
  callback(times);

  var millis = Math.round((((trains[0].date - now) % 86400000) % 3600000) % 60000);

  setTimeout(function() {
    nextTick(trains, callback);
  }, millis);
};

var start = function(trains, callback) {
  console.log('countdown start');
  visible = true;
  nextTick(trains, callback);
};

var stop = function() {
  console.log('countdown stop');
  visible = false;
};

module.exports =  {
  start: start,
  stop: stop
};