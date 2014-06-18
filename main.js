Games = new Meteor.Collection('games');

if (Meteor.isClient) {
  Template.board.matrix = function(id){
    var matrix = Games.findOne({_id: Router.current().params._id}).matrix;
    return matrix;
  };

  function translateIndex(index) {
    var a = []
    switch(index) {
      case 0: 
        a = [0,0]
        break;
      case 1: 
        a = [0,1]
        break;
      case 2: 
        a = [0,2]
        break;
      case 3: 
        a = [1,0]
        break;
      case 4: 
        a = [1,1]
        break;
      case 5: 
        a = [1,2]
        break;
      case 6: 
        a = [2,0]
        break;
      case 7: 
        a = [2,1]
        break;
      case 8: 
        a = [2,2]
        break;
    }

    return a;
  }

  Template.board.events({
    'click .tile' : function(e, template) {
      var user = Meteor.userId();
      var game = Games.findOne({_id: Router.current().params._id});
      var $ele = $(e.currentTarget);
      var index = $('.tile').index($ele);
      var loc = translateIndex(index);
      var matrix = game.matrix;
      console.log(loc);

      if($ele.hasClass('team-0')){
        if(game.crosses === Meteor.userId()) {
          matrix[loc[0]][loc[1]] = 1;
          Games.update({
            _id: Router.current().params._id
          },
          {
            $set: {matrix: matrix}
          })
        } else if (game.noughts === Meteor.userId()) {
          console.log('noughts');
        }
      } else {
        return false;
      }
    }
  });

  Template.gameList.games = function(){
    return Games.find();
  };

  Template.gameList.players = function(id) {
    var game = Games.findOne({_id: id});
    var players = 0;
    game.noughts.length > 0 ? players++ : "";
    game.crosses.length > 0 ? players++ : "";
    return players;
  };

  Template.gameList.currentlyPlaying = function(id) {
    var game = Games.findOne({_id: id});

    if(game.noughts === Meteor.userId() || game.crosses === Meteor.userId()) {
      return true;
    } else {
      return false;
    }
  }

  Template.gameList.events({
    'click .join' : function(e, template) {
      var game = Games.findOne({_id: this._id});

      if(! Meteor.user()) {
        alert('You must login to join a game');
        return false;
      }

      if(game.noughts === "" && game.crosses === "") {
        Games.update({_id: this._id}, {$set: {crosses: Meteor.userId() }})
      } else if (game.noughts === "") {
        Games.update({_id: this._id}, {$set: {noughts: Meteor.userId() }})
      } else {
        alert('Game Full! Make a new game!');
        return false;
      }
    }
  });

  Template.create.events({
    'submit form': function(e, template) {
      e.preventDefault();
      var game = {}
      game.name = template.find('#gameName').value;
      game.completed = false;
      game.winner = null;
      game.inProgress = false;
      game.noughts = "";
      game.crosses = "";
      game.turn = "crosses";
      game.matrix = [[0,0,0],[0,0,0],[0,0,0]];
      Games.insert(game);
    }
  });
}

if (Meteor.isServer) {

}
