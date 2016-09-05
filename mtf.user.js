// ==UserScript==
// @name Minimal Tetris Friends
// @namespace minimaltetrisfriends
// @description Reduces lag as much as possible
// @include http://*tetrisfriends.com/games/Ultra/game.php*
// @include http://*tetrisfriends.com/games/Sprint/game.php*
// @include http://*tetrisfriends.com/games/Live/game.php*
// @include http://*tetrisfriends.com/data/games/Ultra/OWGameUltra.swf
// @grant none 
// @run-at document-start
// @version 4.2.4
// @author morningpee
// ==/UserScript==

window.stop();

flashVars = new Object();
flashVars.apiUrl = "http://api.tetrisfriends.com/api";
flashVars.startParam = "clickToPlay";

var request = new XMLHttpRequest();
var SYNCHRONOUS_REQUEST=false;
request.open('GET', 'http://www.tetrisfriends.com/users/ajax/profile_my_tetris_style.php', SYNCHRONOUS_REQUEST);
request.send(null);

if (request.status === 200) {
    flashVars = Object.assign( flashVars, eval( request.responseText.match(/flashVars = {[\s\S]*timestamp.*}/)[0] ) );
    delete flashVars.viewerId;
}

flashVarsParamString = Object.keys( flashVars ).map(k => k + '=' + flashVars[k] ).join('&');
flashVarsParam = document.createElement("param");
flashVarsParam.setAttribute("name", "flashvars")
flashVarsParam.setAttribute("value", flashVarsParamString)

var contentFlashSize = new Object();

function talkAboutThatContentFlashSize()
{
    contentFlashSize.originalWidth = contentFlash.width;
    contentFlashSize.originalHeight = contentFlash.height;

    contentFlashSize.scaleFactor = 2;
    contentFlashSize.minimalWidth = contentFlash.width / contentFlashSize.scaleFactor;
    contentFlashSize.minimalHeight = contentFlash.height / contentFlashSize.scaleFactor;

}

function setContentFlashSize()
{
    contentFlash.style.width = contentFlashSize.minimalWidth + "px";
    contentFlash.style.height = contentFlashSize.minimalHeight + "px";
}

function transformContentFlash()
{
    var windowAspectRatio = innerHeight / innerWidth;

    var contentFlashAspectRatio = contentFlashSize.originalHeight / contentFlashSize.originalWidth;

    var scaleFactorX;
    var scaleFactorY;

    if(  contentFlashAspectRatio > windowAspectRatio )
    {
        updatedWidth = Math.round( innerHeight / contentFlashAspectRatio );
        updatedHeight = innerHeight;
    }
    else
    {
        updatedWidth = innerWidth;
        updatedHeight = Math.round( innerWidth * contentFlashAspectRatio );
    }

    scaleFactorX = updatedWidth / contentFlashSize.minimalWidth
    scaleFactorY = updatedHeight / contentFlashSize.minimalHeight;

    contentFlash.style.transform = "scale( " + scaleFactorX + " ) translate3d( -50%, -50%, 0px)";
}

contentFlashString = '<object id="contentFlash" data="//tetrisow-a.akamaihd.net/data5_0_0_3/games/Ultra/OWGameUltra.swf?version=3" allowscriptaccess="always" type="application/x-shockwave-flash" height="560" width="760"><param value="opaque" name="wmode"></object>';
contentFlash = new DOMParser().parseFromString(contentFlashString, 'text/html').body.children[0];
talkAboutThatContentFlashSize();
contentFlash.removeAttribute("height");
contentFlash.removeAttribute("width");
contentFlash.appendChild(flashVarsParam);

setContentFlashSize();
transformContentFlash();
addEventListener("resize", transformContentFlash);

mtfDocumentElement = document.createElement("html");
mtfDocumentElement.appendChild( document.createElement("head") ).innerHTML = '<meta name="viewport" content="height=100, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">' +
                                                                             '<style> :root{ image-rendering: optimizespeed; } @viewport { zoom: 1; min-zoom: 1; max-zoom: 1; user-zoom: fixed; } body { background: url(//tetrisow-a.akamaihd.net/data5_0_0_1/images/bg.jpg) repeat-x; font-family: "Trebuchet MS",Helvetica,Tahoma,Geneva,Verdana,Arial,sans-serif; font-size: 12px; color: #666; margin: 0; text-align: left; display: block; overflow: hidden} #contentFlash { visibility: visible !important; position: absolute; top: 50%; left: 50%; transform-style: preserve-3d; transform-origin: top left; } * { margin: 0; padding: 0; outline: none; -moz-box-sizing: border-box; box-sizing: border-box; }</style>';
mtfDocumentElement.appendChild( document.createElement("body") ).appendChild( contentFlash );

document.removeChild( document.documentElement );
document.appendChild( mtfDocumentElement );
