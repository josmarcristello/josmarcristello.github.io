function addPoints(){    
    var p1Score = Number(document.querySelector("#playerOneScore").innerText);
    var p2Score = Number(document.querySelector("#playerTwoScore").innerText);
    var maxScore = Number(document.querySelector("#maxScore").innerText);
    if ((p1Score>=maxScore) || (p2Score>=maxScore)){
        return;
    }
    if(this.id=="playerOneButton"){
        p1Score+=1;
        if (p1Score >= maxScore){
            p1Score = maxScore;
            document.querySelector("#playerOneScore").style.color="green";
        }
        document.querySelector("#playerOneScore").innerText=p1Score;
    }
    if(this.id=="playerTwoButton"){
        p2Score+=1;
        if (p2Score >= maxScore){
            p2Score = maxScore;
            document.querySelector("#playerTwoScore").style.color="green";
        }
        document.querySelector("#playerTwoScore").innerText=p2Score;
    }
    return;
}

function setMaxScore(){
    document.querySelector("#maxScore").innerText=document.querySelector("input").value;
}

function reset(){
    document.querySelector("#playerOneScore").innerText = 0;
    document.querySelector("#playerOneScore").style.color="black";

    document.querySelector("#playerTwoScore").innerText = 0;
    document.querySelector("#playerTwoScore").style.color="black";

    document.querySelector("input").value="";
    document.querySelector("#maxScore").innerText = 0;
}
