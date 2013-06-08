var spriteDim = 16;
var width = 40;
var height = 40;

var recording=false;
var targetsHit = 0.0;
var timesShot = 0.0;
var accuracy = 0.0;
var targetArray = new Array(width);
for (var i=0; i< width; i++) {
	targetArray[i] = new Array(height);
}

var theHittext;
var theAcctext;

//Sound variable
var sound=true;
var soundText;

//Timer variables
var timer;
var time = 0;
var timerText;
var timerText2;

//Timed Drill variables
var aimingCenter = true;
var currentAim=0;
var drillTargets;

//Drill runs
var drill1Targets = [[20,16],[16,20],[20,16],[24,20]];
var drill2Targets = [[20,16],[20,12],[20,8],[20,4],[16,20],[12,20],[8,20],[4,20],[20,24],[20,28],[20,32],[20,36],[24,20],[28,20],[32,20],[36,20]];
var drill3Targets = [[20,4],[4,20],[20,36],[36,20],[20,4],[4,20],[20,36],[36,20],[20,4],[4,20],[20,36],[36,20],[20,4],[4,20],[20,36],[36,20],[20,4],[4,20],[20,36],[36,20]];


window.onload = function () {
    //start crafty
    Crafty.init(width*spriteDim, height*spriteDim);
    Crafty.canvas.init();
    
    //turn the sprite map into usable components
    Crafty.sprite(spriteDim, "sprite.png", {
        def_target: [0, 0],
        live_target: [1, 0],
        hit_target: [2, 0],
        empty: [4, 0]
    });


    //the loading screen that will display while our assets load
    Crafty.scene("loading", function () {
        //load takes an array of assets and a callback when complete
        Crafty.load(["sprite.png","Button1.png","Button1P.png"], function () {
            //when everything is loaded, run the main scene
			Crafty.scene("MainMenu"); 
        });

        Crafty.audio.add("skorpion",["skorpion.wav"]);

        //black background with some loading text
        Crafty.background("#000");
        Crafty.e("2D, DOM, Text").attr({ w: 150, h: 50, x: 10, y: 10 })
            .text("Loading")
            .css({"color":"white;"});
    });

    //automatically play the loading scene
    Crafty.scene("loading");
	
    Crafty.scene("MainMenu", function() {
        targetsHit=0;
        timesShot=0;
		recording=false;
		endDrill();
        Crafty.e("2D, DOM, Text").attr({ w: 150, h: 50, 
										 x: 250, y: 150 , z:900 })
            .text(function () { return "Welcome to Muscle Memory Training"})
            .css({'color':"white","text-align":"center"});

        Crafty.e("2D,DOM,Text,Mouse")
            .attr({w:150,h:50,x:(270),y:(400),z:900})
        	.text(function() { return "Free Practice"})
			.bind('Click',function() {Crafty.scene("FreePlay")})
            .areaMap([0,0], [150,0], [150,50], [0,50]);    

		Crafty.e("2D, DOM, Text, Mouse").attr({ w: 150, h: 50, 
												x: 250, y: 450 , z:900 })
            .text(function () { return "Timed Drill"})
            .css({'color':"white","text-align":"center"})
			.bind('Click',function() {Crafty.scene("Drill")})
			.areaMap([0,0], [150,0], [150,50], [0,50]);


		Crafty.e("2D, DOM, Text, Mouse").attr({ w: 150, h: 50, 
												x: 0, y: 600 , z:900 })
            .text(function () { return "Sound: "})
            .css({'color':"white","text-align":"center"})
			.bind('Click',function() {sound=!sound;generateSoundText();})
			.areaMap([0,0], [150,0], [150,50], [0,50]);
		generateSoundText();
	});

	

	Crafty.scene("DrillResults", function() {
		timesShot++;
		Crafty.e("2D, DOM, Text").attr({ w: 170, h: 150, 
										 x: 250, y: 150 , z:900 })
            .text(function () { 
				return "<p>Drill Results: <br> Hits: "+targetsHit+
					"<br>Accuracy: "+((targetsHit/timesShot)*100).toFixed(2)
					+"<br>Time Lapsed: "+time+"</p>"})
            .css({'color':"white","text-align":"center"});
		
		Crafty.e("2D, DOM, Text, Mouse")
			.attr({w: 150, h: 50, 
				   x:250, 
				   y:550, 
				   z:900 })
            .text(function () { return "Main Menu"})
			.bind('Click',function () {Crafty.scene("MainMenu")})
			.areaMap([0,0],[150,0],[150,50],[0,50])
            .css({'color':"white","text-align":"center"});
		accuracy=0.0;
	});



    //method to generate the map
    function generateWorld() {
        //loop through all tiles
		var putTile=false;
        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
				//This creates the "+"
                if ((i==width/2 && j % 4===0 && j>0) || 
					(j==width/2 && i % 4===0 && i>0) ) {
					console.log("i: "+i+" j: "+j);
					targetArray[i][j] = Crafty.e("2D, DOM, solid, DefaultTarget, Mouse, def_target")
						.attr({ x: i * spriteDim, y: j * spriteDim, z: 2 })
						.areaMap([0,0], [spriteDim,0], 
								 [spriteDim,spriteDim], [0,spriteDim]);
				} 
				
				//This creates the "x"
				if ( ((i+j)%8==0) && 
					 ((i-j)===0 || 
					  ((i+j)===(width) && i%4==0)) && 
					 i>0 && !(i==(width/2)&&j==(height/2))) {
                    targetArray[i][j] = Crafty.e("2D, DOM, solid, DefaultTarget, Mouse, def_target")
						.attr({ x: i * spriteDim, y: j * spriteDim, z: 2 })
						.areaMap([0,0], [spriteDim,0], 
								 [spriteDim,spriteDim], [0,spriteDim]);
				} 	
			}
        }

    }

	//method to generate the map
    function generateDrillWorld() {
        //loop through all tiles
        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
				//This creates the "+"
                if ((i==width/2 && j % 4===0 && j>0) || 
					(j==width/2 && i % 4===0 && i>0) ) {
					console.log("i: "+i+" j: "+j);
					targetArray[i][j] = Crafty.e("2D, DOM, solid, InvalidTarget, Mouse, def_target")
						.attr({ x: i * spriteDim, y: j * spriteDim, z: 2 })
						.areaMap([0,0], [spriteDim,0], 
								 [spriteDim,spriteDim], [0,spriteDim]);
                } 
				
				//This creates the "x"
				if ( ((i+j)%8==0) && 
					 ((i-j)===0 || ((i+j)===(width) && 
									i%4==0)) && i>0 && 
					 !(i==(width/2)&&j==(height/2))) {
                    targetArray[i][j] = Crafty.e("2D, DOM, solid, InvalidTarget, Mouse, def_target")
						.attr({ x: i * spriteDim, y: j * spriteDim, z: 2 })
						.areaMap([0,0], [spriteDim,0], 
								 [spriteDim,spriteDim], [0,spriteDim]);
                } 
            }
        }

    }

    Crafty.c('DefaultTarget', {
        init: function() {
            var target = this;
            this.requires('Grid')
				.bind('MouseDown', function() {
                    this.destroy();
                    targetsHit++;
                    updateText();
                    Crafty.e("HitRespawn").attr({ z:9000 }).col(this.col()).row(this.row())
				});
        },
    });

	Crafty.c('CurrentTarget', {
        init: function() {
            var target = this;
            this.requires('Grid')
				.bind('MouseDown', function() {
                    this.destroy();
                    targetsHit++;
					if (aimingCenter===true) {
						//We just hit the center, so aim at the next spot
						aimingCenter=false;
					
						//make the center invalid
						targetArray[width/2][height/2] = 
							Crafty.e("2D, DOM, solid, InvalidTarget, Mouse, def_target")
							.attr({ x: (width/2) * spriteDim, 
									y: (height/2) * spriteDim, z: 2 })
							.areaMap([0,0], [spriteDim,0], 
									 [spriteDim,spriteDim], [0,spriteDim]);
						
						Crafty.e("HitDie").attr({ z:9000 }).col(this.col()).row(this.row())
						
						//set the next target
						var result = drillTargets[currentAim];
						var i = result[0];
						var j = result[1];
						targetArray[i][j].destroy();
						targetArray[i][j] = 
							Crafty.e("2D, DOM, solid, CurrentTarget, Mouse, live_target")
							.attr({ x: i * spriteDim, 
									y: j * spriteDim, z: 200 })
							.areaMap([0,0], [spriteDim,0], 
									 [spriteDim,spriteDim], [0,spriteDim]);
					} else {
						if (currentAim===(drillTargets.length-1)) {
							endDrill();
							Crafty.scene("DrillResults");
							return;
						} else {
							//We need to hit the center now
							aimingCenter=true;
							
							//replace the target we hit with an invalid one
							var oldtarget = drillTargets[currentAim];
							var oldi = oldtarget[0];
							var oldj = oldtarget[1];
							targetArray[oldi][oldj].destroy();
							targetArray[oldi][oldj] = Crafty.e("2D, DOM, solid, InvalidTarget, Mouse, def_target")
								.attr({ x: oldi * spriteDim, 
										y: oldj * spriteDim, z: 2 })
								.areaMap([0,0], [spriteDim,0], 
										 [spriteDim,spriteDim], [0,spriteDim]);
							
							//increment for the next shot
							currentAim++;
							
							//make the center our current target
							targetArray[width/2][height/2].destroy();
							targetArray[width/2][height/2] = Crafty.e("2D, DOM, solid, CurrentTarget, Mouse, live_target")
								.attr({ x: (width/2) * spriteDim, 
										y: (height/2) * spriteDim, z: 2 })
								.areaMap([0,0], [spriteDim,0], 
										 [spriteDim,spriteDim], [0,spriteDim]);
						}
						updateText();
						Crafty.e("HitDie").attr({ z:9000 }).col(this.col()).row(this.row())
					}
				});
        },
    });

	Crafty.c('InvalidTarget', {
        init: function() {
            var target = this;
            this.requires('Grid')
				.bind('MouseDown', function() {
                    updateText();
				});
        },
	});

    Crafty.c('HitRespawn', {
        init: function() {
            this.requires("2D, DOM, SpriteAnimation, hit_target, Grid, Mouse")
                .bind('MouseDown', function() {
                    this.destroy();
                    targetsHit++;
                    updateText();})
                .areaMap([0,0], [spriteDim,0], 
						 [spriteDim,spriteDim], [0,spriteDim])
                .timeout(function() {
                    this.destroy();
                    Crafty.e("2D, DOM, solid, DefaultTarget, Mouse, def_target")
						.attr({ z:9000 }).col(this.col()).row(this.row())
						.areaMap([0,0], [spriteDim,0], 
								 [spriteDim,spriteDim], [0,spriteDim]);
                }, 200);
        }
    });


    Crafty.c('HitDie', {
        init: function() {
            this.requires("2D, DOM, SpriteAnimation, hit_target, Grid, Mouse")
                .bind('MouseDown', function() {
                    this.destroy();
                    targetsHit++;
                    updateText();})
                .areaMap([0,0], [spriteDim,0], 
						 [spriteDim,spriteDim], [0,spriteDim])
                .timeout(function() {
                    this.destroy();
                }, 200);
        }
    });

    Crafty.c('Grid', {
        _cellSize: spriteDim,
        Grid: function(cellSize) {
            if(cellSize) this._cellSize = cellSize;
            return this;
        },
        col: function(col) {
            if(arguments.length === 1) {
                this.x = this._cellSize * col;
                return this;
            } else {
                return Math.round(this.x / this._cellSize);
            }
        },
        row: function(row) {
            if(arguments.length === 1) {
                this.y = this._cellSize * row;
                return this;
            } else {
                return Math.round(this.y / this._cellSize);
            }
        },      
        snap: function(){
            this.x = Math.round(this.x/this._cellSize) * this._cellSize;
            this.y = Math.round(this.y/this._cellSize) * this._cellSize;
        }
    });
    
    

    Crafty.scene("FreePlay", function () {
        generateWorld();
        resetCounters();

		
		theHittext = Crafty.e("2D, DOM, Text").attr({ w: 150, h: 50, 
													  x: 10, y: 10 })
			.text(function () { return "Targets Hit: "+targetsHit})
			.css({"color":"white;"});;
		theAcctext = Crafty.e("2D, DOM, Text").attr({ w: 150, h: 80, 
													  x: 10, y: 50 })
			.text(function () { return "Targets Hit: "+targetsHit})
			.css({"color":"white;"});
		
		updateText();
		recording=true;
		Crafty.e("2D, DOM, Text, Mouse")
			.attr({w: 150, h: 50, 
				   x:((width*spriteDim)-(width*5)), 
				   y:((height*spriteDim)-(height)), 
				   z:900 })
            .text(function () { return "Main Menu"})
			.bind('Click',function () {Crafty.scene("MainMenu")})
			.areaMap([0,0],[150,0],[150,50],[0,50])
            .css({'color':"white","text-align":"center"});
		
        document.body.onmousedown = function() {
            if (recording) {
				timesShot++;
				if (sound) {
					Crafty.audio.play("skorpion");
				}
				updateText();
			}
        };
    });


	Crafty.scene("Drill", function () {
        Crafty.e("2D, DOM, Text").attr({ w: 350, h: 50, 
										 x: 150, y: 150 , z:900 })
            .text(function () { return "Click below to run a timed drill. For these you want to click the green target. Anything else will be a miss. The faster the time, the better."})
            .css({'color':"white","text-align":"center"});
		
		Crafty.e("2D, DOM, Text, Mouse")
			.attr({ w: 250, h: 50, x: 200, y: 350 , z:900 })
            .text(function () { return "1: Simple"})
			.bind('Click', function() {Crafty.scene("Drill1")})
			.areaMap([0,0],[150,0],[150,50],[0,50])
            .css({'color':"white","text-align":"center"});

		Crafty.e("2D, DOM, Text, Mouse")
			.attr({ w: 250, h: 50, x: 200, y: 400 , z:900 })
            .text(function () { return "2: Short Progression"})
			.bind('Click', function() {Crafty.scene("Drill2")})
			.areaMap([0,0],[150,0],[150,50],[0,50])
            .css({'color':"white","text-align":"center"});

		Crafty.e("2D, DOM, Text, Mouse")
			.attr({ w: 250, h: 50, x: 200, y: 450 , z:900 })
            .text(function () { return "3: Long Flicks"})
			.bind('Click', function() {Crafty.scene("Drill3")})
			.areaMap([0,0],[150,0],[150,50],[0,50])
            .css({'color':"white","text-align":"center"});

		Crafty.e("2D, DOM, Text, Mouse")
			.attr({w: 150, h: 50, 
				   x:((width*spriteDim)-(width*5)), 
				   y:((height*spriteDim)-(height)), 
				   z:900 })
            .text(function () { return "Main Menu"})
			.bind('Click',function () {Crafty.scene("MainMenu")})
			.areaMap([0,0],[150,0],[150,50],[0,50])
            .css({'color':"white","text-align":"center"});
    });

	
	/**
	 * These definitely need to get moved to just one function.
	 * I will do this soon. Hopefully.
	 **/
	Crafty.scene("Drill1", function() {
		drillTargets = drill1Targets;
		generateDrillWorld();
		resetCounters();
		
		theHittext = Crafty.e("2D, DOM, Text").attr({ w: 150, h: 50, 
													  x: 10, y: 10 })
			.text(function () { return "Targets Hit: "+targetsHit})
			.css({"color":"white;"});;
		theAcctext = Crafty.e("2D, DOM, Text").attr({ w: 150, h: 80, 
													  x: 10, y: 50 })
			.text(function () { return "Targets Hit: "+targetsHit})
			.css({"color":"white;"});
		
		timerText = Crafty.e("2D,DOM,Text")
			.attr({ w: 150, h: 50, x: 300, y: 10 , z:900 })
            .text(function () { return "Time Elapsed: "})
            .css({'color':"white","text-align":"center"});

		Crafty.e("2D, DOM, Text, Mouse")
			.attr({w: 150, h: 50, 
				   x:((width*spriteDim)-(width*5)), 
				   y:((height*spriteDim)-(height)), 
				   z:900 })
            .text(function () { return "Main Menu"})
			.bind('Click',function () {Crafty.scene("MainMenu")})
			.areaMap([0,0],[150,0],[150,50],[0,50])
            .css({'color':"white","text-align":"center"});
		
		newTimer();
		targetArray[width/2][height/2].destroy();
		targetArray[width/2][height/2] = Crafty.e("2D, DOM, solid, CurrentTarget, Mouse, live_target")
			.attr({ x: (width/2) * spriteDim, 
					y: (height/2) * spriteDim, z: 200 })
			.areaMap([0,0], [spriteDim,0], 
					 [spriteDim,spriteDim], [0,spriteDim]);
        updateText();
		recording=true;
        document.body.onmousedown = function() {
            if (recording) {
				timesShot++;
				if (sound) {
					Crafty.audio.play("skorpion");
				}
				updateText();
			}
        };
	});

	Crafty.scene("Drill2", function() {
		drillTargets = drill2Targets;
		generateDrillWorld();
		resetCounters();
				
		theHittext = Crafty.e("2D, DOM, Text").attr({ w: 150, h: 50, 
													  x: 10, y: 10 })
			.text(function () { return "Targets Hit: "+targetsHit})
			.css({"color":"white;"});;
		theAcctext = Crafty.e("2D, DOM, Text").attr({ w: 150, h: 80, 
													  x: 10, y: 50 })
			.text(function () { return "Targets Hit: "+targetsHit})
			.css({"color":"white;"});

		timerText = Crafty.e("2D,DOM,Text")
			.attr({ w: 150, h: 50, x: 300, y: 10 , z:900 })
            .text(function () { return "Time Elapsed: "})
            .css({'color':"white","text-align":"center"});

		Crafty.e("2D, DOM, Text, Mouse")
			.attr({w: 150, h: 50, 
				   x:((width*spriteDim)-(width*5)), 
				   y:((height*spriteDim)-(height)), 
				   z:900 })
            .text(function () { return "Main Menu"})
			.bind('Click',function () {Crafty.scene("MainMenu")})
			.areaMap([0,0],[150,0],[150,50],[0,50])
            .css({'color':"white","text-align":"center"});

		newTimer();
		targetArray[width/2][height/2].destroy();
		targetArray[width/2][height/2] = Crafty.e("2D, DOM, solid, CurrentTarget, Mouse, live_target")
			.attr({ x: (width/2) * spriteDim, 
					y: (height/2) * spriteDim, z: 200 })
			.areaMap([0,0], [spriteDim,0], 
					 [spriteDim,spriteDim], [0,spriteDim]);
        updateText();
		recording=true;
        document.body.onmousedown = function() {
            if (recording) {
				timesShot++;
				if (sound) {
					Crafty.audio.play("skorpion");
				}
				updateText();
			}
        };
	});

	
	Crafty.scene("Drill3", function() {
		drillTargets = drill3Targets;
		generateDrillWorld();
		resetCounters();
				
		theHittext = Crafty.e("2D, DOM, Text").attr({ w: 150, h: 50, 
													  x: 10, y: 10 })
			.text(function () { return "Targets Hit: "+targetsHit})
			.css({"color":"white;"});;
		theAcctext = Crafty.e("2D, DOM, Text").attr({ w: 150, h: 80, 
x: 10, y: 50 })
			.text(function () { return "Targets Hit: "+targetsHit})
			.css({"color":"white;"});

		timerText = Crafty.e("2D,DOM,Text")
			.attr({ w: 150, h: 50, x: 300, y: 10 , z:900 })
            .text(function () { return "Time Elapsed: "})
            .css({'color':"white","text-align":"center"});

		Crafty.e("2D, DOM, Text, Mouse")
			.attr({w: 150, h: 50, 
				   x:((width*spriteDim)-(width*5)), 
				   y:((height*spriteDim)-(height)), 
				   z:900 })
            .text(function () { return "Main Menu"})
			.bind('Click',function () {Crafty.scene("MainMenu")})
			.areaMap([0,0],[150,0],[150,50],[0,50])
            .css({'color':"white","text-align":"center"});
		
		newTimer();
		targetArray[width/2][height/2].destroy();
		targetArray[width/2][height/2] = Crafty.e("2D, DOM, solid, CurrentTarget, Mouse, live_target")
			.attr({ x: (width/2) * spriteDim, 
					y: (height/2) * spriteDim, z: 200 })
			.areaMap([0,0], [spriteDim,0], 
					 [spriteDim,spriteDim], [0,spriteDim]);
        updateText();
		recording=true;
        document.body.onmousedown = function() {
            if (recording) {
				timesShot++;
				if (sound) {
					Crafty.audio.play("skorpion");
				}
				updateText();
			}
        };
	});


    function updateText() {
        theHittext.destroy();
        theAcctext.destroy();
        accuracy = ((targetsHit/timesShot)*100).toFixed(2);
        if (timesShot===0.0) {
            accuracy = 100.0;
        }
        theHittext = Crafty.e("2D, DOM, Text").attr({ w: 150, h: 50, 
													  x: 120, y: 10 , z:200 })
            .text(function () { return "Targets Hit: "+targetsHit})
            .css({"color":"white;"});
        theAcctext = Crafty.e("2D, DOM, Text").attr({ w: 150, h: 80, 
													  x: 120, y: 50, z:200})
            .text(function () { return "Accuracy: "+accuracy})
            .css({"color":"white;"});
    }



	///Timer functions
	function newTimer() {
		time=0;
		timer = window.setTimeout(incrementTimer,1);
	}

	function endDrill() {
		window.clearTimeout(timer);
		recording=false;
	}

	function incrementTimer() {
		time+=1;
		timer = window.setTimeout(incrementTimer,10);
		updateTime();
	}

	function updateTime() {
		if (timerText2!=null) {
			timerText2.destroy();
		}
		timerText2 = Crafty.e("2D,DOM,Text")
			.attr({ w: 150, h: 50, x: 300, y: 50 , z:900 })
            .text(function () { return ""+time})
            .css({'color':"white","text-align":"center"});
	}

	function generateSoundText() {
		if (soundText!=null) {
			soundText.destroy();
		}
		if (sound) {
			soundText = Crafty.e("2D, DOM, Text").attr({ w: 150, h: 50, 
														 x: 50, y: 600 , 
														 z:900 })
				.text(function () { return "On"})
				.css({'color':"white","text-align":"center"})
		} else {
			soundText = Crafty.e("2D, DOM, Text").attr({ w: 150, h: 50, 
														 x: 50, y: 600, 
														 z:900 })
				.text(function () { return "Off"})
				.css({'color':"white","text-align":"center"})
		}
	}

	//Drill functions
	function resetCounters() {
		currentAim=0;
		aimingCenter=true;
		targetsHit=0.0;
		timesShot=0.0;
	}
};
