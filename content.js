chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse){
    if (request.type == 'captureSelectedArea') {
      $('body').css({'cursor': 'pointer'});
      console.log('Changining cursor!');
    }

  }
);
