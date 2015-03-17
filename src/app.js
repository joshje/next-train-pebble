var UI = require('ui');
var Settings = require('settings');
var journeyView = require('journey');

var journeys;

var serverDomain = 'http://next-train.joshemerson.co.uk';

journeyView.init({
  serverDomain: serverDomain
});

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

journeysMenu.on('select', function(e) {
  journeyView.render(journeys[e.itemIndex]);
});

Settings.config({
  url: serverDomain + '/pebble/settings'
}, function() {
  console.log('opening configurable');
}, function() {
  console.log('closed configurable');
  renderMenu();
});

renderMenu();
