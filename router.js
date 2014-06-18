Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading'
});

Router.map(function(){
	this.route('main', {
		path: '/'
	});
	this.route('board', { 
		path: '/game/:_id',
		data: function() { return Games.findOne(this.params._id); }
	});
});

var requireLogin = function(pause) {
  if (! Meteor.user()) {
    this.render('accessDenied');
    pause();
  }
}

Router.onBeforeAction(requireLogin, {only: 'board'});
Router.onBeforeAction('loading');