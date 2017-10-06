/*
  Purpose: Pass information to other helper functions after a user clicks 'Predict'
  Args:
    value - Actual filename or URL
    source - 'url' or 'file'
*/



function predict_click(value, source) {
    // first grab current index
    var index = document.getElementById("hidden-counter").value;

    // Div Stuff
    if (index > 1) {
        createNewDisplayDiv(index);
    }

    if (source === "url") {
        document.getElementById("img_preview" + index).src = value;
        doPredict({ url: value });

        // Div Stuff

    } else if (source === "file") {
        var preview = document.querySelector("#img_preview" + index);
        var file = document.querySelector("input[type=file]").files[0];
        var reader = new FileReader();

        // load local file picture
        reader.addEventListener("load", function() {
            preview.src = reader.result;
            var localBase64 = reader.result.split("base64,")[1];
            doPredict({ base64: localBase64 });

            // Div Stuff
            createHiddenDivs("base64", localBase64);

        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    }
}

/*
  Purpose: Does a v2 prediction based on user input
  Args:
    value - Either {url : urlValue} or { base64 : base64Value }
*/
var ingredient1 = "";
var ingredient2 = "";
var ingredient3 = "";
var counter = 0;
var arrOfFoods = [];
var ingredient4 = "";
var ingredient5 = "";

function doPredict(value) {

    var modelID = getSelectedModel();

    app.models.predict(modelID, value).then(

        function(response) {
            console.log(response);
            // Important!
            // ***********
            var allItems = response.rawData.outputs[0].data.concepts;
            for (var i = 0; i < allItems.length; i++) {
                counter += 1;

                arrOfFoods.push(response.rawData.outputs[0].data.concepts[i].name);


                if (response.rawData.outputs[0].data.concepts[i].value < .95) {

                } else {
                    console.log(response.rawData.outputs[0].data.concepts[i].value);
                }
                // counter += 1;

            }

            // ***********
            var conceptNames = "";
            var tagArray, regionArray;
            var tagCount = 0;
            var modelName = response.rawData.outputs[0].model.name;
            var modelNameShort = modelName.split("-")[0];
            var modelHeader = '<b><span style="font-size:14px">' + capitalize(modelNameShort) + ' Model</span></b>';

            // Check for regions models first
            if (response.rawData.outputs[0].data.hasOwnProperty("regions")) {
                regionArray = response.rawData.outputs[0].data.regions;

                // Regions are found, so iterate through all of them
                for (var i = 0; i < regionArray.length; i++) {
                    conceptNames += "<b>Result " + (i + 1) + "</b>";
                    tagCount += 10;
                }
            }

            // Generic tag response models
            if (response.rawData.outputs[0].data.hasOwnProperty("concepts")) {
                tagArray = response.rawData.outputs[0].data.concepts;

                for (var other = 0; other < tagArray.length; other++) {
                    conceptNames += '<li>' + tagArray[other].name + ': <i>' + tagArray[other].value + '</i></li>';
                }

                tagCount = tagArray.length;
            }

            var columnCount = tagCount / 10;

            // Focus gets one more column
            if (modelName == "focus") {
                columnCount += 1;
            }

            conceptNames = '<ul style="margin-right:20px; margin-top:20px; columns:' + columnCount + '; -webkit-columns:' + columnCount + '; -moz-columns:' + columnCount + ';">' + conceptNames;

            conceptNames += '</ul>';
            conceptNames = modelHeader + conceptNames;

            $('#concepts').html(conceptNames);

            document.getElementById("add-image-button").style.visibility = "visible";
            console.log(arrOfFoods)
        },
        function(err) {
            console.log(err);
        }
    );
}

var nextCount = 0;



$(document).ready(function() {
    // console.log(arrOfFoods);
    $("#first-imgs").on("click", function() {
        console.log("button clicked");
        var food1 = arrOfFoods[0];
        var food2 = arrOfFoods[1];
        var food3 = arrOfFoods[2];
        var food4 = arrOfFoods[3];
        var food5 = arrOfFoods[4];

        var key = "98f2777f95ab7c5bf03eb8ee11ff1c00";

        var queryURL =
            "https://cors-anywhere.herokuapp.com/http://food2fork.com/api/search?key=" +
            key +
            "&q=" +
            food1 + "," +
            food2 + "," +
            food3 + "," +
            food4 + "," +
            food5;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(response) {
            var jason = JSON.parse(response);
            console.log(jason);
            for (var i = 0; i < 5; i++) {
                // console.log(jason);
                console.log(jason.recipes[i]);
                var recipeName = jason.recipes[i].title;
                console.log(recipeName);
                var publisher = jason.recipes[i].publisher;
                console.log("From " + publisher);
                var recipeLink = jason.recipes[i].source_url;
                console.log("Link to their website " + recipeLink);
                var recipeImg = $("<img>");
                var recipeImgURL = jason.recipes[i].image_url;
                recipeImg.attr("src", recipeImgURL);
                recipeImg.css("width", "200px");
                recipeImg.css("height", "200px");
                $("#foods").append(recipeImg);
            }
        });
    });
    $("#next-imgs").on("click", function() {
        var food1 = arrOfFoods[0];
        var food2 = arrOfFoods[1];
        var food3 = arrOfFoods[2];
        var food4 = arrOfFoods[3];
        var food5 = arrOfFoods[4];

        var key = "98f2777f95ab7c5bf03eb8ee11ff1c00";

        var queryURL =
            "https://cors-anywhere.herokuapp.com/http://food2fork.com/api/search?key=" +
            key +
            "&q=" +
            food1 + "," +
            food2 + "," +
            food3 + "," +
            food4 + "," +
            food5;
        // event.preventDefault();
        nextCount += 5;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(response) {
            var jason = JSON.parse(response);
            //   if user is unsatisfied with these search results : will click next button
            //   next counter adds 5 after each new page of results
            for (var j = nextCount; j < nextCount + 5; j++) {
                console.log(jason.recipes[j]);
                var recipeName = jason.recipes[j].title;
                console.log(recipeName);
                var publisher = jason.recipes[j].publisher;
                console.log("From " + publisher);
                var recipeLink = jason.recipes[j].source_url;
                console.log("Link to their website " + recipeLink);
                var recipeImg = $("<img>");
                var recipeImgURL = jason.recipes[j].image_url;
                recipeImg.attr("src", recipeImgURL);
                recipeImg.css("width", "200px");
                recipeImg.css("height", "200px");
                $("#foods").append(recipeImg);
            }
            console.log(nextCount);
        });
    });


});

/*
  Purpose: Return a back-end model id based on current user selection
  Returns:
    Back-end model id
*/
function getSelectedModel() {
    return Clarifai.FOOD_MODEL;
}
/*
  Purpose: Return a capitalized String
  Args:
    s - A String
*/
function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
}