$(document).ready(function(){
  var activeTool = "";
  var imgToEdit = '';
  var canvas, context, canvaso, contexto;

  // The active tool instance.
  var tool;
  var tool_default = 'line';
  var img = new Image;
  var mainColor = '231, 76, 85';

  function makeTitle(a)
    {
     var text = "";
     var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

     for( var i=0; i < a; i++ )
         text += possible.charAt(Math.floor(Math.random() * possible.length));

     return text;
    }
  function _base64ToArrayBuffer(base64) {
    base64 = base64.split('data:image/jpeg;base64,').join('');
    var binary_string =  window.atob(base64),
        len = binary_string.length,
        bytes = new Uint8Array( len ),
        i;

    for (i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  $("#colorpicker").spectrum({
    color: "#e74c55",
    move: function (color) {
      mainColor = Math.floor(color._r) + ', ' + Math.floor(color._g) + ', ' + Math.floor(color._b);
      console.log('rgb(' + Math.floor(color._r) + ', ' + Math.floor(color._g) + ', ' + Math.floor(color._b) + ')');
    }
  });

  $('.tool_button').click(function(){
    $('.tool_button').removeClass('active_tool');
    $(this).addClass('active_tool');
    activeTool = $(this).attr('data-action');
  });

  $('.save-atero').click(function(){
    var image = _base64ToArrayBuffer(canvaso.toDataURL("image/jpeg"));
    console.log(image);
       var encodedString = btoa('atero:qwerty');
         $.ajax({
             url: 'http://capture-api.atero.solutions/wp-json/wp/v2/media',
             type: 'POST',
             data: image,
             cache: false,
             contentType: false,
             processData: false,
             headers: {
                'Content-Disposition': 'filename='+makeTitle(8)+'.jpeg',
                'Authorization': 'Basic '+encodedString,
                "Content-Type": "image/jpeg"
              },
             success: function(data){
               console.log(data);

             var mediaId = data['id'];
             var capture_title = makeTitle(16);

               $.ajax({
                 type: 'POST',
                 url: 'http://capture-api.atero.solutions/wp-json/wp/v2/capture/',
                 dataType: 'json',
                 headers:{
                   'Content-Type':'application/x-www-form-urlencoded;text/plain',
                   'Authorization': 'Basic '+encodedString,
                   'Accept': 'application/json;odata=verbose'
                 },
                 data:{
                    "title": capture_title,
                    "content_raw":"Content",
                    "status": "publish",
                    "featured_image":mediaId,
                  }

               })

               .success(function(d) {
                 console.log(d);
                 $('input#file').val('');
               })
             }
         });


  });

  chrome.storage.local.get('imageData', function(result){
    canvaso.height = $(window).height() / ($(window).width() / 1100);
    var ctx = canvaso.getContext('2d');
    var img = new Image;
    var imageData = result.imageData;
    var imgArr = imageData.imageArray;
    console.log(imgArr);
    if(imgArr){
      if(imgArr.length > 0){ //if multyimage
        canvaso.height = imageData.pageH*1100/$(window).width();
        canvaso.width = 1100;
        canvas.height = canvaso.height;
        canvas.width = 1100;
        var img = new Image;
        var j = 0;
        for(var i=0; i < imgArr.length; i++){


          //  ctx.drawImage(img,startX, startY, endX-startX, endY-startY, 0,0,endX-startX, endY-startY); // Or at whatever offset you like
          setTimeout(function(){
            j++;
            img.onload = function(){
              if(j == imgArr.length ){
                ctx.drawImage(img,0,(j-1)*$(window).height()*1100/$(window).width() - ($(window).height()*(j)*1100/$(window).width()-canvas.height-20), 1100, $(window).height()*1100/$(window).width());
              }else{
                ctx.drawImage(img,0,(j-1)*$(window).height()*1100/$(window).width(), 1100, $(window).height()*1100/$(window).width());
              }

              console.log(img);
            }
              img.src = imgArr[j-1];
              console.log(img.src);
          }, 500*(i+1));

          }
      }
      return;
    }

    var startX = imageData.startEditPoint.x || 0;
    var startY = imageData.startEditPoint.y || 0;
    var endX = imageData.endEditPoint.x || 0;
    var endY = imageData.endEditPoint.y || 0;


    if(startX == endX){
      img.onload = function(){
        ctx.drawImage(img,0,0, 1100, canvaso.height); // Or at whatever offset you like
      }
    }else{
      canvaso.height = endY-startY;
      canvaso.width = endX-startX;
      canvas.height = endY-startY;
      canvas.width = endX-startX;
      img.onload = function(){
        ctx.drawImage(img,startX, startY, endX-startX, endY-startY, 0,0,endX-startX, endY-startY); // Or at whatever offset you like
      }
    }
    img.src = imageData.imageToEdit;
    console.log(imageData.imageToEdit);
    console.log(imageData.startEditPoint);
  });


    function init () {
      // Find the canvas element.
      canvaso = document.getElementById('edit-area');
      if (!canvaso) {
        alert('Error: I cannot find the canvas element!');
        return;
      }

      if (!canvaso.getContext) {
        alert('Error: no canvas.getContext!');
        return;
      }

      // Get the 2D canvas context.
      contexto = canvaso.getContext('2d');
      if (!contexto) {
        alert('Error: failed to getContext!');
        return;
      }

      // Add the temporary canvas.
      var container = canvaso.parentNode;
      canvas = document.createElement('canvas');
      if (!canvas) {
        alert('Error: I cannot create a new canvas element!');
        return;
      }

      canvas.id     = 'imageTemp';
      canvas.width  = canvaso.width;
      canvas.height = canvaso.height;
      container.appendChild(canvas);

      context = canvas.getContext('2d');

      // Get the tool select input.

      //tool_select.addEventListener('change', ev_tool_change, false);
      $('.tool_button').click(function(){
        ev_tool_change($(this).attr('data-action'));
      });

      // Activate the default tool.
      if (tools[tool_default]) {
        tool = new tools[tool_default]();
        //tool_select.value = tool_default;
      }

      // Attach the mousedown, mousemove and mouseup event listeners.
      canvas.addEventListener('mousedown', ev_canvas, false);
      canvas.addEventListener('mousemove', ev_canvas, false);
      canvas.addEventListener('mouseup',   ev_canvas, false);
    }

    // The general-purpose event handler. This function just determines the mouse
    // position relative to the canvas element.
    function ev_canvas (ev) {
      if (ev.layerX || ev.layerX == 0) { // Firefox
        ev._x = ev.layerX;
        ev._y = ev.layerY;
      } else if (ev.offsetX || ev.offsetX == 0) { // Opera
        ev._x = ev.offsetX;
        ev._y = ev.offsetY;
      }

      // Call the event handler of the tool.
      var func = tool[ev.type];
      if (func) {
        func(ev);
      }
    }

    // The event handler for any changes made to the tool selector.
    function ev_tool_change (action) {
      if (tools[action]) {
        tool = new tools[action]();
      }
    }

    // This function draws the #imageTemp canvas on top of #imageView, after which
    // #imageTemp is cleared. This function is called each time when the user
    // completes a drawing operation.
    function img_update () {
  		contexto.drawImage(canvas, 0, 0);
  		context.clearRect(0, 0, canvas.width, canvas.height);
      $('.save-image a').attr('href', canvaso.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream"));
    }

    // This object holds the implementation of each drawing tool.
    var tools = {};

    // The drawing pencil.
    tools.pencil = function () {
      var tool = this;
      this.started = false;

      // This is called when you start holding down the mouse button.
      // This starts the pencil drawing.
      this.mousedown = function (ev) {
          context.beginPath();
          context.moveTo(ev._x, ev._y);
          tool.started = true;
      };

      // This function is called every time you move the mouse. Obviously, it only
      // draws if the tool.started state is set to true (when you are holding down
      // the mouse button).
      this.mousemove = function (ev) {
        if (tool.started) {
          context.strokeStyle = 'rgb(' + mainColor + ')';
          context.lineWidth=2;
          context.lineTo(ev._x, ev._y);
          context.stroke();
        }
      };

      // This is called when you release the mouse button.
      this.mouseup = function (ev) {
        if (tool.started) {
          tool.mousemove(ev);
          tool.started = false;
          img_update();
        }
      };
    };

    // The marker.
    tools.mark = function () {
      var tool = this;
      this.started = false;

      // This is called when you start holding down the mouse button.
      // This starts the pencil drawing.
      this.mousedown = function (ev) {
          context.beginPath();
          context.moveTo(ev._x, ev._y);
          tool.started = true;
      };

      // This function is called every time you move the mouse. Obviously, it only
      // draws if the tool.started state is set to true (when you are holding down
      // the mouse button).
      this.mousemove = function (ev) {
        if (tool.started) {
          context.strokeStyle = 'rgba(' + mainColor + ', 0.05)';
          context.lineWidth=10;
          context.lineTo(ev._x, ev._y);
          context.stroke();
        }
      };

      // This is called when you release the mouse button.
      this.mouseup = function (ev) {
        if (tool.started) {
          tool.mousemove(ev);
          tool.started = false;
          img_update();
        }
      };
    };

    // The rectangle tool.
    tools.rect = function () {
      var tool = this;
      this.started = false;

      this.mousedown = function (ev) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
      };

      this.mousemove = function (ev) {
        if (!tool.started) {
          return;
        }

        var x = Math.min(ev._x,  tool.x0),
            y = Math.min(ev._y,  tool.y0),
            w = Math.abs(ev._x - tool.x0),
            h = Math.abs(ev._y - tool.y0);

        context.clearRect(0, 0, canvas.width, canvas.height);

        if (!w || !h) {
          return;
        }
        context.strokeStyle = 'rgb(' + mainColor + ')';
        context.lineWidth = 3;
        context.strokeRect(x, y, w, h);
      };

      this.mouseup = function (ev) {
        if (tool.started) {
          tool.mousemove(ev);
          tool.started = false;
          img_update();
        }
      };
    };

    // The line tool.
    tools.line = function () {/*
      var tool = this;
      this.started = false;

      this.mousedown = function (ev) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
      };

      this.mousemove = function (ev) {
        if (!tool.started) {
          return;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = 'rgb(' + mainColor + ')';
        context.beginPath();
        context.moveTo(tool.x0, tool.y0);
        context.lineTo(ev._x,   ev._y);
        context.stroke();
        context.closePath();
      };

      this.mouseup = function (ev) {
        if (tool.started) {
          tool.mousemove(ev);
          tool.started = false;
          img_update();
        }
      };*/
    };

    // The line tool.
    tools.arrow = function () {
      var tool = this;
      this.started = false;
      var headlen = 10;

      this.mousedown = function (ev) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
      };

      this.mousemove = function (ev) {
        if (!tool.started) {
          return;
        }
        var angle = Math.atan2(ev._y-tool.y0,ev._x-tool.x0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = 'rgb(' + mainColor + ')';
        context.beginPath();
        context.moveTo(tool.x0, tool.y0);
        context.lineTo(ev._x,   ev._y);
        context.strokeStyle = 'rgb(' + mainColor + ')';
        context.lineWidth = 8;
        context.stroke();

        //starting a new path from the head of the arrow to one of the sides of the point
        context.beginPath();
        context.moveTo(ev._x,   ev._y);
        context.lineTo(ev._x-headlen*Math.cos(angle-Math.PI/7),ev._y-headlen*Math.sin(angle-Math.PI/7));

        //path from the side point of the arrow, to the other side point
        context.lineTo(ev._x-headlen*Math.cos(angle+Math.PI/7),ev._y-headlen*Math.sin(angle+Math.PI/7));

        //path from the side point back to the tip of the arrow, and then again to the opposite side point
        context.lineTo(ev._x,   ev._y);
        context.lineTo(ev._x-headlen*Math.cos(angle-Math.PI/7),ev._y-headlen*Math.sin(angle-Math.PI/7));

        //draws the paths created above
        context.strokeStyle = 'rgb(' + mainColor + ')';
        context.lineWidth = 10;
        context.stroke();
        context.fillStyle = 'rgb(' + mainColor + ')';
        context.fill();
      };

      this.mouseup = function (ev) {
        if (tool.started) {
          tool.mousemove(ev);
          tool.started = false;
          img_update();
        }
      };
    };

    tools.crop = function () {
      var tool = this;
      this.started = false;

      this.mousedown = function (ev) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
      };

      this.mousemove = function (ev) {
        if (!tool.started) {
          return;
        }

        var x = Math.min(ev._x,  tool.x0),
            y = Math.min(ev._y,  tool.y0),
            w = Math.abs(ev._x - tool.x0),
            h = Math.abs(ev._y - tool.y0);

        context.clearRect(0, 0, canvas.width, canvas.height);

        if (!w || !h) {
          return;
        }
        context.strokeStyle = 'rgb(' + mainColor + ')';
        context.lineWidth = 3;
        context.strokeRect(x, y, w, h);
      };

      this.mouseup = function (ev) {
        if (tool.started) {
          tool.started = false;
          tool.x1 = ev._x;
          tool.y1 = ev._y;
          var w = tool.x1 - tool.x0;
          var h = tool.y1 - tool.y0;
          var imgData=contexto.getImageData(tool.x0,tool.y0,w,h);
          $('#canvas-w').width(w);
          canvas.width = w;
          canvaso.width = w;
          canvas.height = h;
          canvaso.height = h;
          context.putImageData(imgData,0,0);
          img_update();
        }
      };
    };
    tools.txt = function () {
      this.mousedown = function (ev) {
        $('.txt_tool').each(function(){
          if($(this).val() == ''){
            $(this).remove();

          }
          console.log($(this).val());
        });
        $('.txt_tool').draggable();
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
        var textarea = $.parseHTML('<textarea class="txt_tool"></textarea>');
        $(textarea).css({color: 'rgb(' + mainColor + ')', top: tool.y0-3, left: tool.x0-3});
        setTimeout(function() {
         $(textarea).focus();
        }, 10);
        $('#canvas-w').append(textarea);
      };
    }


    init();


});
