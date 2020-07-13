window.circles =[]
window.mycircle;
Howler.volume(0.2);


$("#movieMode").on("click", function(){
    $("canvas").addClass("movie");
    $(".fireflies").fadeIn();

    $("#pianoKeys").fadeOut();
    defineSounds(movieKeys);
});

$("#pianoMode").on("click", function(){
    $("#pianoKeys").fadeIn();

    $("canvas").removeClass("movie");
    $(".fireflies").fadeOut();
    defineSounds(pianoKeys);
});

$("#defaultMode").on("click", function(){
    $("#pianoKeys").fadeOut();    
    $("canvas").removeClass("movie");
    $(".fireflies").fadeOut();
    defineSounds(defaultKeys);
});

var easter_egg = new Konami(matrix);


//$("body").mouseover(function(){$(".menu").fadeIn();}).mouseout(function(){$(".menu").fadeIn();});
//$("body").mouseover(function(){$(".menu").fadeIn();});

$("body").on("mouseover",function(){$(".menu").fadeIn();});
$("body").on("click",function(){$(".menu").fadeIn();});

function showMenu(){
    
}

function onKeyDown(event) {
    // When a key is pressed, set the content of the text item:
    $("#tutorial").fadeOut();
    $(".menu").fadeOut();
    if (userKeys[event.key]){
        var maxPoint = new Point(view.size.width, view.size.height);
        var randomPoint = Point.random();
        var point = maxPoint*randomPoint;
        mycircle = new Path.Circle(point, 100);
        //mycircle.fillColor= "orange";
        mycircle.fillColor = userKeys[event.key].color;
        userKeys[event.key].sound.play();
        circles.push(mycircle);
    }  
}

function onFrame(event){
    for(var i = 0; i < circles.length; i++){
      circles[i].scale(0.9);
      circles[i].fillColor.hue += 1;
      if(circles[i].area < 1){
        circles[i].remove(); // remove the circle from the canvas
        circles.splice(i, 1); // remove the circle from the array
        //console.log(circles);
      }
    }
  }

//Defining Sounds
//https://github.com/ledlamp/piano-sounds/tree/master/PianoSounds
window.defaultKeys = ["bubbles", "clay", "confetti","corona","dotted-spiral","flash-1", "flash-2", "flash-3", "glimmer", "moon", "pinwheel", "piston-1", "piston-2", "piston-3", "prism-1", "prism-2", "prism-3", "splits", "squiggle", "strike", "suspension", "timer", "ufo", "veil", "wipe", "zig-zag"];
window.pianoKeys = ["a-1","a0", "a1", "a2", "a3", "a4", "a5", "a6", "as-1", "as0", "as1", "as2", "as3", "as4", "as5", "as6", "b-1", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "cs0", "cs1", "cs2", "cs3", "cs4", "cs5", "cs6", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "ds0", "ds1", "ds2", "ds3", "ds4", "ds5", "ds6", "e0", "e1", "e2", "e3", "e4", "e5", "e6", "f0", "f1", "f2", "f3", "f4", "f5", "f6", "fs0", "fs1", "fs2", "fs3", "fs4", "fs5", "fs6", "g0", "g1", "g2", "g3", "g4", "g5", "g6", "gs0", "gs1", "gs2", "gs3", "gs4", "gs5", "gs6" ];
window.movieKeys = ["01-berberian-sound-studio-melon-smashing","03-star-wars-blaster-pistol", "04-star-wars-lightsaber", "05-star-wars-chewbacca", "06-star-wars-tie-fighter","08-star-wars-speeder-bike", "10-terminator-2-crushed-skull", "12-terminator-2-bullets-hitting-the-t1000", "18-lord-of-the-rings-uruk-hai", "21-jurassic-park-t-rex", "28-transformers-optimus-prime-flying", "32-the-exorcist-head-turning", "35-x-men-claws","38-predator-predator-movement","50_sniper_shot-Liam-2028603980", "Alien_Machine_Gun-Matt_Cutillo-2023875589", "apprehensive-Mike_Koenig-1694170958", "Bow_Fire_Arrow-Stephan_Schutze-2133929391", "dragon_ball_z_scream_9-RA_The_Sun_God-952538986", "Evil_Laugh_1-Timothy-64737261", "Hl2_Rebel-Ragdoll485-573931361", "Incoming_Suspense-Maximilien_-1060577487", "No_mercy-Hipis-1227409429", "Panic-Mike_Koenig-717059030", "Pill_Bottle-Mike_Koenig-2124041677", "Scary-Titus_Calen-1449371204", "shotgun-mossberg590-RA_The_Sun_God-451502290", "Sqeaking_door-Sarasprella-1653672487"];

