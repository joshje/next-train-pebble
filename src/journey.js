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
  
  var journeyWindow = new UI.Window();
  var journeyFrom = new UI.Text({
    text: journey.from.text,
    color: 'white',
    font: 'gothic-18-bold',
    position: new Vector2(6, 0),
    size: new Vector2(132, 24)
  });
  
  var journeyTo = new UI.Text({
    text: 'to ' + journey.to.text,
    color: 'white',
    font: 'gothic-14',
    position: new Vector2(6, 20),
    size: new Vector2(132, 18)
  });
  
  var journeyTextRect = new UI.Rect({
    backgroundColor: 'white',
    position: new Vector2(0, 42),
    size: new Vector2(144, 126)
  });
  
  var journeyText = new UI.Text({
    text: 'Loading train times...',
    font: 'gothic-28',
    color: 'black',
    position: new Vector2(6, 56),
    size: new Vector2(132, 100)
  });
  
  journeyWindow.add(journeyFrom);
  journeyWindow.add(journeyTo);
  journeyWindow.add(journeyTextRect);
  journeyWindow.add(journeyText);
  
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
        journeyText.text("Next trains:\n" + times.join(', ') + ' mins');
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