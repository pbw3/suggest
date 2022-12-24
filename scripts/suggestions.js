console.log('suggestions.js loaded...');

const Suggestions = (() => {
    console.log('running');

    let sndAlarm = new Audio('sounds/Alarm Dawn.mp3');
    console.log('Alarm', sndAlarm);

    async function displayAll() {
        console.log('displayAll()');
        let html = '';
        html += '<div class="banner">';
        html += '<a href="#0">';
        html += '<img src="images/banners/calling.jpg" alt="Christ calling Peter to choose to follow Him" width="600px">';
        html += '</a>';
        html += '</div>';
        html += '<div id="midMainMenu" class="verticalMenu">';
        html += '<p>Loading content...</p>';
        html += '</div>';
        let mainContent = document.querySelector('#mainContent');
        mainContent.innerHTML = html;

        var suggestions = await Database.getAll('suggestions');
        suggestions.sort((a, b) => new Date(a.due) - new Date(b.due));
        html = '';
        suggestions.map(sug => {
            html += '<a href="#' + sug.date + '" class="menuItem">' + sug.label + '</a>';
        });
        let mainMenu = document.querySelector('#midMainMenu');
        mainMenu.innerHTML = html;
    }

    async function edit(sugId = null) {
        console.log('edit(' + sugId + ')');
        let dateStr = new Date().toLocaleDateString('en-CA').replace(/\//g, '-');
        let timeStr = new Date().toLocaleTimeString('en-CA', { hour12: false }).substring(0, 5);
        let blankSug = {
            date: 0,
            due: '',
            label: '',
            image: '',
            options: [],
            stDate: dateStr,
            stTime: timeStr,
            recurUnit: 'days',
            recurValue: 1
        }
        var sug = sugId ? await Database.get('suggestions', sugId) : blankSug;
        var html = await fetch('views/suggestion.html').then(res => res.text());
        html = ejs.render(html, sug);
        let mainContent = document.querySelector('#mainContent');
        mainContent.innerHTML = html;
        ENV.curSug = sug;
    }

    /** Save the new or edited suggestion and close the editor
     */
    async function save(frm) {
        console.log('Suggestions.save()');
        let nowStr = new Date().valueOf(); // 1671748836982
        let sugForm = document.querySelector('#sugForm');
        let data = getFormData(sugForm);
        let options = data.options.split('\n');
        let sug = {
            date: ENV.curSug.date || nowStr,
            label: data.label || ENV.curSug.label || '',
            image: data.image || ENV.curSug.image || '',
            options: options || ENV.curSug.options || [],
            stDate: data.stDate || ENV.curSug.stDate || '',
            stTime: data.stTime || ENV.curSug.stTime || '',
            recurUnit: data.recurUnit || ENV.curSug.recurUnit || '',
            recurValue: data.recurValue || ENV.curSug.recurValue || 0,
        };
        sug.due = calcDue(sug);
        var sugId = data.label ? await Database.put('suggestions', sug) : 0;
        return sugId;
    }

    async function remove(sugId) {
        console.log('remove(' + sugId + ')');
        let confirmed = await UI.confirm('Are you sure you want to permanently DELETE?');
        if (!confirmed) return;
        await Database.delete('suggestions', sugId);
        return sugId;
    }

    async function setDueTimes() {
        console.log('setDueTimes()');
        var suggestions = await Database.getAll('suggestions');
        const now = new Date();
        suggestions.map(async(sug) => {
            let origDue = sug.due;
            sug.due = calcDue(sug);
            if (origDue != sug.due) {
                sugId = await Database.put('suggestions', sug);
                if (!sugId) return console.log('Error in setDueTimes', sug);
            }
            if (!ENV.nextSug.due) {
                console.log('Init ENV.nextSug:,', sug.due);
                ENV.nextSug = sug;
            }
            if (new Date(sug.due) < new Date(ENV.nextSug.due)) {
                ENV.nextSug = sug;
                console.log('Update ENV.nextSug:', sug.due);
            }
        });
    }

    function calcDue(sug) {
        let due, dueMs;
        const minMs = 60 * 1000;
        const hrMs = 60 * minMs;
        const dayMs = 24 * hrMs;
        const wkMs = 7 * dayMs;
        const now = new Date();
        const nowMs = now.valueOf();
        const start = new Date(sug.stDate + ' ' + sug.stTime);
        const startMs = start.valueOf();
        due = start;
        dueMs = startMs;
        if (sug.recurUnit == 'minutes') {
            while (dueMs < nowMs) { dueMs = dueMs + (sug.recurValue * minMs); }
        } else if (sug.recurUnit == 'hours') {
            while (dueMs < nowMs) { dueMs = dueMs + (sug.recurValue * hrMs); }
        } else if (sug.recurUnit == 'days') {
            while (dueMs < nowMs) { dueMs = dueMs + (sug.recurValue * dayMs); }
        } else if (sug.recurUnit == 'weeks') {
            while (dueMs < nowMs) { dueMs = dueMs + (sug.recurValue * wkMs); }
        } else if (sug.recurUnit == 'months') {
            while (due < now) {
                due = new Date(due.setMonth(due.getMonth() + sug.recurValue * 1));
            }
        } else if (sug.recurUnit == 'years') {
            while (due < now) {
                due = new Date(due.setFullYear(due.getFullYear() + sug.recurValue * 1));
            }
        }
        if (dueMs > due.valueOf()) due = new Date(dueMs);
        let dueStr = due.toLocaleString();
        dueStr = dueStr.replace(/:00 /, ' ');
        return dueStr;
    }

    async function suggest(sug) {
        console.log('suggest()');
        ENV.nextSug = {};
        let html = '<h1>' + sug.label + '</h1><h2>' + sug.options[0] + '</h2>';
        Timer.stop();
        sndAlarm.play();
        await UI.dialog('Suggestion', html);
        sndAlarm.pause();
        Timer.start();
        sug.options.push(sug.options.shift());
        await Database.put('suggestions', sug);
        displayAll();
    }

    return { displayAll, edit, save, remove, setDueTimes, suggest };
})();