console.log('Loaded...');

$('body').addClass('area-capture');
var wh = $(window).height();
var captureArea = '<div class="capture-area"></div>';
var rectStart = {};
var rectEnd = {};
var editRect = {rectEnd};

$(document).mousedown(function(e){
  $('body').append(captureArea);
  rectStart.x = e.pageX;
  rectStart.y = e.pageY;
  $('body').mousemove(function(mev){

    if(mev.pageX < e.pageX){
      $('.capture-area').offset({'left': mev.pageX, 'top': mev.pageY});
      $('.capture-area').width(Math.abs(mev.pageX-e.pageX));
      $('.capture-area').height(Math.abs(mev.pageY-e.pageY));
    }
    else{
      $('.capture-area').offset({'left': e.pageX, 'top': e.pageY});
      $('.capture-area').width(Math.abs(mev.pageX-e.pageX));
      $('.capture-area').height(Math.abs(mev.pageY-e.pageY));
    }
  });
});

$('body').mouseup(function(e){
  rectEnd.x = e.pageX;
  rectEnd.y = e.pageY;
  editRect = {rectStart, rectEnd}
  if($('.capture-area').height() > wh){

  }
  else {
    chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, {}, function(dataturl){
      var ateroCapture = {};
      ateroCapture.imageToEdit = dataturl;
      ateroCapture.editArea = editRect;
      console.log(dataturl);

      //open edit page

    });
  }
  $('.capture-area').remove();
});
