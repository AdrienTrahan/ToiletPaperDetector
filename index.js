let model, webcam, maxPredictions;
let path = "model/"
const modelURL = path + "model.json";
const metadataURL = path + "metadata.json";

let count = 0;
let deleteCount = 0;
let isShown = false;
Webcam.set({
 width: 150,
 height: 120,
 image_format: 'png',
 jpeg_quality: 90
});
Webcam.attach('#preview');

function refused(){
  console.log("bad boyyy!");
}

async function accepted(){
  console.log("good boyyy!");

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
  const flip = true;
  webcam = new tmImage.Webcam(200, 200, flip);
  await webcam.setup();
  await webcam.play();
  setInterval(async function (){
    await loop();
  }, 50);
}
async function loop() {
  webcam.update();
  await predict();
}

async function predict() {
  // predict can take in an image, video or canvas html element
  const prediction = await model.predict(webcam.canvas);
  if (prediction[0].probability > 0.95){
    count ++;
    deleteCount = 0;
  }else if (prediction[0].probability < 0.65 && count != 0){
    deleteCount++;
    if (deleteCount >= 5){
      deleteCount = 0;
      count = 0;
      if (isShown){
        hideToiletPaperAlert();
      }
    }
  }
  if (count >= 5 && !isShown){
    showToiletPaperAlert();
  }
}

function showToiletPaperAlert(){
  isShown = true;
  $(document.body).append("<div class='flexingAlert'>You can flex bro! 🧻🧻</div>")
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

   $(".flexingAlert")[0].style.fontSize = "54px";
  }
  $( ".flexingAlert" ).animate({
    bottom: "+=120"
  }, 500, function() {
  });
}
function hideToiletPaperAlert(){
  isShown = false;
  $( ".flexingAlert" ).animate({
    bottom: "-=120"
  }, 500, function() {
    $( ".flexingAlert" ).remove();
  });
}

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 $(document.body).append("<div class='errorAlert'>Hey!<br>Je vois que tu es sur un 📱! <br> Le layout est vraiment 🤮🤮alors va sur ton ordi! 💻<br><br> Avec Insta ou Facebook, la webcam est 🚫, alors va dans ton navigateur par défaut.<button onclick='$( \".errorAlert\" ).remove();'>je suis un thug, je veux continuer</button></div>");
 $(".title")[0].style.fontSize = "54px";
}
