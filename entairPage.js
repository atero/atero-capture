console.log('Loadeding entairPage.js');
var winH = $(window).height();
var pageH = $(document).height();
var shotCount = Math.floor(pageH / winH)+1;
var imageArray = [];
console.log('Scroll : ' + $(document).scrollTop());

if($(document).scrollTop()!=0){
  $('body').animate({scrollTop: 0}, 100,function(){
    console.log('Scroll : ' + $(document).scrollTop());
    //shoot
    startShooting(shotCount);
  });
}

function startShooting(n){
  chrome.runtime.sendMessage({type: "shoot", shoots: n}, function(response) {

  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.type == 'shooted'){
      if(request.shoots > 0){
          shotCount--;
          imageArray.push(request.image);
          $('body').animate({scrollTop: $(document).scrollTop()+winH}, 300,function(){
            console.log($(document).scrollTop());
            startShooting(shotCount)
          });
      }else{
        console.log(imageArray);
        chrome.runtime.sendMessage({type: "saveArray", array: imageArray, pageH:pageH}, function(response) {});
      }
        console.log("Shoot again!!!");
    }
  }
);
