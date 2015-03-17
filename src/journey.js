var Vector2 = require('vector2');
var UI = require('ui');
var ajax = require('ajax');
var countdown = require('countdown');

var serverDomain;
var timer;

var init = function(options) {
  serverDomain = options.serverDomain;
};

var renderJourney = function(journey) {
  console.log('render journey');
  
  var journeyWindow = new UI.Window({
    action: {
      up: 'images/refresh.png',
      down: 'images/switch.png'
    }
  });
  
  var journeyBg = new UI.Rect({
    backgroundColor: 'white',
    position: new Vector2(0, 0),
    size: new Vector2(144, 200)
  });
  
  var journeyFrom = new UI.Text({
    text: journey.from.text,
    color: 'black',
    font: 'gothic-18-bold',
    position: new Vector2(4, 0),
    size: new Vector2(120, 22),
    textOverflow: 'ellipsis'
  });
  
  var journeyTo = new UI.Text({
    text: 'to ' + journey.to.text,
    color: 'black',
    font: 'gothic-14',
    position: new Vector2(4, 18),
    size: new Vector2(120, 18),
    textOverflow: 'ellipsis'
  });
  
  var journeyTitleLine = new UI.Rect({
    backgroundColor: 'black',
    position: new Vector2(0, 38),
    size: new Vector2(130, 1)
  });
  
  var journeyText = new UI.Text({
    text: 'Loading train times...',
    font: 'gothic-18',
    color: 'black',
    position: new Vector2(6, 42),
    size: new Vector2(120, 20)
  });
  
  var journeyTimes = new UI.Text({
    text: '',
    font: 'gothic-28',
    color: 'black',
    position: new Vector2(6, 62),
    size: new Vector2(120, 80)
  });
  
  journeyWindow.add(journeyBg);
  journeyWindow.add(journeyFrom);
  journeyWindow.add(journeyTo);
  journeyWindow.add(journeyTitleLine);
  journeyWindow.add(journeyText);
  journeyWindow.add(journeyTimes);
  
  journeyWindow.show();

  var trainsUrl = serverDomain + '/api/trains?from=' + journey.from.code + '&to=' + journey.to.code;
  console.log('Fetching trains: ' + trainsUrl);
  
  journeyWindow.on('hide', function() {
    countdown.stop();
  });
  
  var fetchTrains = function() {
    ajax({
      url: trainsUrl,
      type: 'json',
      cache: false
    }, function(data) {
      console.log(JSON.stringify(data));
      var trains = data.trains;
      if (trains.length === 0) {
        journeyText.text('No trains found');
      }
      var trainDates = trains.map(function(train) {
        return train.date;
      });
      timer = countdown.start(trainDates, function(times, refetch) {
        journeyText.text("Next trains:");
        journeyTimes.text(times.join(', ') + ' mins');
        if (refetch) {
          setTimeout(fetchTrains, 5000);
        }
      });
      
    }, function(error) {
      console.log("Failed to fetch trains:\n" + JSON.stringify(error));
      journeyText.text('Failed to get train times');
    });
  };

  fetchTrains();
};

module.exports = {
  init: init,
  render: renderJourney
};