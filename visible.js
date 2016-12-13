var winW = $(window).width();
var winH = $(window).height();

chrome.runtime.sendMessage({type: "capture_visible", start: winW, end: winH}, function(response) { });