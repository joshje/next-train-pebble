var UI = require('ui');
var Settings = require('settings');
var ajax = require('ajax');

var journeys;

var serverDomain = 'http://localhost:3000';

var firstRun = new UI.Card({
  title: 'Next Train',
  body: 'To get started add some journeys by configuring Next Train in the Pebble app'
});

var journeysMenu = new UI.Menu({
  sections: [{
    title: 'Journeys',
    items: []
  }]
});

var journeysMenuItems = function(journeys) {
  var menu = [];
  if (! journeys.length) return [];
  for (var i = 0, len = journeys.length; i < len; i++) {
    var journey = journeys[i];
    menu.push({
      title: journey.from.text,
      subtitle: 'to ' + journey.to.text
    });
  }
  return menu;
};

var renderMenu = function() {
  journeys = Settings.option('journeys');
  
  if (! journeys || journeys.length === 0) {
    firstRun.show();
    journeysMenu.hide();
  } else {
    journeysMenu.items(0, journeysMenuItems(journeys));
    journeysMenu.show();
    firstRun.hide();
  }
};

var renderJourney = function(journey) {
  console.log(JSON.stringify(journey));
  var journeyCard = new UI.Card({
    title: journey.from.text + ' to ' + journey.to.text,
    body: 'Loading train times...'
  });
  journeyCard.show();
  
  var trainsUrl = serverDomain + '/api/trains?from=' + journey.from.code + '&to=' + journey.to.code;
  
  ajax({
    url: trainsUrl,
      type: 'json'
    }, function(data, status, request) {
      console.log(JSON.stringify(data.trains));
    }, function(error, status, request) {
      console.log('Failed to fetch trains: ' + error);
    }
  );
};

journeysMenu.on('select', function(e) {
  var journey = journeys[e.itemIndex];
  renderJourney(journey);
});

Settings.config({
  url: serverDomain + '/pebble/settings'
}, function(e) {
  console.log('opening configurable');
}, function(e) {
  console.log('closed configurable');
  renderMenu();
});

renderMenu();