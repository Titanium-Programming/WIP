(function() {
	"use strict";
	{
		var canvas = document.getElementById("canvas"), //gets the canvas
		ctx = canvas.getContext("2d"), //gets a 2d context
		cfces = (function() {
			void(!ctx && (alert("Your browser does not support the HTML5 canvas element")));
		})(), //check for canvas element supported
		system = {
			frames: 0, //frames displayed
			fps: {
				start: 0, // the starting time
				frames: 0, //the current frame
				fps: 0, //the frames per second
				pfps: 0, //the past fps
				update: function() {
					this.pfps = Math.round((this.frames / (((new Date().getTime()) - this.start) / 1000))); // makes the past FPS the current frame divied by (the current time minus the start time divided by 1000)
					this.frames++; // makes the frame number increase
					void((((new Date().getTime()) - this.start) / 1000) > 1 && ((this.start = new Date().getTime()) + (this.frames = 0))); // if the current time minus the start time divided by 1000 is bigger than 2, make the start time the currrent time and make frames 0
					this.fps = this.pfps === NaN ? this.fps : this.pfps; // if the past FPS is not a number, do nothing, otherwise, turn it to the past FPS
				}, // updates the frames per second
			}, // the frames per second (credits to @willard12 for helping)
			mouse: {
				x: 0, // the x position of the mouse
				y: 0, // the y position of the mouse
				clicked: false // did the user click there mouse?
			} // the mouse
		}, // the system

		smooth = function(pos, dest, time) {
			return (dest - pos) / time;
		}, // the smooth function (credits to loyalty (https://www.khanacademy.org/profile/loyaltyKA))

		drawFish = function(x, y, w /*width*/ , h /*eight*/ , c /*olor*/ , s /*peed*/ ) {
			void(s === null || s === undefined && (s = 0)); // if the speed is undefined or null, just make the speed to 0
			s *= 10; // makes the fish tail faster
			ctx.save(); // saves the matrixes (translate, scale, rotate)
			ctx.translate(x - (w / 2), y - (h / 2)); // moves the fish to the center
			ctx.scale(w / 275, h / 120); // resizes the fish
			ctx.fillStyle = c; // fills it the color you pass in
			ctx.beginPath(); // starts the head
			ctx.ellipse(175, 60, 200 / 2, 117 / 2, 0, 0, Math.PI * 2); // the head
			ctx.fill(); // fills the head
			ctx.beginPath(); // starts the tail
			ctx.lineTo(75, 60); // the tail
			ctx.lineTo((Math.cos((system.frames * s) / 180 * Math.PI) * 50), 120); // the tail
			ctx.lineTo((Math.cos((system.frames * s) / 180 * Math.PI) * 50), 0); // the tail
			ctx.fill(); // fills the tail
			ctx.fillStyle = "black"; // fills the eye black
			ctx.beginPath(); // starts the circle
			ctx.ellipse(241, 60, 20 / 2, 20 / 2, 0, 0, Math.PI * 2); // the eye
			ctx.fill(); // fills the circle
			ctx.restore(); // popMatrix();
		}, // the draw fish function (credits to pamela fox)
		transition = {
			x: -1373, // the x position of the fish
			active: false, // is the transition active?
			to: "", // where to go after the transition
			color: "rgb(" + (Math.random() * 255) + ", " + (Math.random() * 255) + ", " + (Math.random() * 255) + ")", // the color of the fish
			run: function() {
				this.x += 30; // makes the x position increase with the velocity
				drawFish(this.x, 300, 1587, 681, this.color, 0); // draws a fish in its position
				void(this.x >= 78 && (scene = this.to)); // if the transition covered the screen, change the scene to this.to
				void(this.x >= 1388 && ((this.active = false) + (this.x = -1373) + (this.color = "rgb(" + (Math.random() * 255) + ", " + (Math.random() * 255) + ", " + (Math.random() * 255) + ")"))); // if the transition is over, just stop it
			}, // runs the transition
		}; // the transition
	} // sets the canvas
	{
		var introParticles = [], // a array to store the intro particles
			IntroParticle = function() {
				this.choice = Math.round(Math.random()); // the choice
				this.x = Math.random() * canvas.width; // makes the position random
				this.y = Math.random() * canvas.height; // makes the position random
				this.a = 0; // the alpha
				switch (this.choice) {
					case 0: // if the choice is 1
						this.realX = Math.random() * (canvas.width / 2.325581395348837 - canvas.width / 1.818181818181818) + canvas.width / 1.818181818181818; // make the stick on the top of the T
						this.realY = Math.random() * (canvas.height / 3.333333333333333 - canvas.height / 1.428571428571429) + canvas.height / 1.428571428571429; // make the stick on the top of the T
						break;
					case 1: // if the choice is 1
						this.realX = Math.random() * (canvas.width / 2.941176470588235 - canvas.width / 1.51515151515151) + canvas.width / 1.51515151515151; // make the stick on the bottom of the T
						this.realY = Math.random() * (canvas.height / 5.813953488372093 - canvas.height / 3.333333333333333) + canvas.height / 3.333333333333333; // make the stick on the bottom of the T
				}
				//updates the particle
				this.update = function() {
					this.x += smooth(this.x, this.realX, 60); // makes the position become the real position
					this.y += smooth(this.y, this.realY, 60); // makes the position become the real position
					this.a += smooth(this.a, 255, 60); // makes the alpha smoothly get to 255
					ctx.fillStyle = "rgb(0, " + (Math.abs(Math.sin((this.x + this.y + system.frames) / 180 * Math.PI) * (255 - 150) + 150)) + ", 0, " + (this.a / 255) + ")"; // fills it from green to black
					ctx.fillRect(this.x, this.y, canvas.width / 25, canvas.height / 25); // the particle
				};
			}; // the intro particle constructor
	} // the intro stuff
	{
		var track = [
			{
				x: 0,
				y: 0
			},
			{
				x: 220,
				y: 220
			},
			{
				x: 110,
				y: 260
			},
			{
				x: 600,
				y: 600
			}
		], // the track
			baseHealth = 100, // the base health
			evilFishs = [], // a array to store evil fishs
			EvilFish = function(config) {
				this.x = track[0].x; // the position of the fish
				this.y = track[0].y; // the position of the fish
				this.step = 1; // the current step
				this.speed = config.speed || 1; // the speed
				this.isAtEndOfTrack = false; // did the fish go the the end of the track?
				this.update = function() {
					this.x += Math.sin((Math.atan2(this.x - track[this.step].x, this.y - track[this.step].y) * 180 / Math.PI) / 180 * Math.PI) * this.speed; // make the fish follow the track
					this.y += Math.cos((Math.atan2(this.x - track[this.step].x, this.y - track[this.step].y) * 180 / Math.PI) / 180 * Math.PI) * this.speed; // make the fish follow the track

					if (Math.round(this.x) === track[this.step].x && Math.round(this.y) === track[this.step].y) {
						if (this.step !== 3) {
							this.step ++; // make it follow the next track
						} // if the current step is not 3
						else {
							this.isAtEndOfTrack = true; // make this.isAtEndOfTrack to true
						}
					} //if the fish is at the track

				}; // updates the fish
			}; // the evil fish constructor
	} // the game stuff
	{
		var backgroundFishies = [], // a array to store the background fishies
			BackgroundFishie = function(size) {
				this.x = Math.random() * (650 - (-50)) + -50; // the position of the fish
				this.y = Math.random() * 600; // the position of the fish
				this.speedX = Math.random() * (7 - (-7)) + -7; // the speed
				this.speedY = ((Math.random() * (7 - 5) + 5) / 5) + (size / 20); // the speed
				void(this.speedX < 3 && this.speedX > 0 && (this.speedX += 2 + (this.speedY += 0.2))); // makes it not to slow
				void(this.speedX > -3 && this.speedX < 0 && (this.speedX -= 2 + (this.speedY += 0.2))); // makes it not to slow
				this.color = "rgb(" + (Math.random() * 255) + ", " + (Math.random() * 255) + ", " + (Math.random() * 255) + ")"; // the color
				this.update = function() {
					this.x += this.speedX; // makes the x position increase by the speed
					this.y += this.speedY; // make it fall
					void(this.speedX < 0 && (drawFish(this.x, this.y, -50 - size, 21.81818181818182 + size, this.color, size))); // if the x speed is less than 0, make the fish face the left
					void(this.speedX > 0 && (drawFish(this.x, this.y, 50 + size, 21.81818181818182 + size, this.color, size))); // if the x speed is greater than 0, make the fish face the right
					void(this.x > 650 && (this.x = -50)); // makes it not get out of the canvas
					void(this.x < -50 && (this.x = 650)); // makes it not get out of the canvas
					void(this.y > 650 && (this.y = -50)); // makes it not get out of the canvas
				}; // updates the fish
			}, // the background fishies
			background = function() {
				ctx.fillStyle = "rgb(12, 152, 245)"; // fills the background blue
				ctx.fillRect(0, 0, 600, 600); // the background
				for (var i = backgroundFishies.length - 1; i >= 0; i--) {
					backgroundFishies[i].update(); // updates all of the fishs
				} // loops through the fishs
			}, // the background
			addFish = (function() {
				for (var i = 0; i < 15; i++) {
					backgroundFishies.push(new BackgroundFishie(i / 2));
				}
			})(); // adds 15 fishies for the background
	} // the background stuff
	{
		var Button = function(config) {
				this.x = config.x || 0; // the x position
				this.y = config.y || 0; // the y position
				this.w = config.w || 100; // the height
				this.h = config.h || 50; // the width
				this.lY = 0; // the blue things
				this.func = config.func || function() {}; // what to do when the mouse is clicked
				this.txt = config.txt || ""; // the label
				this.update = function() {
					if (system.mouse.x > this.x - (this.w / 2) && system.mouse.x < this.x + (this.w / 2) && system.mouse.y > this.y - (this.h / 2) && system.mouse.y < this.y + (this.h / 2)) {
						this.lY += smooth(this.lY, this.h / 2, 10); // make this.lY smoothly get to the height
						if (system.mouse.clicked && !transition.active) {
							this.func(); // do this.func
						} // if the mouse is clicked and the transition is not active
						canvas.style.cursor = "pointer"; // change the cursor to pointer
					} // if the mouse is inside the button
					else {
						this.lY += smooth(this.lY, 0, 10); // make this.lY smoothly get to 0
					} // if the mouse is not in the button
					ctx.strokeStyle = "white"; // adds a white stroke
					ctx.strokeRect(this.x - (this.w / 2), this.y - (this.h / 2), this.w, this.h); // the button
					ctx.fillStyle = "rgb(0, 0, 255, 0.2)"; // fills it a transparent blue
					ctx.fillRect(this.x - (this.w / 2), this.y - (this.h / 2), this.w, this.lY); // the top rectangle
					ctx.fillRect(this.x - (this.w / 2), this.y + (this.h / 2), this.w, this.lY * -1); // the bottom rectangle
					ctx.fillStyle = "white"; // fills it white
					ctx.textAlign = "center"; // aligns the text to the center
					ctx.textBaseline = "middle"; // aligns the text to the center
					ctx.font = "20px sans-serif"; // makes the text size 20 pixels
					ctx.fillText(this.txt, this.x, this.y); // displays the text
				}; // updates the button
			}, // the button constructor

			cfc = (function() {if (window.document.querySelectorAll("meta[content*=Titanium]").length < 1) {throw "Please don\'t copy my work.";}})(),

			playBtn = new Button({
				x: 300, // the x position
				y: 350, // the y position
				txt: "Play", // the label
				func: function() {
					//transition.active = true; // make the transition active
					//transition.to = "game"; // make the transition go to the game
				} // what to do when the button is pressed
			}), // the game button
			creditsBtn = new Button({
				x: 300, // the x position
				y: 250, // the y position
				txt: "Credits", // the label
				func: function() {
					transition.active = true; // make the transition active
					transition.to = "credits"; // make the transition go to the credits
				} // what to do when the button is pressed
			}), // the credits button
			aboutBtn = new Button({
				x: 500, // the x position
				y: 350, // the y position
				txt: "About", // the label
				func: function() {
					transition.active = true; // make the transition active
					transition.to = "about"; // make the transition go to the about page
				} // what to do when the button is pressed
			}), // the about button
			storyBtn = new Button({
				x: 100, // the x position
				y: 350, // the y position
				txt: "Story", // the label
				func: function() {
					transition.active = true; // make the transition active
					transition.to = "story"; // make the transition go to the story page
				} // what to do when the button is pressed
			}), // the story button
			howBtn = new Button({
				x: 300, // the x position
				y: 450, // the y position
				txt: "How", // the label
				func: function() {
					transition.active = true; // make the transition active
					transition.to = "how"; // make the transition go to the how
				} // what to do when the button is pressed
			}), // the how button
			backBtn = new Button({
				x: 300, // the x position of the button
				y: 500, // the y position of the button
				w: 200, // the height
				h: 70, // the width
				txt: "Back", // the label
				func: function() {
					transition.active = true; // make the transition active
					transition.to = "menu"; // make the transition go to the menu
				} // what to do when the button is pressed
			}); // the back button
	} // buttons
	{
		var scene = "intro", // the current scene
			scenes = {
				intro: function() {
					ctx.fillStyle = "black"; // fills the background black
					ctx.fillRect(0, 0, 600, 600); // the background
					for (var i = 0; i < introParticles.length; i++) {
						introParticles[i].update(); // updates all of the particles
					} // goes through all of the particles
					void(introParticles.length < 160 && (introParticles.push(new IntroParticle()))); // if there is less than 160 particles, add a new particle
					void(system.frames > 500 && (transition.active = true + (transition.to = "menu"))); // if the frame is greater than 500, make the transition stop
				}, // the intro
				menu: function() {
					background(); // adds a background
					ctx.font = "102px impact"; // makes the text size 102 pixels
					ctx.strokeStyle = "white"; // adds a white stroke
					ctx.lineWidth = 2; // adds a 2 pixel stroke
					ctx.textAlign = "center"; // aligns the text to the center
					ctx.textBaseline = "middle"; // aligns the text to the center
					ctx.strokeText("Fish Tank", 300, 89); // the title
					ctx.textAlign = "right"; // aligns the text to the right
					ctx.textBaseline = "top"; // aligns the text to the top
					ctx.font = "26px impact"; // makes the text size 26 pixels
					ctx.fillStyle = "white"; // fills it white
					ctx.fillText("By: \xA9 2020 Titanium Programming", 499, 130); // the creator DO NOT CHANGE
					playBtn.update(); // updates the play button
					creditsBtn.update(); // updates the credits button
					howBtn.update(); // updates the how button
					aboutBtn.update(); // updates the about button
					storyBtn.update(); // updates the story button
				}, // the menu
				credits: function() {
					background(); // adds the background
					ctx.font = "102px impact"; // makes the font size 102 pixels
					ctx.strokeStyle = "white"; // adds a white stroke
					ctx.lineWidth = 2; // adds a 2 pixel stroke
					ctx.textAlign = "center"; // aligns the text
					ctx.textBaseline = "middle"; // aligns the text
					ctx.strokeText("Credits", 300, 89); // the title
					var txt = "Doctor317 - try {} catch() {}\n\nCaven P./Loyalty - smooth function\n\nPamela Fox - fish graphics\n\nWillard - helping with the FPS counter"; // the text
					ctx.fillStyle = "white"; // fills the text white
					ctx.font = "20px sans-serif"; // makes the font size 20 pixels
					ctx.save(); // saves the matrixes
					ctx.translate(0, -((txt.split("\n").length * 20) / 2)); // aligns the text
					for (var i = 0; i < txt.split("\n").length; i++) {
						ctx.fillText(txt.split("\n")[i], 300, (300 + (i * 20))); // displays the text
					} // loops through the text
					ctx.restore(); // gets rid of matrixes
					backBtn.update(); // updates the back
				}, // credits
				how: function() {
					background(); // adds the background
					ctx.font = "102px impact"; // makes the font size 102 pixels
					ctx.strokeStyle = "white"; // adds a white stroke
					ctx.lineWidth = 2; // adds a 2 pixel stroke
					ctx.textAlign = "center"; // aligns the text
					ctx.textBaseline = "middle"; // aligns the text
					ctx.strokeText("How", 300, 89); // the title
					var txt = "Click on the shop button and click on any\ntower to buy it, the towers shoot will enemy\nthat\'s the closest to the tower. Try to make\nthe enemy fishes stay out of your fish country\nor else... idk"; // the text
					ctx.fillStyle = "white"; // fills the text white
					ctx.font = "20px sans-serif"; // makes the font size 20 pixels
					ctx.save(); // saves the matrixes
					ctx.translate(0, -((txt.split("\n").length * 20) / 2)); // aligns the text
					for (var i = 0; i < txt.split("\n").length; i++) {
						ctx.fillText(txt.split("\n")[i], 300, (300 + (i * 20))); // displays the text
					} // loops through the text
					ctx.restore(); // gets rid of matrixes
					backBtn.update(); // updates the back button
				}, // how
				about: function() {
					background();
					ctx.font = "102px impact"; // makes the text 102 pixels tall
					ctx.strokeStyle = "white"; // adds a white stroke
					ctx.lineWidth = 2; // makes the text thicker
					ctx.textAlign = "center"; // aligns the text
					ctx.textBaseline = "middle"; // aligns the text
					ctx.strokeText("About", 300, 89); // the title
					var txt = "This program was made because I was\nbored."; // the text
					ctx.fillStyle = "white"; // fills the text white
					ctx.font = "20px sans-serif"; // makes the text size bigger
					ctx.textAlign = "center"; // aligns the text
					ctx.textBaseline = "middle"; // aligns the text
					ctx.save(); // saves the matrixes
					ctx.translate(0, -((txt.split("\n").length * 20) / 2)); // aligns the text
					for (var i = 0; i < txt.split("\n").length; i++) {
						ctx.fillText(txt.split("\n")[i], 300, (300 + (i * 20))); // displays the text
					} // goes though the text
					ctx.restore(); // restores the matrixes
					backBtn.update(); // updates the back button
				}, // about
				story: function() {
					background();
					ctx.font = "102px impact"; // makes the text size 102 pixels
					ctx.strokeStyle = "white"; // adds a white stroke
					ctx.lineWidth = 2; // adds a stroke weight of 2 pixels
					ctx.textAlign = "center"; // aligns the text to the center
					ctx.textBaseline = "middle"; // aligns the text to the center
					ctx.strokeText("Story", 300, 89); // the text that says "story"
					var txt = "Fish war III just started\nand some fish country\nrandomly started to send\na bunch of fish troops to\nattack your fish country"; // the text
					ctx.fillStyle = "white"; // fills it white
					ctx.font = "20px sans-serif"; // makes the text size 20 pixels
					ctx.textAlign = "center"; // aligns the text to the center
					ctx.textBaseline = "middle"; // aligns the text to the center
					ctx.save(); // saves the matrixes
					ctx.translate(0, -((txt.split("\n").length * 20) / 2)); // aligns the text
					for (var i = 0; i < txt.split("\n").length; i++) {
						ctx.fillText(txt.split("\n")[i], 300, (300 + (i * 20))); // displays the text
					} // goes though the text
					ctx.restore(); // gets rid of matrixes
					backBtn.update(); // updates the back button
				}, // the story
			}; // the scenes
	} // the scenes
	{
		var loop = setInterval(function() {
			try {
				canvas.style.cursor = "default"; // changes the cursor to default
				system.frames++; // increases the frame counter
				ctx.clearRect(0, 0, 600, 600); // clears the canvas
				scenes[scene](); // does whats in the current scene
				ctx.textAlign = "left"; // aligns the text to the left
				ctx.textBaseline = "top"; // aligns the text to the top
				ctx.font = "12px arial, sans-serif"; // makes the text size 12 pixels
				system.fps.update(); // updates the frames per second
				ctx.fillStyle = "black"; // fills the fps black
				ctx.fillText("FPS: " + system.fps.fps, 0, 0); // the frames per second
				void(transition.active && (transition.run())); // if the transition is active, run the transition
				system.mouse.clicked = false; // turns clicked to false
			} //trys to catch errors
			catch (err) {
				clearInterval(loop); // stops the loop
				console.error("Something went wrong\n" + err); // adds a error in the console
			} // if the computer catches a error
			canvas.style.marginLeft = window.innerWidth / 2 - (canvas.width / 2) + "px"; // aligns the canvas
			canvas.style.marginTop = window.innerHeight / 2 - (canvas.height / 2) + "px"; // aligns the canvas
		}, 1000 / 60); // does this 60 times a second
	} // the loop
	{
		canvas.addEventListener("click", function(event) {
			event.preventDefault(); // makes the normal stuff not happen
			system.mouse.clicked = true; // makes mouse.clicked true
		}); // adds a event listener for mouse clickes
		canvas.addEventListener("mousemove", function(event) {
			event.preventDefault(); // makes the normal stuff not happen
			system.mouse.x = event.layerX; // updates the mouse coordinates
			system.mouse.y = event.layerY; // updates the mouse coordinates
		}); // adds a event listener for mouse moves
	} // event listeners
})()
