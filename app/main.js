require([
  // Application.
  "app",

  // Main Router.
  "router"
],

function(app, Router) {
  function handleMessage(msg) {
  	if (msg.type == "livestate") {
  		// change between nonlive to live
  		if (!app.live && msg.debate > -1) {
	  		console.log("CHANGING APP LIVESTATE TO LIVE "+msg.debate);
	  		app.live = true;
	  		app.liveDebate = msg.debate;
	  		app.trigger("app:setLive", msg.debate);
  		} else if (app.live && msg.debate == -1) {
  			console.log("CHANGING APP LIVESTATE TO NOT LIVE");
  			app.live = false;
  			app.liveDebate = -1;
  		}
  		

  	} else {
    	// Trigger the message.
    	app.trigger("message:" + msg.type, { msg: msg }); 
  	}
  

    if (msg.type === "transcriptDone") {
      app.live = -1;
    }
  }

  // Wait until the socket has been opened, before routing.
  app.socket.on("open", function() {
    // Wait for messages and respond to them.
    app.socket.on("message", function(msg) {
      // Hey kid, rock and roll.
      if (app.playback) {
        handleMessage(JSON.parse(msg));
      // Slow ride, take it easy.
      } else {
        app.bufferedMessages.push(JSON.parse(msg));
      }
    });
  });

  // Define your master router on the application namespace and trigger all
  // navigation from this instance.
  app.router = new Router();

  // Trigger the initial route and enable HTML5 History API support, set the
  // root folder to '/' by default.  Change in app.js.
  Backbone.history.start({ pushState: true, root: app.root });

  // All navigation that is relative should be passed through the navigate
  // method, to be processed by the router. If the link has a `data-bypass`
  // attribute, bypass the delegation completely.
  $(document).on("click", "a:not([data-bypass])", function(evt) {
    // Get the absolute anchor href.
    var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
    // Get the absolute root.
    var root = location.protocol + "//" + location.host + app.root;

    // Ensure the root is part of the anchor href, meaning it's relative.
    if (href.prop && href.prop.slice(0, root.length) === root) {
      // Stop the default event to ensure the link will not cause a page
      // refresh.
      evt.preventDefault();

      // `Backbone.history.navigate` is sufficient for all Routers and will
      // trigger the correct events. The Router's internal `navigate` method
      // calls this anyways.  The fragment is sliced from the root.
      Backbone.history.navigate(href.attr, true);
    }
  });

});
