var UI = require('ui');
var ajax = require('ajax');
var countdown = require('countdown');

var serverDomain;
var timer;

var init = function(options) {
  serverDomain = options.serverDomain;
};

var renderJourney = function(journey) {
  console.log(JSON.stringify(journey));
  var journeyCard = new UI.Card({
    title: journey.from.text + ' to ' + journey.to.text,
    body: 'Loading train times...'
  });
  journeyCard.show();

  var trainsUrl = serverDomain + '/api/trains?from=' + journey.from.code + '&to=' + journey.to.code;
  console.log('Fetching trains: ' + trainsUrl);
  
  journeyCard.on('hide', function() {
    countdown.stop();
  });

  ajax({
    url: trainsUrl,
      type: 'json'
    }, function(data) {
      console.log(JSON.stringify(data));
      var trains = data.trains;
      if (trains.length === 0) {
        journeyCard.body('No trains found for this journey');
      }
      timer = countdown.start(trains, function(times) {
        journeyCard.body('Next trains in ' + times.join(', ') + ' mins');
      });
      
    }, function(error) {
      console.log('Failed to fetch trains: ' + JSON.stringify(error));
      journeyCard.body('Failed to get train times.');
    }
  );
};

module.exports = {
  init: init,
  render: renderJourney
};