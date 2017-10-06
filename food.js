try {
    var app = new Clarifai.App({
        apiKey: 'cfa5b0304b154829b2adfc99bd04234d'
    });
} catch (err) {
    alert("Need a valid API Key!");
    throw "Invalid API Key";
}

// Checks for valid image type
function validFile(imageName) {
    var lowerImageName = imageName.toLowerCase();
    return lowerImageName.search(/jpg|png|bmp|tiff/gi) != -1;
}

