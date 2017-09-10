'use strict';

chrome.runtime.onMessage.addListener(function (request, sender) {
    if (request.action == "getSource") {
        processPage(request.source);
    }
});

function processPage(pageHTML) {
    var parsedHtml = $.parseHTML(pageHTML);
    var tempDom = $('<output>').append(parsedHtml);

    var links;

    links = $("link[type='application/rss+xml']", tempDom);

    if (links.length == 0) {
        links = $("a[href*='rss']", tempDom);
    }


    console.log(links);
    var fLen, i, myLink;

    fLen = links.length;

    if (fLen == 0) {
        $("#error").show();
    } else {
        for (i = 0; i < fLen; i++) {
            myLink = links[i];
            var divOuter = $("<div class='outer'> </div>");
            var divInner = $("<div class='inner'> </div>");
            var titleText = links[i].title;

            if (!titleText) {
                titleText = links[i].text;
            }
            var label = $("<label for='title'>" + titleText + "</label>");
            divOuter.append(label);

            var textFieldId = "link" + i;
            var input1 = $("<input id='" + textFieldId + "' type='text' value='" + links[i].href + "' />");
            var btnCopy = $("<div class='copy'><div class='copy-inner'>Copy</div></div>");
            var separator = $("<hr/>");

            addOnClick(btnCopy, textFieldId);

            divInner.append(input1);
            divInner.append(btnCopy);
            divOuter.append(divInner);
            if (i < fLen - 1) {
                divOuter.append(separator);
            }
            $("#message").append(divOuter);
        }
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

function onWindowLoad() {
    console.log('onStart');
    var message = document.querySelector('#message');

    chrome.tabs.executeScript(null, {
        file: "js/getPagesSource.js"
    }, function () {
        // If you try and inject into an extensions page or the webstore/NTP you'll get an error
        if (chrome.runtime.lastError) {
            $("#emptyPage").show();
        }
    });
    $("#ico-close").click(function () {
        window.close();
    });
}

window.onload = onWindowLoad;

