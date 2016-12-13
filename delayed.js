var winW = $(window).width();
var winH = $(window).height();

chrome.runtime.sendMessage({type: "delayedCapture", start: winW, end: winH}, function(response) { });