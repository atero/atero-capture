chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse){
    var storage = chrome.storage.local;

  	if (request.type == 'delayedCapture') {
      setTimeout(function(){
        chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, {}, function(dataturl){
          var ateroCapture = {};
          ateroCapture.imageToEdit = dataturl;
          storage.set(ateroCapture, function(){
            chrome.tabs.create({url: 'edit.html'}, function(){ });
          });
        });
      }, 3000);
  	}

    if (request.type == 'captureSelectedArea') {
    /*  chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, {}, function(dataturl){
        var ateroCapture = {};
        ateroCapture.imageToEdit = dataturl;
        storage.set(ateroCapture, function(){
          chrome.tabs.create({url: 'edit.html'}, function(){ });
        });
      });*/
      $('body').css({'cursor': 'pointer'});
      console.log('Start marking!');
    }

  }
);