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
    capture_entair_page();
  });

  function capture_visible(){
    chrome.tabs.executeScript(null, {file: "jquery.min.js"});
    chrome.tabs.executeScript(null, {file: "visible.js"});
    window.close();
  }

  function delayed_capture(){
    $('.dropdown-container').css({'width':'50px', 'height': '50px'});
    $('#counter').show();
    chrome.tabs.executeScript(null, {file: "jquery.min.js"});
    chrome.tabs.executeScript(null, {file: "delayed.js"});
  }

  function capture_selected_area(){
    //chrome.runtime.sendMessage({type: "captureSelectedArea"}, function(response) { });
    chrome.tabs.executeScript(null, {file: "jquery.min.js"});
    chrome.tabs.executeScript(null, {file: "selectedArea.js"});
    window.close();
  }

  function capture_entair_page(){

    chrome.tabs.executeScript(null, {file: "jquery.min.js"});
    chrome.tabs.executeScript(null, {file: "entairPage.js"});
    window.close();

  }
});
