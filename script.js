$(document).ready(function(){
  $('#capture_visible').click(function(){
    capture_visible();
  });

  $('#delayed-capture').click(function(){
    delayed_capture();
  });

  $('#capture-selected-area').click(function(){
    capture_selected_area();
  });

  $('#capture-entire-page').click(function(){
    capture_entire_page();
  });

  function capture_visible(){
    var storage = chrome.storage.local;

    chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, {}, function(dataturl){
      var ateroCapture = {};
      ateroCapture.imageToEdit = dataturl;
      console.log(dataturl);

      storage.set(ateroCapture, function(){
        chrome.tabs.create({url: 'edit.html'}, function(){ });
      });

      //open edit page

    });
  }

  function delayed_capture(){
    $('.dropdown-container').css({'width':'50px', 'height': '50px'});
    $('#counter').show();
    chrome.runtime.sendMessage({type: "delayedCapture"}, function(response) { });
  }

  function capture_selected_area(){
    //chrome.runtime.sendMessage({type: "captureSelectedArea"}, function(response) { });
    chrome.tabs.executeScript(null, {file: "jquery.min.js"});
    chrome.tabs.executeScript(null, {file: "selectedArea.js"});
    window.close();
  }

  function capture_entair_page(){
    //chrome.runtime.sendMessage({type: "captureSelectedArea"}, function(response) { });
    var storage = chrome.storage.local;

    chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, {}, function(dataturl){
      var ateroCapture = {};
      ateroCapture.imageToEdit = dataturl;
      console.log(dataturl);

      storage.set(ateroCapture, function(){
        chrome.tabs.create({url: 'edit.html'}, function(){ });
      });

    });

  }
});
