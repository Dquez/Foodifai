try {
    var app = new Clarifai.App({
     apiKey: 'cfa5b0304b154829b2adfc99bd04234d'
    });
  }
  catch(err) {
    alert("Need a valid API Key!");
    throw "Invalid API Key";
  }
  
  // Checks for valid image type
  function validFile(imageName) {
    var lowerImageName = imageName.toLowerCase();
    return lowerImageName.search(/jpg|png|bmp|tiff/gi) != -1;
  }
  
  // Fills custom model dropdown
  window.onload = function() {
    var select = document.getElementById("custom_models_dropdown");
    
    var publicMods = ['general-v1.3', 'nsfw-v1.0', 'face-v1.3', 'color', 'food-items-v1.0', 'travel-v1.0', 'celeb-v1.3', 'weddings-v1.0', 'apparel', 'demographics', 'logo', 'focus', 'moderation'];
    
    app.models.list().then(
      function(response) {
        var ids = response.rawData;
        
        for(var i=0; i < ids.length; i++) {
          var opt = ids[i];
          if(publicMods.indexOf(opt.name) == -1) {
            var el = document.createElement("option");
            el.textContent = opt.name;
            el.value = opt.id;
            select.appendChild(el);
          }
        }
      },
      function(err) {
        alert(err);
      }
    );
  }

$("#predict-local").on("click", function(){
      if(filename.value == '') { 
        alert('Please browse for a file!'); 
        return;
      } 
    
      else if (!validFile(filename.value)) {
        alert('Supported File Types: JPEG, PNG, TIFF, BMP');
        return;
      }
      predict_click($('#filename').val(), 'file');
});

















