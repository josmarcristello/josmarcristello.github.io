Object.defineProperties(Array.prototype, {
    count: {
        value: function(value) {
            return this.filter(x => x==value).length;
        }
    }
});

init();

function init(){
    setListeners();
    new_game();
}

function setListeners(){
    window.colorButtonArray = document.querySelector("#gamePanel").children;
    window.textPrompt = document.querySelector("#textPrompt");
    window.header = document.querySelector("#header");

    window.newGameButton = document.querySelector("#newGame");
    window.hardButton = document.querySelector("#hardButton");
    window.easyButton = document.querySelector("#easyButton");
    window.statisticsButton = document.querySelector("#statisticsButton");
    window.helpButton = document.querySelector("#helpButton");
    window.adviceButton = document.querySelector("#adviceButton");

    window.challengeColor;
    window.numTries=0;
    window.skillArray=[];
    window.skillArrayIndex=[];
    window.barChartData=[];
    
    newGameButton.addEventListener("click", new_game);
    hardButton.addEventListener("click", set_difficulty);
    easyButton.addEventListener("click", set_difficulty);
    statisticsButton.addEventListener("click", toggle_statistics);
    helpButton.addEventListener("click", toggle_help);
    adviceButton.addEventListener("click", toggle_advice);
}

function new_game() {  
    //Updates cursor style and generates random colorsfor the buttons
    for (let i = 0; i < colorButtonArray.length; i++) {
        colorButtonArray[i].classList.remove("cursor-default");
        colorButtonArray[i].classList.add("cursor-pointer");

        colorButtonArray[i].style.backgroundColor=random_rgb();
        colorButtonArray[i].addEventListener("click", select_button);
    }
    
    //Generating a random index from 0 to numButtons inclusive and assigning it to challengeColor.
    var randomIndex=Math.floor(Math.random()*colorButtonArray.length);
    window.challengeColor=colorButtonArray[randomIndex].style.backgroundColor;

    //Updating header to have the color the player is supposed to look for.
    document.querySelector("#header span").textContent=challengeColor;

    //Styles button difficulty and update text
    style_buttons();
    newGameButton.textContent="New Colors";
    textPrompt.textContent="";
}

function select_button(){
    //When player a colored square, this function checks he got it right.
    //Increment his number of tries independent of the result.
    numTries++;
    if (this.style.backgroundColor == challengeColor){
        //If he got it right...
        //Update Text
        textPrompt.textContent="Correct!";
        textPrompt.classList.add("text-gray-900");
        textPrompt.classList.remove("text-white");
        newGameButton.textContent="Play Again?";

        //Change colors 
        header.style.backgroundColor=challengeColor;
        for (let i = 0; i < colorButtonArray.length; i++) {
            colorButtonArray[i].style.backgroundColor=challengeColor;
            colorButtonArray[i].classList.add("cursor-default");
            colorButtonArray[i].classList.remove("cursor-pointer");
            colorButtonArray[i].removeEventListener("click", select_button);
        }


        if (skillArray.length == 0) {
            //Generate & Initialize chart
            skillArray=[numTries];
            skillArrayIndex=[1];    
            generateChart();

        } else if (skillArray.length > 0) {
            //Update chart
            addData(chart,skillArray.length+1,numTries);
            
            for (let i = 0; i < barChartData.length; i++) {
                removeData(barChart);
            }
            barChartData = [skillArray.count(1), skillArray.count(2) ,skillArray.count(3), skillArray.count(4), skillArray.count(5), skillArray.count(6)];
            for (let i = 0; i < barChartData.length; i++) {
                addData(barChart,[1,2,3,4,5,6][i],barChartData[i]);
            }
        }
        numTries=0;


    } else {
        //If he got it wrong...
        this.style.backgroundColor="";
        this.classList.add("bg-gray-900","cursor-default");
        this.classList.remove("cursor-pointer");

        textPrompt.textContent="Try again!";
        textPrompt.classList.add("text-gray-900");
        textPrompt.classList.remove("text-white");
    }
}

function set_difficulty() {
    if (this.id == "hardButton"){
    ///We need six buttons.
    if (colorButtonArray.length == 6) {return;}
    while (colorButtonArray.length < 6) {
        var cln = colorButtonArray[0].cloneNode(true);    
        document.querySelector("#gamePanel").appendChild(cln);
    }
    } else {
    //We need three buttons.
    if (colorButtonArray.length == 3) {return;}
    while (colorButtonArray.length > 3) {
        document.querySelector("#gamePanel").removeChild(colorButtonArray[0]);
    }
    }
    //finally, reset the game
    new_game();
}

function style_buttons(){
    if (colorButtonArray.length==6) {
        hardButton.classList.add("text-white", "bg-blue-700");
        easyButton.classList.remove("text-white", "bg-blue-700");
    } else {
        easyButton.classList.add("text-white", "bg-blue-700");
        hardButton.classList.remove("text-white", "bg-blue-700");
    }
}

function random_rgb() {
    var o = Math.round, r = Math.random, s = 240;
    return 'rgb(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ')';
}

