console.log('Loadeding selectedArea.js');

$('body').addClass('area-capture');
var wh = $(window).height();
var captureArea = '<div class="capture-area"></div>';
var rectStart = {};
var rectEnd = {};
var editRect = {rectEnd};
var startScroll = 0;
var endScroll = 0;
$('body').mousedown(function(e){
  if($(this).hasClass('area-capture')){
  startScroll = $(document).scrollTop();
  $('body').append(captureArea);
  rectStart.x = e.pageX;
  rectStart.y = e.pageY - startScroll;
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
}
});

$('body').mouseup(function(e){
  if($(this).hasClass('area-capture')){
  endScroll = $(document).scrollTop();
  rectEnd.x = e.pageX;
  rectEnd.y = e.pageY - endScroll;
  editRect = {rectStart, rectEnd}
  if($('.capture-area').height() > wh){
    chrome.runtime.sendMessage({type: "captureSelectedArea", scroll: "true", start: rectStart, end: rectEnd, startScroll:startScroll, endScroll:endScroll }, function(response) { });
  }
  else {
    chrome.runtime.sendMessage({type: "captureSelectedArea", scroll: "false", start: rectStart, end: rectEnd, startScroll:startScroll, endScroll:endScroll}, function(response) { });
    }
    $('.capture-area').remove();
    $('body').removeClass('area-capture');
    console.log('Up!');
  }
});
