/*
 * app/router.js
 *
 * Copyright 2012 (c) Sosolimited http://sosolimited.com
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 */


define([
  // Application.
  "app",

  // Modules.
  "modules/uniquePhrase",
  "modules/speaker",
  "modules/comparison",
  "modules/message",
  "modules/transcript",
  "modules/navigation",
  "modules/overlay",
  "modules/markupManager",
  "modules/bigWords",
  "modules/landing",
  "modules/ref"
],


function(app, UniquePhrase, Speaker, Comparison, Message, Transcript, Navigation, Overlay, MarkupManager, BigWords, Landing, Ref) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      // Get access to arguments.
      "": "index",
      ":args": "index"
    },

    index: function() {
      var $body = $(document.body);
      app.useLayout("main").render();

	    // Init msg collection.
			var messageCollection = new Message.Collection();
			
			// Init speakers.
    	var speakerCollection = new Speaker.Collection();

    	speakerCollection.add({ id:0, speakerId:0, tag:"moderator", name:"Moderator" });
    	speakerCollection.add({ id:1, speakerId:1, tag:"obama", name:"Barack Obama" });
    	speakerCollection.add({ id:2, speakerId:2, tag:"romney", name:"Mitt Romney" });
    	
    	// Init uniquewords collection.
      //var uniqueWordCollection = new UniqueWord.Collection();
      var uniqueWords = new UniquePhrase.Model.AllPhrases(1, 10);
      var unique2Grams = new UniquePhrase.Model.AllPhrases(2, 10);
      var unique3Grams = new UniquePhrase.Model.AllPhrases(3, 10);
      var unique4Grams = new UniquePhrase.Model.AllPhrases(4, 10);
      
		  // Init transcript.
		  var transcriptView = new Transcript.View( {messages: messageCollection, speakers: speakerCollection, uniqueWords: uniqueWords} );
		  
		  // Init markup manager.
		  var markupManager = new MarkupManager.Model( {transcript: transcriptView} );
		
		  // Init bigWords.
		  var bigWordsView = new BigWords.View();
		  
		  // Init navigation.
		  var navigationView = new Navigation.View( {transcript: transcriptView, messages: messageCollection} );
		 		  
			var startTime = new Date().getTime();
    	    	      
      // Init comparison collection.
      var comparisonCollection = new Comparison.Collection();
      var comparisonView = new Comparison.Views.All({collection: comparisonCollection});
			
			/*
      comparisonCollection.add(new Comparison.CountModel({traitNames:["wc"], speakerNames:speakerCollection, title:"WORD COUNT", subtitle:"The number of total words spoken by each candidate", range:[0,10000.0], color1:"Salmon"})); 
          */
      comparisonCollection.add(new Comparison.EmotionModel({traitNames:["posemo"], speakerNames:speakerCollection, title:"POSITIVITY", subtitle:"The percentage of words spoken that are positive in some way. ie. 'winning, happy, improve.'", range:[0,5.0], color1:"Yellow"}));
      
      //comparisonCollection.add(new Comparison.ListModel({traitNames:["megalist"], speakerNames:speakerCollection, title:"SHIT THEY REPEAT", subtitle:"The favorite words and phases of each candidate (excluding shitty little words like 'the', 'I', 'if', etc.)", uniqueWords:uniqueWords, unique2Grams:unique2Grams, unique3Grams:unique3Grams, color1:"Lime"}));  

      comparisonCollection.add(new Comparison.MegaListModel({traitNames:["megalist"], speakerNames:speakerCollection, title:"SHIT THEY REPEAT", subtitle:"The favorite words and phases of each candidate (excluding shitty little words like 'the', 'I', 'if', etc.)", uniqueWords:uniqueWords, unique2Grams:unique2Grams, unique3Grams:unique3Grams, color1:"Lime"}));     
       
      comparisonCollection.add(new Comparison.EmotionModel({traitNames:["negemo"], speakerNames:speakerCollection, title:"NEGATIVITY", subtitle:"The percentage of words spoken that are negative in some way. ie. 'failure, dead, waste.'", range:[0,3.75], color1:"Sky"})); 
          
      //comparisonCollection.add(new Comparison.ListModel({traitNames:["list"], speakerNames:speakerCollection, title:"TOP PHRASES", subtitle:"The top twenty phrases of each candidate", uniqueWords:unique2Grams, color1:"Lime"}));
          
      comparisonCollection.add(new Comparison.EmotionModel({traitNames:["anger"], speakerNames:speakerCollection, title:"RAGE", subtitle:"The percentage of words spoken that are angry in some way. ie. 'fight, destroy, annoy.'", range:[0,1.95], color1:"Angry"})); 

      
      //comparisonCollection.add(new Comparison.ListModel({traitNames:["list"], speakerNames:speakerCollection, title:"TOP PHRASES", subtitle:"The top twenty phrases of each candidate", uniqueWords:unique3Grams, color1:"Lime"}));               

      comparisonCollection.add(new Comparison.SpectrumModel({traitNames:["formality"], speakerNames:speakerCollection, title:"SCRIPTED", title2:"CASUAL", subtitle:"Formal speeches, compared to conversations, have more self-references, contain bigger words, and use the present tense less often.", range:[0, 29.0], color1:Ref.formal, color2:Ref.casual, gradient:"gradientFormality", link:"http://homepage.psy.utexas.edu/HomePage/Faculty/Pennebaker/Reprints/PKing1999.pdf"})); 
      
      comparisonCollection.add(new Comparison.SpectrumModel({traitNames:["depression"], speakerNames:speakerCollection, title:"SUICIDAL", title2:"CHEERFUL", subtitle:"Depressed people mention themselves more, use more negative language, use more physical words, and use fewer positive words.", range:[-2.0, 6.0], color1:Ref.depressed, color2:Ref.cheery, gradient:"gradientDisposition", link:"http://homepage.psy.utexas.edu/HomePage/Faculty/Pennebaker/Reprints/Rude.pdf" }));  
      
      comparisonCollection.add(new Comparison.SpectrumModel({traitNames:["honesty"], speakerNames:speakerCollection, title:"TRUTHY", title2:"DECEPTIVE", subtitle:"Compared to liars, truth-tellers tend to use more self-references, provide more detailed descriptions, and use fewer negative words. ", range:[-1, 7.0], color1:Ref.purple, color2:Ref.redOrange, gradient:"gradientHonesty", link:"http://homepage.psy.utexas.edu/HomePage/Faculty/Pennebaker/Reprints/Deception.pdf"}));                   

			// Init landing page.
			var landingView = new Landing.View( {model: new Landing.Model(), navigation: navigationView, transcript: transcriptView, overlay: markupManager, bigWords: bigWordsView, comparisons: comparisonView} );
			// Pass landing view to navigation for menu control.
			navigationView.setLanding(landingView);    
       
      
			// EG Hack to fix loading race condition. calling render().then(... wasn't working above.
			// I'm sure there's a less stupid way to do this.
      //window.setTimeout(function() {	
      // Yup, there is!
      landingView.setElement("#landing").render(); 
       
      // Load from static file.
      if (this.qs.docName) {
	      app.socket.send(JSON.stringify({
	        event: "loadDoc",
	
	        data: {
	          docName: this.qs.docName,
	          delay: parseFloat(this.qs.delay, 100),
	          url: location.host
	        }
	      }));
	      app.setLive(1);
	      app.loadDoc = true;
	    }


      //app.on("ready", function() {
        navigationView.setElement("#navigation").render();
	      comparisonView.setElement("#comparisons > .wrapper").render();
	     	transcriptView.setElement("#transcript > .wrapper"); // Need transcript to point to the actual scrolling DOM element or else scroll event handling is wack
	     	bigWordsView.setElement("#bigWords").render();
	     	
	     	// Init transcript view to hidden. 
	     	// Navigation and bigWords are getting reset in afterRender()
	     	transcriptView.reset();
	     
        (function() {
          // Work with the wrappers, not the actual layers.  --> ???
          var transcript = $("#transcript > .wrapper");
          var comparisons = $("#comparisons > .wrapper");
          var bigWords = $("#bigWords");

          transcript.on("click", ".transcriptSpeaker", function(event) {navigationView.enterComparison(event, "megalist"); });
          //transcript.on("click", ".sentimentClick", function() {navigationView.enterComparison(event, "POSITIVITY");});
          transcript.on("click", ".posemo", function(event) {navigationView.enterComparison(event, "POSITIVITY"); });
          transcript.on("click", ".negemo", function(event) {navigationView.enterComparison(event, "NEGATIVITY"); });
          
//          transcript.on("click", ".traitClick", function() {navigationView.enterComparison(event, "TRUTHY");});
          transcript.on("click", ".ENRAGED", function(event) {navigationView.enterComparison(event, "RAGE");});
          transcript.on("click", ".DETACHED", function(event) {navigationView.enterComparison(event, "SCRIPTED");});
          transcript.on("click", ".SUICIDAL", function(event) {navigationView.enterComparison(event, "SUICIDAL");});
          transcript.on("click", ".HONEST", function(event) {navigationView.enterComparison(event, "TRUTHY");});
          
          transcript.on("click", ".countClick", function(event) {navigationView.enterComparison(event, "megalist");});
          
          var markupNames = ['posemo', 'negemo', 'certain', 'tentat', 'number', 'quote'];          
          transcript.on("click", ".catMarkup", function(ev) {

          	ev.stopPropagation();
          	markupManager.closeCatOverlays();
          	var i;
          	if ($(this).hasClass("posemoMarkup")) i=0;
          	else if ($(this).hasClass("negemoMarkup")) i=1;
          	else if ($(this).hasClass("certainMarkup")) i=2;
          	else if ($(this).hasClass("tentatMarkup")) i=3;
          	else if ($(this).hasClass("numberMarkup")) i=4;
          	else if ($(this).hasClass("quoteMarkup")) i=5;
          
	         	for(var a=0; a<markupNames.length; a++){
	          	if(a==i) $('.'+markupNames[a]+'Markup').addClass('reverse');				// Highlight the chosen category.
	          	else $('.'+markupNames[a]+'Markup:not(.categoryOverlayText)').addClass('grayed');          		// Gray out all the other categories.
          	}
          	
          	//$('.'+markupNames[i]+'Markup').filter('.categoryOverlay').addClass('reverse');
          	/*	// EG Timeouts not being cancelled, so for now forget the timeout.
          	setTimeout(function(){
	          	for(var a=0; a<4; a++){
		          	if(a==i) $('.'+markupNames[a]+'Markup').removeClass('reverse');				
		          	else $('.'+markupNames[a]+'Markup').removeClass('grayed');			
	          	}          		
          	}, 30000);
          	*/
          	markupManager.openCatOverlay(markupNames[i], 30000);          	
          });
          
          //transcript.on("click", function() {markupManager.closeCatOverlays();});
          //bigWords.on("click", function() {markupManager.closeCatOverlays();});
          $('body').on("click", function() {markupManager.closeCatOverlays();});
          comparisons.on("click", function(event) {navigationView.exitComparison(event); });
          
        })();
      //});
     
			// EG Again, stupid hack to fix loading. This seems to work, though: basically, wait until the DOM elements have been set to fire up events. 
      window.setTimeout(function() {
	      app.on("close", function() {
	        console.error("Closed");
	      });
      }, 100);
	     
      app.on("scrollBody", transcriptView.handleScroll, transcriptView);
      app.on("scrollBody:user", transcriptView.handleUserScroll, transcriptView);
      
      app.on("app:initialized", this.loadData);
      
      app.setLive(-1);
      
      // BODY/WINDOW EVENTS
      // ----------------------------------------------------------------------
      
      //Throttle body scroll events and emit them as messages.
      
      
      /* //EG Testing skrollr performance
      var lastScrollY = 0;
      var ticking = false;
      $(window).scroll(_.throttle(function(ev) {
		     	
		     	// Intead of emitting events, keep track of scroll position for requestAnimFrame below.
		     	lastScrollY = document.body.scrollTop;
		     	requestTick();
	     	}, 15));  // 33ms = Approx 30fps
	     	
	     	
	    // EG Trying this as alternative to emitting scroll events.
	    function requestTick() {
		  	if(!ticking){
			  	requestAnimFrame(update);
			  }
			  ticking = true;
			}	
	     
	    function update() {
		  	// Do everything that was previously handled on scroll events.
		    transcriptView.handleScroll(lastScrollY);	
        ticking = false;
	    }
	    */
	    
	     /*
	    (function animloop(){
      	requestAnimFrame(animloop);
      	//render();
      	markupManager.handleScroll(document.body.scrollTop);
      })();
	    */	    
    
			this.initKeyEvents();
			      
      // Automatically load up the first debate for now
      /*if(this.qs.debate)
        app.trigger("debate:change", this.qs.debate);
      else
        app.trigger("debate:change", 1);*/
    },
    
    initialize: function() {

      // Cache the querystring lookup.
      var querystring = location.search.slice(1);

      // For every key/value pair, break into [key] = value onto the `qs`
      // router property.
      Object.defineProperty(this, "qs", {
        // Whenever the property is accessed process the latest value.
        get: function() {
          return querystring.split("&").reduce(function(memo, keyVal) {
            // Break the keyVal string into actual key/value pairs.
            var parts = keyVal.split("=");
            // Assign them into the memoized object, which will be `this.qs`.
            memo[parts[0]] = parts[1];

            return memo;
          }, {});
        }
      });
    },
    
    loadData: function(landing) {
   		var updateBar = function() {
        var percs = [0, 0, 0, 0, 0];

        return function(perc, i) {
          percs[i] = perc;

          window.setTimeout(function() {
            var hr = document.querySelector("#landingSubTitleDiv");
            var total = percs[0] + percs[1] + percs[2];// + percs[3] + percs[4];

            if (hr) {
              hr.style.background = "-webkit-linear-gradient(left, rgb(64,180,230) " +
                total + "%, rgb(78, 78, 74) " + (total) + "%)";
              if (total == 100) app.trigger("landing:activate");
            }
          }, 100);
        };
      }();

    
    	if (app.live) {
	    	for (var i=0; i<3; i++) {
		    	if (i == app.liveDebate) app.trigger("debate:activate", i);
		    	else app.trigger("debate:deactivate", i);
		    	updateBar(100, 0);
	    	}
	    		    	
    	} else {
		    	
		        console.log("fetching");
	      // XHR.
	      [0, 1, 2].forEach(function(i) {
	
		      var messages = new XMLHttpRequest();
		
		      // Opens.
		      messages.open("GET", "/messages/"+i, true);
		
		      // Prog rock.
		      messages.onprogress = function(e) {
		        updateBar(Math.ceil((e.loaded/e.total) * 100/3), i);
		      };
		
		      // Lobes.
		      messages.onload = function(e) {
		   		  
		   		  updateBar(100/3, i);   
		      
		      	if (e.target.responseText.length != 1) {
			        var contents = "[" +
			          e.target.responseText.split("\n").slice(0, -1).join(",") +
			        "]";
			        app.messages[i] = new Message.Collection(JSON.parse(contents));
	
				      app.trigger("debate:activate", i);
			      } else {
				      app.trigger("debate:deactivate", i);
			      }
		      };
		
		
		      // Send!
		      messages.send();
		    });
		    
		    
			  /*var markup = new XMLHttpRequest();
		    markup.open("GET", "/markup", true);
	      markup.onprogress = function(e) {
	        updateBar(Math.ceil((e.loaded/e.total) * 20), 3);
	      };
		    markup.onload = function() {
		      app.markup = markup.responseText;
		      updateBar(20, 3);
		    };
			  markup.send();
			  
			  var bigwords = new XMLHttpRequest();
		    bigwords.open("GET", "/bigwords", true);
	      bigwords.onprogress = function(e) {
	        updateBar(Math.ceil((e.loaded/e.total) * 20), 4);
	      };
		    bigwords.onload = function() {
		      app.bigwords = bigwords.responseText;
		      updateBar(20, 4);
		    };
			  bigwords.send();*/
	
    	}		  
    },
	  
    
    initKeyEvents: function() {
	          // Listen for keydown events.
      var keyboardEnabled = false;	
      
      if(keyboardEnabled){
	      $(document.body).keydown(function(event){
	      	//console.log(event.which);
	      	//g for toggling test grid
	      	if(event.which == 71){
		      	if($('#testGrid').css("visibility") == "visible") $('#testGrid').css("visibility", "hidden");
		      	else $('#testGrid').css("visibility", "visible");
	      	}
	      	//o for toggling overlay visibility
	      	else if(event.which == 79){
		      	//if($('#overlay').css("visibility") == "visible") $('#overlay').css("visibility", "hidden")
		      	//else $('#overlay').css("visibility", "visible")
		      	if($('#overlay').css("display") == "inline") $('#overlay').css("display", "none");
		      	else $('#overlay').css("display", "inline");
	      	}
	      	//t for toggling transcript
	      	else if(event.which == 84){	
						//app.trigger("keypress:test", {type:"overlay", kind:"trait"});
	
						if($('#transcript > .wrapper').css("visibility") == "visible") $('#transcript > .wrapper').css("visibility", "hidden");
		      	else $('#transcript > .wrapper').css("visibility", "visible");
					}
					//w 
					else if(event.which == 87){	
						//for skrollr object switching
						//if(app.skrollr._skrollElement == null) app.skrollr.setSkrollElement("")
						//app.skrollr.resetSkrollElement();						
					}
					//p 
					else if(event.which==80){	
						// Inserting test parallax objects.
						// app.trigger("keypress:test", {type:"testParallax"});
						// var el = $('#comparisons > .wrapper').get(0);
						//console.log("setSkrollElement("+el+")");
						//app.skrollr.setSkrollElement(el);
					}
					//z To nudge parallax test objects left
					else if(event.which==90){	
						$('#testZ6').css("left", (parseInt($('#testZ6').css("left")) - 1));
						//console.log("left = "+parseInt($('#testZ6').css("left")));
					}
					//x  To nudge parallax test objects right
					else if(event.which==88){	
						$('#testZ6').css("left", (parseInt($('#testZ6').css("left")) + 1));
						//console.log("left = "+parseInt($('#testZ6').css("left")));
					}
					//q Test top words.
					else if(event.which==81){
						var sp = 1;
						var top20 = uniqueWords.getTopPhrases(sp);
						for(var i=0; i<20; i++){
							console.log(i+" = "+top20[i]['word']+" > "+top20[i]['count']);
						}
					}
					
					else if (event.which==77) //m
					{
						//app.trigger("keypress:test", {type:"overlay", kind:"traitObama"});
						app.live = true;
						app.liveDebate = 0;
						app.trigger("app:setLive", 0);
					}
					
					else if (event.which==78) //n
					{
						//app.trigger("keypress:test", {type:"overlay", kind:"traitRomney"});
						app.live = false;
						app.liveDebate = -1;
						app.trigger("app:setLive", -1);
					}
					
	      });      
      }

    }
  });


  return Router;

});
