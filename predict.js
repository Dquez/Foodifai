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
  if(index > 1) {
    createNewDisplayDiv(index);
  }
  
  if(source === "url") {
    document.getElementById("img_preview" + index).src = value;
    doPredict({ url: value });
    
    // Div Stuff
    createHiddenDivs("url", value);
  }
    
  else if(source === "file") {
    var preview = document.querySelector("#img_preview" + index);
    var file    = document.querySelector("input[type=file]").files[0];
    var reader  = new FileReader();

    // load local file picture
    reader.addEventListener("load", function () {
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
function doPredict(value) {

  var modelID = getSelectedModel();

  app.models.predict(modelID, value).then(
    
    function(response) {
      console.log(response);
      // Important!
      // ***********
      var allItems = response.rawData.outputs[0].data.concepts;
      for (var i = 0; i < allItems.length; i++){
        if (response.rawData.outputs[0].data.concepts[i].value < .95) {
          // return;
        }
        
        else {
          console.log(response.rawData.outputs[0].data.concepts[i].value);
        }
        
      }
      
      // ***********
      var conceptNames = "";
      var tagArray, regionArray;
      var tagCount = 0;
      var modelName = response.rawData.outputs[0].model.name;
      var modelNameShort = modelName.split("-")[0];
      var modelHeader = '<b><span style="font-size:14px">' + capitalize(modelNameShort) + ' Model</span></b>';
      
      // Check for regions models first
      if(response.rawData.outputs[0].data.hasOwnProperty("regions")) {
        regionArray = response.rawData.outputs[0].data.regions;
      	
        // Regions are found, so iterate through all of them
        for(var i = 0; i < regionArray.length; i++) {
      	  conceptNames += "<b>Result " + (i+1) + "</b>";
                  tagCount+=10;       
      }
     }  
 
      // Generic tag response models
      if(response.rawData.outputs[0].data.hasOwnProperty("concepts")) {
        tagArray = response.rawData.outputs[0].data.concepts;
        
        for (var other = 0; other < tagArray.length; other++) {
          conceptNames += '<li>' + tagArray[other].name + ': <i>' + tagArray[other].value + '</i></li>';
        }
        
        tagCount=tagArray.length;
      }
      
      var columnCount = tagCount / 10;
      
      // Focus gets one more column
      if(modelName == "focus") {
      	columnCount += 1;
      }
      
      conceptNames = '<ul style="margin-right:20px; margin-top:20px; columns:' + columnCount + '; -webkit-columns:' + columnCount + '; -moz-columns:' + columnCount + ';">' + conceptNames;
        
      conceptNames += '</ul>';
      conceptNames = modelHeader + conceptNames;
      
      $('#concepts').html(conceptNames);
      
      document.getElementById("add-image-button").style.visibility = "visible";
    },
    function(err) {
      console.log(err);
    }
  );
}

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
function capitalize(s)
{
  return s[0].toUpperCase() + s.slice(1);
}