function makeArr(startValue, stopValue, cardinality) {
    var arr = [];
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
      arr.push(startValue + (step * i));
    }
    return arr;
  }

function generateChart(){

    var ctx = document.getElementById('myChart').getContext('2d');
    Chart.defaults.global.defaultFontColor = '#edf2f7';
    window.chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: skillArrayIndex,
            datasets: [{
                label: '# Tries to win the game',
                borderColor: '#edf2f7',
                data: skillArray,
                fill: false,
                cubicInterpolationMode: 'monotone'
            },
            ]
        },

        // Configuration options go here
        options: {
            legend: { display: false },
            scales: {
                yAxes: [{
                    ticks: {
                        // the data minimum used for determining the ticks is Math.min(dataMin, suggestedMin)
                        suggestedMin: 1,
                        // the data maximum used for determining the ticks is Math.max(dataMax, suggestedMax)
                        suggestedMax: 6,
                        stepSize: 1,
                    },
                    gridLines: {
                        color: "white",
                        lineWidth: 0.25,
                        drawBorder: true,
                        drawOnChartArea: false,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "# Tries",
                        fontSize: 16,
                        padding: 2
                    }
                }],
                xAxes: [{
                gridLines: {
                        color: "white",
                        lineWidth: 0.25,
                        drawBorder: true,
                        drawOnChartArea: false,
                        drawTicks: true,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "# Games",
                        fontSize: 16,
                        padding: 2
                    }
                }]
            }
        }, 
    });

    window.barChart = new Chart(document.getElementById("bar-chart"), {
        type: 'bar',
        data: {
          labels: [1, 2, 3, 4, 5, 6],
          datasets: [
            {
              label: "# game",
              backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
              data: barChartData
            }
          ]
        },
        options: {
          legend: { display: false },
          title: {
            display: false,
            text: '# tries per game x # games',
            fontColor: "#edf2f7"
          },
          scales: {
            yAxes: [{
                display: false,
                ticks: {
                    // the data minimum used for determining the ticks is Math.min(dataMin, suggestedMin)
                    suggestedMin: 0,

                    // the data maximum used for determining the ticks is Math.max(dataMax, suggestedMax)
                    suggestedMax: 3,

                    stepSize: 1,
                }
            }],
            xAxes: [{
                gridLines: {
                        color: "white",
                        lineWidth: 0.25,
                        drawBorder: true,
                        drawOnChartArea: false,
                        drawTicks: true,
                    },
                scaleLabel: {
                        display: true,
                        labelString: "# Tries",
                        fontSize: 16,
                        padding: 2
                    }
                }]
        }
        }
    }); 
    
}

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}
function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

function toggle_statistics(){
    var x = document.querySelector("#statisticsPanel");
    if (skillArray.length <2){
        /*
        swal({text: "Play more games. How do you want to have statistics with " + skillArray.length + " games played, huh? Did you think about that?",
        dangerMode: true, button: "No, I did not."})
        .then(() => {
            swal({text: "Of COURSE you didn't, you only think about yourself.", button: "You're correct, website, I'm sorry."});
        });
        */
        Swal.fire({
            title: 'Are you insane?',
            text: "How do you want to have statistics with " + skillArray.length + " games played, huh? Did you think about that?",
            icon: 'error',
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonColor: '#d33',
            cancelButtonText: "No, I did not."
          }).then((result) => {
              Swal.fire({
                text: "Of COURSE you didn't, you only think about yourself.",
                showConfirmButton: true,
                confirmButtonText: "I'm sorry, you're right. I'm a terrible person."
              })
          })

          return;
    }
      x.classList.toggle("hidden");
      setTimeout(() => {
        x.scrollIntoView({behavior:'smooth'})
      }, 100);
}

function toggle_help(){
    Swal.fire({
        title: 'Additive Color Mixing',
        text: "This is so simple, I don't even know why a help button exists.",
        imageUrl: "img/ColorPickerGame/RGB_Explanation.png",
        confirmButtonText: "I'm sorry",
        footer: '<button onclick=toggle_help2()>Ok but I tried mixing paint and its different?</a>'
      })
}

function toggle_help2(){
    Swal.fire({
        title: 'Additive Color ≠ Subtractive Color',
        text: "It's not rocket science, just pay attention",
        imageUrl: "img/ColorPickerGame/RGB_Explanation2.webp",
        confirmButtonText: "I'm <strong>really</strong> sorry",
      })
}

function toggle_advice(){
    Swal.fire({
        title: 'There is a HELP button, why would you click on advice?',
        text: "I don't even know, go look at your statistics and improve or something. Color mixing is something kids are able to do.",
        confirmButtonText: "Oh yeah that makes sense, thanks.",
        cancelButtonText: "I already tried the help button.",
        showCancelButton: true,
    }).then((result) => {
        if (!result.value){
            Swal.fire({
            text: "Honestly no one was supposed to get to this point, just go to an easier difficulty. Or just give up, like you probably usually do with everything else in your life.",
            showConfirmButton: true,
            confirmButtonText: "..."
            })
        }
    })
}