define([
  // Application.
  "app",
  "modules/ref",
],

// Map dependencies from above array.
function(app, Ref) {

  // Create a new module.
  var Landing = app.module();  

  // Default model.
  Landing.Model = Backbone.Model.extend({
  	defaults: function() {
  		return {
	  		startDates: [new Date(2012, 10, 3, 21, 0), new Date(2012, 10, 16, 21, 0), new Date(2012, 10, 22, 21, 0)],
	  		endDates: [new Date(2012, 10, 3, 22, 30), new Date(2012, 10, 16, 22, 30), new Date(2012, 10, 22, 22, 30)],
	  		/*
	  		description: "ReConstitution 2012 is a live web app linked to the three US Presidential Debates. As the debates are happening, language used by the candidates is fed into the app in real time, generating a live data map. Algorithms track the psychological states of Romney and Obama and compare them to past candidates, revealing hidden meaning behind their words.",*/
	  		now: new Date(),
	  		live: 0	// 1,2,3 if we are watching a debate live.
	  	}	  			
  	},
  	
  	initialize: function() {
	  	if(this.attributes.live) 
	  		this.live = this.attributes.live; 
  	}	
  });

  Landing.View = Backbone.View.extend({
  	template: "landing",
  	
    initialize: function() {
	    this.model = this.options.model;	
	    //console.log("new Landing.View: Date = "+this.model.get("startDates")[0].getUTCDate());
	    
	    this.navigation = this.options.navigation;
	    this.transcript = this.options.transcript;
	    this.overlay = this.options.overlay;
	    this.bigWords = this.options.bigWords;
	    this.comparisons = this.options.comparisons;	    
    },
    
    events: {
        'click #landingButton0': 'handleDebateClick',
        'click #landingButton1': 'handleDebateClick',
        'click #landingButton2': 'handleDebateClick'
    },
    
    serialize: function() {
	    return {live: this.model.live, dates: this.model.get("startDates"), now: this.model.now};	
    },
    
    handleDebateClick: function(e) {
      // Add markup.
      //$("#transcript").html(app.markup);
      //app.restore = true;


      if(e.target.id === "landingButton0" || e.target.parentNode.id == "landingButton0"){
        app.playback = true;
	      if (app.active[0]) this.enterDebate(0);
        app.trigger("navigation:goLive", 600);
      }else if(e.target.id === "landingButton1" || e.target.parentNode.id == "landingButton1"){
        app.trigger("navigation:goLive", 600);
	      if (app.active[1]) this.enterDebate(1);
      }else if(e.target.id === "landingButton2" || e.target.parentNode.id == "landingButton2"){
        app.trigger("navigation:goLive", 600);
	      if (app.active[2]) this.enterDebate(2);
      } 
    },
    
    enterDebate: function(num) {
	  	this.transcript.setHeading("DEBATE "+(num+1));
      // Playback messages.
	    if (app.router.qs.playback) {
	    	if (num == app.lastDebateViewed) {
		    	app.messages[num].playbackMessages(false);
		    } else {
		    	app.messages[num].playbackMessages(true);
		    	app.trigger("debate:reset");
		    }
		    app.lastDebateViewed = num;
	    }
      this.exit(num);
    },
    
    enter: function() {
    	// Hello landing.
      $('body').stop().scrollTop(0); // Jump to the top since landing is no longer postion: fixed
	    $('#landingWrapper').css("visibility", "visible");
	    // Bye bye everything else.
	    this.navigation.exit();
      this.transcript.exit();
      this.bigWords.exit();	
      this.comparisons.exit();
      app.messages[app.lastDebateViewed].stopPlayback();
    },
    
    exit: function(num) {
    	// Bye bye landing.
 	    $('#landingWrapper').css("visibility", "hidden");	    
 	    // Hello everything else.
 	    this.navigation.enter(app.lastDebateViewed == -1);
      this.transcript.enter();
      this.bigWords.enter();	
      this.model.set({lastDebateViewed:num}); // set to false once nav has exited once (something has been viewed)
    }
    
  });

  // Return the module for AMD compliance.
  return Landing;

});
