
var allData = [];

// Variable for the visualization instance
var ivyLeagueMap;

loadData();

function loadData() {

  // TO-DO: LOAD DATA
    d3.json("data/ivyleague.json", function(error,jsonData){
        // if (error) throw error;
        // Work with data
        allData = jsonData;
        createVis();
    });
}


function createVis() {
  // TO-DO: INSTANTIATE VISUALIZATION
    // appropriate center
    var map_center = [42.310346, -73.058880];
    ivyLeagueMap = new IvyLeagueMap("ivy-league-map",allData,map_center);
}


$("input[name='rating']").click(function(){
    $('input[type="radio"]:checked').each(function() {
        guess = this.value*10
    });

    var el = document.getElementById("answer");
    if (guess <= 30){
        previous = "<br><p class=\"answerLine\">Your guess is " + guess + "%. Very close! The correct answer is 31.7%.</p><br><br>"}
    else {

        previous = "<br><p class=\"answerLine\">Your guess is " + guess + "%. Well, actually the correct answer is 31.7%.</p><br><br>"
    }

    answer = "                <i class=\"fa fa-female female fa-5x\" aria-hidden=\"true\"></i>\n" +
        "                <i class=\"fa fa-female female fa-5x\" aria-hidden=\"true\"></i>\n" +
        "                <i class=\"fa fa-female female fa-5x\" aria-hidden=\"true\"></i>\n" +
        "                <i class=\"fa fa-male male fa-5x\" aria-hidden=\"true\"></i>\n" +
        "                <i class=\"fa fa-male male fa-5x\" aria-hidden=\"true\"></i>\n" +
        "                <i class=\"fa fa-male male fa-5x\" aria-hidden=\"true\"></i>\n" +
        "                <i class=\"fa fa-male male fa-5x\" aria-hidden=\"true\"></i>\n" +
        "                <i class=\"fa fa-male male fa-5x\" aria-hidden=\"true\"></i>\n" +
        "                <i class=\"fa fa-male male fa-5x\" aria-hidden=\"true\"></i>\n" +
        "                <i class=\"fa fa-male male fa-5x\" aria-hidden=\"true\"></i>\n"
        +"<h1>There is a clear gender imbalance among Harvard faculty.</h1>";

    el.innerHTML=previous+answer;

});

function generateE(){
    d3.csv("data/quotesdata.csv", function(data) {

        r = Math.round(Math.random() * (35 - 0) + 0);
        var el = document.getElementById("E");

        var newcontent = document.createElement('p');
        newcontent.innerHTML ="<br>\""+ data[r]["0"]+"\"<br>"

        while (newcontent.firstChild) {
            el.appendChild(newcontent.firstChild);
        }
    });
}



function generateF(){
    d3.csv("data/quotesdata.csv", function(data) {

        r = Math.round(Math.random() * (30 - 0) + 0);
        var el = document.getElementById("F");

        var newcontent = document.createElement('p');
        newcontent.innerHTML ="<br>\""+ data[r]["1"]+"\"<br>"

        while (newcontent.firstChild) {
            el.appendChild(newcontent.firstChild);
        }
    });
}