var visible = false;

var digits = function(number) {
  return ("0" + number).slice(-2);
};

var nextTick = function(dates, callback) {
  console.log('countdown tick');
  if (! visible) return;
  
  var now = new Date();
  var relTimes = [];
  
  dates.forEach(function(date) {
    var diff = date - now;
    if (diff < 0) {
      relTimes.push('now');
    } else {
      var hours = Math.floor(diff / 3600000);
      var mins = Math.floor(((diff % 86400000) % 3600000) / 60000);

      var relTime;
      if (hours) {
        relTime = digits(hours) + ':' + digits(mins);
      } else if (mins === 0) {
        relTime = 'now';
      } else {
        relTime = mins;
      }
      
      relTimes.push(relTime);
    }
  });
  
  
  var refreshTime = dates[0] - now;
  
  if (refreshTime < 0) {
    console.log('first date expired');
    return callback(relTimes, true);
  }

  callback(relTimes);

  var millis = Math.round(((refreshTime % 86400000) % 3600000) % 60000);
  
  console.log('next tick in ' + millis);

  setTimeout(function() {
    nextTick(dates, callback);
  }, millis);
};

var start = function(dates, callback) {
  console.log('countdown start');
  visible = true;
  nextTick(dates, callback);
};

var stop = function() {
  console.log('countdown stop');
  visible = false;
};

module.exports =  {
  start: start,
  stop: stop
};