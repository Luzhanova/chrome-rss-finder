'use strict';

chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "getSource") {
        processPage(request.source);
    }
});

function processPage(pageHTML){
    console.log('1111');
    //message.innerText = pageHTML;

    var links = $($.parseHTML(pageHTML)).filter("link[type='application/rss+xml']");
    console.log(links);
    //message.innerText = links;

    var myList, fLen, i, myLink;

    fLen = links.length;
    myList = "<ul>";
    for (i = 0; i < fLen; i++) {
        myLink = links[i];
        myList += "<li>" + myLink.href + "</li>";
    }
    myList += "</ul>";
    message.innerHTML = myList;
}
//<link rel="alternate" type="application/rss+xml" title="The Devochki &raquo; Лента" href="http://thedevochki.com/feed/" />

function onWindowLoad() {
    console.log('onStart');
    var message = document.querySelector('#message');

    chrome.tabs.executeScript(null, {
        file: "js/getPagesSource.js"
    }, function() {
        // If you try and inject into an extensions page or the webstore/NTP you'll get an error
        if (chrome.runtime.lastError) {
            message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
        }
    });

}

window.onload = onWindowLoad;