window.keyboardKeys=["q","w","e","r","t","y","u","i","o","p", "a","s","d","f","g","h","j","k","l","ç", ,"z","x","c","v","b","n","m"];
window.defaultColors=['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#f39c12', '#d35400', '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50','#2c3e50','#2c3e50']

var userKeys = {};
var currKey;
var currKeyboardKey;
var localPath;

function defineSounds(soundArray){
    switch (soundArray[0]) {
        case "a-1":
            localPath = "sounds/piano/"    
            break;
        case "bubbles":
            localPath = "sounds/default/"    
            break;
        case "01-berberian-sound-studio-melon-smashing":
            localPath = "sounds/movie/"    
            break;
        default:
            break;
    }

    for (var i = 0; i < keyboardKeys.length; i++) {
        currKeyboardKey = keyboardKeys[i]; //This will be user keyboard key, like "k"
        //console.log('sounds/piano/'+ currKey +'.mp3')
        userKeys[currKeyboardKey]={};
        userKeys[currKeyboardKey].sound=new Howl({src: [localPath + soundArray[i]  +'.mp3']});
        userKeys[currKeyboardKey].color=defaultColors[i];
    }
}
defineSounds(defaultKeys);

//userKeys["b4"].sound.play();


function matrix(){
    alert("You start seeing the matrix");
    alert("Oh, damn!");
    setInterval(draw, 35);
}

//Matrix Effect
// geting canvas by id c
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

//making the canvas full screen
c.height = window.innerHeight;
c.width = window.innerWidth;

//chinese characters - taken from the unicode charset
var matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
//converting the string into an array of single characters
matrix = matrix.split("");

var font_size = 10;
var columns = c.width/font_size; //number of columns for the rain
//an array of drops - one per column
var drops = [];
//x below is the x coordinate
//1 = y co-ordinate of the drop(same for every drop initially)
for(var x = 0; x < columns; x++)
    drops[x] = 1; 

//drawing the characters
function draw()
{
    //Black BG for the canvas
    //translucent BG to show trail
    ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.fillStyle = "#0F0"; //green text
    ctx.font = font_size + "px arial";
    //looping over drops
    for(var i = 0; i < drops.length; i++)
    {
        //a random chinese character to print
        var text = matrix[Math.floor(Math.random()*matrix.length)];
        //x = i*font_size, y = value of drops[i]*font_size
        ctx.fillText(text, i*font_size, drops[i]*font_size);

        //sending the drop back to the top randomly after it has crossed the screen
        //adding a randomness to the reset to make the drops scattered on the Y axis
        if(drops[i]*font_size > c.height && Math.random() > 0.975)
            drops[i] = 0;

        //incrementing Y coordinate
        drops[i]++;
    }
}
//setInterval(draw, 35);
///Matrix effect end


/*
var playlist = function(e) {
    // initialisation:
      pCount = 0;
      playlistUrls = [
        "sounds/piano/g3.mp3",
        "sounds/piano/e3.mp3",
        "sounds/piano/f3.mp3",
        "sounds/piano/g3.mp3",
        "sounds/piano/g3.mp3",
        "sounds/piano/g3.mp3",
        "sounds/piano/a3.mp3",
        "sounds/piano/b3.mp3",
        "sounds/piano/c3.mp3",
        "sounds/piano/c3.mp3",
        ], // audio list
      howlerBank = [],
      loop = true;

    // playing i+1 audio (= chaining audio files)
    var onEnd = function(e) {
      if (loop === true ) { pCount = (pCount + 1 !== howlerBank.length)? pCount + 1 : 0; }
      else { pCount = pCount + 1; }
      howlerBank[pCount].play('aa');
    };

    // build up howlerBank:     
    playlistUrls.forEach(function(current, i) {   
      howlerBank.push(new Howl({ src: [playlistUrls[i]],sprite: {aa:[0,900]}, onend: onEnd, buffer: true }))
    });

    // initiate the whole :
        howlerBank[0].play('aa');
}

//playlist();
*/