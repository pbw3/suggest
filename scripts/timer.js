console.log('timer.js loaded...');

const Timer = (() => {

    var timeoutId;

    async function checkTime() {
        let clock = document.querySelector('#pageTitle');
        let now = new Date();
        let nowStr = now.toLocaleTimeString();
        nowStr = nowStr.replace(/:00 /, ' ');
        clock.innerHTML = nowStr;

        if (!ENV.nextSug.due) {
            Suggestions.setDueTimes();
        } else if (new Date(ENV.nextSug.due) <= now) {
            await Suggestions.suggest(ENV.nextSug);
            Suggestions.setDueTimes();
        }

        timeoutId = setTimeout(checkTime, 1000);
    }

    function start() {
        checkTime();
    }

    function stop() {
        clearTimeout(timeoutId);
    }

    return { checkTime, start, stop }
})();