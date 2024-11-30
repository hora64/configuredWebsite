function loadTabContent(tabId, url) {
    $(tabId).load(url); // Load content from the specified URL into the tab
}

function setupAudioPreview(element, audioSrc, scale) {
    var audio = $(element).data('audio');
    if (!audio) {
        audio = new Audio(audioSrc);
        $(element).data('audio', audio);
    }

    $(element).hover(
        function() {
            audio.play();
            $(element).css("transform", "scale(" + scale + ")");
        },
        function() {
            audio.pause();
            audio.currentTime = 0;
            $(element).css("transform", "scale(1)");
        }
    );
}

function setupImagePreview(element, scale) {
    var newSrc = $(element).data("hover-src");
    var originalSrc = $(element).data("original-src");

    if (newSrc && originalSrc) {
        $(element).hover(
            function() {
                $(element).attr("src", newSrc);
                $(element).css("transform", "scale(" + scale + ")");
            },
            function() {
                $(element).attr("src", originalSrc);
                $(element).css("transform", "scale(1)");
            }
        );
    } else {
        $(element).css("transform", "scale(" + scale + ")");
    }
}
