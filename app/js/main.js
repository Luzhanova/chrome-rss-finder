'use strict';

chrome.runtime.onMessage.addListener(function (request, sender) {
    if (request.action == "getSource") {
        processPage(request.source);
    }
});

function processPage(pageHTML) {
    console.log('1111');
    //message.innerText = pageHTML;

    var links = $($.parseHTML(pageHTML)).filter("link[type='application/rss+xml']");
    console.log(links);

    var fLen, i, myLink;

    fLen = links.length;

    for (i = 0; i < fLen; i++) {
        myLink = links[i];
        var divOuter = $("<div class='outer'> </div>");
        var divInner = $("<div class='inner'> </div>");
        var label = $("<label for='title'>" + links[i].title + "</label>");
        divOuter.append(label);

        var textFieldId = "link" + i;
        var input1 = $("<input id='" + textFieldId + "' type='text' value='" + links[i].href + "' />");
        var btnCopy = $("<div class='copy'>Copy</div>");

        addOnClick(btnCopy, textFieldId);

        divInner.append(input1);
        divInner.append(btnCopy);
        divOuter.append(divInner);
        $("#message").append(divOuter);
    }
}

function addOnClick(button, linkId) {
    button.click(function () {
        var selectedInput = $("#" + linkId);
        selectedInput.select();
        console.log(selectedInput);
        document.execCommand('copy');
    });
}
//<link rel="alternate" type="application/rss+xml" title="The Devochki &raquo; Лента" href="http://thedevochki.com/feed/" />

function onWindowLoad() {
    console.log('onStart');
    var message = document.querySelector('#message');

    chrome.tabs.executeScript(null, {
        file: "js/getPagesSource.js"
    }, function () {
        // If you try and inject into an extensions page or the webstore/NTP you'll get an error
        if (chrome.runtime.lastError) {
            message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
        }
    });

}

window.onload = onWindowLoad;