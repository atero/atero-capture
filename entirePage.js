console.log('Loaded...');

$('body').addClass('area-capture');
var captureArea = '<div class="capture-area"></div>';

$('body').mousedown(function(e){
  $(this).append(captureArea);
  $('body').mousemove(function(mev){

    if(mev.pageX < e.pageX){

    }
    $('.capture-area').offset({'left': e.pageX, 'top': e.pageY});

    $('.capture-area').width(mev.pageX-e.pageX);
    $('.capture-area').height(mev.pageY-e.pageY);
  });
});

$('body').mouseup(function(e){
  $('.capture-area').remove();
});


