chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse){
    var storage = chrome.storage.local;
    //capture visible area is in script.js
  	if (request.type == 'delayedCapture') {
      setTimeout(function(){
        chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, {}, function(dataturl){
          var ateroCapture = {};
          ateroCapture.imageData = {}
          ateroCapture.imageData.imageToEdit = dataturl;
          ateroCapture.imageData.startEditPoint = {'x':0,'y':0};
          ateroCapture.imageData.endEditPoint = {'x':request.start-15,'y':request.end};
          storage.set(ateroCapture, function(){
            chrome.tabs.create({url: 'edit.html'}, function(){ });
          });
        });
      }, 2500);
  	}

    if (request.type == 'capture_visible') {
      chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, {}, function(dataturl){
        var ateroCapture = {};
        ateroCapture.imageData = {}
        ateroCapture.imageData.imageToEdit = dataturl;
        ateroCapture.imageData.startEditPoint = {'x':0,'y':0};
        ateroCapture.imageData.endEditPoint = {'x':request.start-15,'y':request.end};

        storage.set(ateroCapture, function(){
          chrome.tabs.create({url: 'edit.html'}, function(){ });
        });

        //open edit page

      });
    }

    if (request.type == 'captureSelectedArea') {
      if(request.scroll == "false"){
        chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, {}, function(dataturl){
          var ateroCapture = {};
          ateroCapture.imageData = {};
          ateroCapture.imageData.imageToEdit = dataturl;
          ateroCapture.imageData.startEditPoint = request.start;
          ateroCapture.imageData.endEditPoint = request.end;
          console.log('startEditPoint : ' + ateroCapture.imageData.startEditPoint + ' - ' + 'endEditPoint : ' + ateroCapture.imageData.endEditPoint);

          storage.set(ateroCapture, function(){
            chrome.tabs.create({url: 'edit.html'}, function(){ });
          });
        });
        $('body').css({'cursor': 'pointer'});
        console.log('Start marking!');
      }

    }
    if (request.type == 'shoot') {
      console.log("Shooting!!!");
      chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, {}, function(dataurl){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          var activeTab = tabs[0];
          chrome.tabs.sendMessage(activeTab.id, {type: 'shooted', shoots: request.shoots, image: dataurl});
        });
      });
    }

    if (request.type == 'saveArray') {
      var ateroCapture = {};
      ateroCapture.imageData = {};
      ateroCapture.imageData.imageArray = request.array;
      ateroCapture.imageData.pageH = request.pageH;
      storage.set(ateroCapture, function(){
        chrome.tabs.create({url: 'edit.html'}, function(){ });
      });
    }
  }
);
