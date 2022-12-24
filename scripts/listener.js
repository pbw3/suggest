/* Approach: event delegation, leverages event bubbling
 * Collect all event handlers in this script
 * Add a click listener to the document instead of adding it to each element individually
 * i.e. document.addEventListener('click', Listener.click(e))
 * Route the click event to handlers based on the target's id and class
 * Especially important to handle links from epub content before navigating away from the app
 */

var Listener = {

    init: function() {
        console.log('Listener.init()');

        var surface = document.querySelector('#readerMainScroll') || document;
        surface.addEventListener('touchstart', Listener.touchStart, { passive: true });
        surface.addEventListener('touchmove', Listener.touchMove, { passive: true });
        surface.addEventListener('touchend', Listener.touchEnd);

        document.addEventListener('selectionchange', Listener.selectionChange);

        document.addEventListener('mousedown', Listener.mouseDown);
        document.addEventListener('mousemove', Listener.mouseMove);
        document.addEventListener('mouseup', Listener.mouseUp);
        document.addEventListener('click', Listener.click);
        document.addEventListener('dblclick', Listener.dblClick);

        window.addEventListener('focusin', Listener.focus);

        surface.addEventListener('contextmenu', Listener.context);

        // window.addEventListener("resize", Listener.resize);

        // window.addEventListener('hashchange', Reader.navigate);
        elm = document.querySelector('#readerMainScroll');
        elm.addEventListener("scroll", Listener.scroll);

        document.addEventListener("keydown", Listener.keyDown);

        window.addEventListener('beforeunload', Listener.endSession);
    },

    touchStart: function(e) {
        console.log('Listener.touchStart(' + e.target.className + ')');
        var touchEvent = e.changedTouches ? e.changedTouches[0] : e;
        Gesture.reset();
        Gesture.startX = touchEvent.clientX;
        Gesture.startY = touchEvent.clientY;
        Gesture.startTime = new Date().getTime();
        Gesture.startEvent = e;
        // e.preventDefault();
        // Listener.absorb(e);
    },

    touchMove: function(e) {
        console.log('Listener.touchMove()');
        // e.preventDefault();
        // Listener.absorb(e);
    },

    touchEnd: function(e) {
        console.log('Listener.touchEnd(' + e.target.className + ')');
        var touchEvent = e.changedTouches ? e.changedTouches[0] : e;
        Gesture.distX = touchEvent.clientX - Gesture.startX
        Gesture.distY = touchEvent.clientY - Gesture.startY
        Gesture.elapsedTime = new Date().getTime() - Gesture.startTime;
        if (Gesture.elapsedTime <= Gesture.allowedTime) { // first condition for swipe
            if (Math.abs(Gesture.distX) >= Gesture.threshold && Math.abs(Gesture.distY) <= Gesture.restraint) { // 2nd condition for horizontal swipe
                Gesture.direction = (Gesture.distX < 0) ? 'left' : 'right';
            } else if (Math.abs(Gesture.distY) >= Gesture.threshold && Math.abs(Gesture.distX) <= Gesture.restraint) { // 2nd condition for vertical swipe
                Gesture.direction = (Gesture.distY < 0) ? 'up' : 'down';
            }
        }
        Gesture.endEvent = e;
        if (Gesture.direction) {
            Listener.swipe(Gesture);
        }
        // e.preventDefault();
        // Listener.absorb(e);
    },

    selectionChange: function(e) {
        console.log('Listener.selectionChange()');
        var elm = document.querySelector('#selectionMenu');
        if (elm) { elm.classList.remove('active'); }
    },

    swipe: function() {
        console.log('swipe(' + Gesture.direction + ')');
        if (Gesture.direction == 'right') { Reader.prevPage(); }
        if (Gesture.direction == 'left') { Reader.nextPage(); }
    },

    /**
     * Handle mouse-down event and trigger functions based on target's ID and class
     * @param {object} e - click event
     */
    mouseDown: function(e) {
        console.log('Listener.mouseDown()');
        if (e.target.tagName === 'A') {
            console.log('Prevented link navigation');
            e.preventDefault();
        }
    },

    /**
     * Handle mouse-move event and trigger functions based on target's ID and class
     * @param {object} e - click event
     */
    mouseMove: function(e) {
        // console.log('Listener.mouseMove()');
        // Listener.absorb(e);
    },

    /**
     * Handle mouse-up event and trigger functions based on target's ID and class
     * @param {object} e - click event
     */
    mouseUp: function(e) {
        console.log('Listener.mouseUp()');
    },

    /**
     * Handle click event and trigger functions based on target's ID and class
     * @param {object} e - click event
     */
    click: async function(e) {
        var target = e.target || e.srcElement;
        var targetStr = target.tagName + ' # ' + target.id + ' . ' + target.classList;
        console.log('\n Listener.click(e): ' + targetStr);
        if (ENV.curUser) resetSessionTimer();

        if (target.type == "checkbox" ||
            target.type == "time" ||
            target.type == "date") {
            // allow default
            console.log('allow');
        } else { e.preventDefault(); }

        // Left Drawer Buttons
        if (target.id == "leftDrawerBtnClose") {
            toggleLeft();
        }

        // Center Panel
        else if (target.id == "centerPanelBtnMenu") {
            toggleLeft();
            // handleTab(document.querySelector('#tabMenu'));
        } else if (target.id == "btnNewSuggestion") {
            Suggestions.edit();
        } else if (target.id == "centerPanelBtnBarMore") {
            handleBtnMore(e);
        } else if (target.id == "btnSettingsClose") {
            Setting.save();
            showTab('tabReader');
        } else if (target.id == "btnSaveSuggestion") {
            await Suggestions.save();
            Suggestions.displayAll();
        } else if (target.id == "btnCancelSuggestion") {
            Suggestions.displayAll();
        } else if (target.id == "btnDeleteSuggestion") {
            let removed = await Suggestions.remove(ENV.curSug.date);
            if (removed) Suggestions.displayAll();
        }

        // Settings Tab
        else if (target.id == "resetApp") {
            Setting.resetApp();
        } else if (target.id == 'runDiagnosticBtn') {
            showDiagnostic();
        }

        // Reference pane
        else if (target.id == "btnCloseReference") {
            Mark.closeReference();
        }

        // Custom dialog
        else if (target.id == "customDialog") {
            UI.closeDialog();
        }

        // Right Drawer Buttons
        else if (target.id == "avatar") {
            handleBtnMore(e);
        } else if (target.id == "rightDrawerBtnClose") {
            closeRight();
        } else if (target.id == "rightDrawerBtnExportNotes") {
            Note.exportAll();
        }

        // More Menu
        else if (target.id == 'moreShield') {
            closeMoreMenu();
        } else if (target.id == 'btnSignOut') {
            Reader.signOut();
            closeMoreMenu();
        } else if (target.id == 'btnSwitchUser') {
            Reader.signOut();
            closeMoreMenu();
        }

        /* CLASS HANDLERS */
        else if (target.classList.contains('leftShield')) {
            closeLeft();
        } else if (target.classList.contains('rightShield')) {
            closeRight();
        } else if (target.classList.contains('user')) {
            Reader.signIn(target.id);
        } else if (target.classList.contains('btnMore')) {
            handleBtnMore(e);
        } else if (target.classList.contains('selectItem')) {
            handleCustomSelect(target);
        } else if (target.classList.contains('menuItem')) {
            handleMenuItem(target);
        } else if (target.classList.contains('tab')) {
            handleTab(target);
        }

        /* ** TAG / ELEMENT HANDLERS     **/
        else if (target.tagName == 'INPUT') {
            // console.log('Clicked input');
        } else if (target.tagName == 'TEXTAREA') {
            // console.log('Clicked textarea');
        } else if (target.tagName == 'SELECT') {
            // console.log('Clicked select');
        } else if (target.classList.contains('cdBox')) {
            // console.log('Clicked custom dialog box');
        } else if (target.tagName === 'A') {
            handleLink(e);
        }
        // default
        else if (target.parentElement) { // && !ENV.selection.text
            target.parentElement.click();
            return;
        }

        // 
        else {
            console.log('No handler for: ' + target.tagName + ' # ' + target.id + ' . ' + target.classList);
        }

        // For all clicks

    },


    // var numClicks = 0;
    // var clickTimer;

    // function events.click(e) {
    //     e.preventDefault();
    //     console.log('\nhandleClick(e)');
    //     numClicks++;
    //     if (numClicks == 1) {
    //         clickTimer = setTimeout(() => {
    //             numClicks = 0;
    //             handleSglClick(e);
    //         }, 400);
    //     } else if (numClicks == 2) {
    //         clearTimeout(clickTimer);
    //         numClicks = 0;
    //         handleDblClick(e);
    //     }
    // }

    /**
     * Handle double click event and trigger functions based on target's ID and class
     * @param {object} e - click event
     */
    dblClick: function(e) {
        e.preventDefault();
        var target = e.target || e.srcElement;
        var targetStr = target.tagName + ' # ' + target.id + ' . ' + target.classList;
        console.log('\n Listener.dblClick(e): ' + targetStr);

        if (target.tagName == 'INPUT') {
            // console.log('Clicked input');
        } else {
            console.log('Double Clicked doc');
        }
    },

    focus: function(e) {
        var target = e.target || e.srcElement;
        var targetStr = target.tagName + ' # ' + target.id + ' . ' + target.classList;
        // console.log('\n Listener.focus(e): ' + targetStr);

        if (target.matches('.longAnswer textarea, .shortAnswer input')) {
            console.log('autoSave(', targetStr, ')');
            let type = target.matches('textarea') ? 'LongAnswer' : 'ShortAnswer';
            Events.autoSaveId = new Date().toISOString(); // 2019-01-23T09:23:42.079Z
            Events.autoSaveLastValue = target.value;
            console.log('original aSLV:', Events.autoSaveLastValue);
            Events.autoSaveInterval = setInterval(() => {
                Events.recordAnswer(target, type);
            }, 3000);
            target.addEventListener('blur', () => {
                Events.recordAnswer(target, type);
                clearInterval(Events.autoSaveInterval);
            });
        }
    },

    /**
     * Handle resize event and trigger functions based screen width
     */
    resize: function() {
        if (isMobile()) { return; }
        if (window.innerWidth > 800) {
            openLeft();
        }
        if (window.innerWidth < 800) {
            closeLeft();
        }
        if (window.innerWidth > 601) {
            openRight();
        }
        if (window.innerWidth < 601) {
            closeRight();
        }
    },

    /**
     * Handle scroll event
     */
    scroll: function() {
        // 
    },

    /**
     * Handle context-menu event and trigger functions based on target's ID and class
     * @param {object} e - click event
     */
    context: function(e) {
        console.log('Listener.context(' + e.target.className + ')');
        if (isMobile()) {
            if (window.getSelection) {
                var sel = window.getSelection();
                if (!sel.isCollapsed) {
                    range = sel.getRangeAt(0);
                    // Mark.displaySelectionMenu();
                    Gesture.menuTimer = setTimeout(() => { Mark.displaySelectionMenu(); }, 500);
                }
            }
            Listener.absorb(e);
        }
    },

    /**
     * Cancel all default event actions
     * @param {object} e - click event
     */
    absorb: function(event) {
        // console.log('Listener.absorb()');
        var e = event || window.event;
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
    },

    last: { down: null, up: null },

    keyDown: function(e) {
        if (ENV.curUser) resetSessionTimer();
        var target = e.target || e.srcElement;
        var tag = target.tagName;
        var cl = target.classList;
        var id = target.id;
        var prevent = true;

        // console.log('keyDown(' + e.key + ') ' + tag + ' #' + id + ' .' + cl);

        // Inside a field: Input, Textarea
        if (tag == 'INPUT' || tag == 'TEXTAREA') {
            // console.log('1');
            if (id == 'txtSearch' && e.key == 'Enter') {
                Search.go();
            } else {
                prevent = false;
            }
        }
        // Outside a field
        else {
            // console.log('2');
            if (e.ctrlKey || e.altKey) {
                prevent = true;
                if (e.key == 'Home') { document.querySelector('#leftDrawerBtnHome').click(); } else
                if (false) { /*  */ } else {
                    prevent = false;
                }
            } else {
                prevent = true;
                if (e.key == 'm') { showTab('tabMenu'); } else
                if (e.key == 'b') { showTab('tabBookmarks'); } else
                if (e.key == 'r') { showTab('tabRecent'); } else
                if (e.key == 'n') { showTab('tabNotes'); } else
                if (e.key == 's') { Search.open(); } else
                if (e.key == 'ArrowLeft') { Reader.prevPage(); } else
                if (e.key == 'ArrowRight') { Reader.nextPage(); } else
                if (false) { /*  */ } else {
                    prevent = false;
                }

                // Todo: If image viewer is up, [ESC] to close fullscreen
            }
        }

        // Inside or Outside a field
        if (e.key == 's' && (e.ctrlKey || e.altKey)) {
            // console.log('3');
            Search.open();
            prevent = true;
        }

        if (prevent) {
            // console.log('4');
            e.preventDefault();
        }
    },

    endSession: async function(e) {
        return new Promise(async resolve => {
            var end = Date.now();
            var start = ENV.signInTime;
            if (!start) return; // never signed in
            var sessionMinutes = Math.round(((end - start) / 1000 / 60) * 100) / 100;
            var percentOnline = Math.round(ENV.onlineCount / (ENV.onlineCount + ENV.offlineCount) * 100);
            await Events.record('EndSession', sessionMinutes + ' min, ' +
                percentOnline + '% online, ' +
                ENV.downloadBytes + ' B down, ' +
                ENV.uploadBytes + ' B up, ' +
                ENV.newMarkCount + ' marks, ' +
                ENV.newNoteCount + ' notes, ' +
                ENV.searchCount + ' searches, ' +
                ENV.speakCount + ' speaks, '
            );
            return resolve();
        });
    }

}

var Gesture = {
    reset: function() {
        this.direction = '';
        this.startX = null;
        this.startY = null;
        this.distX = null;
        this.distY = null;
        this.startTime = null;
        this.elapsedTime = null;
        this.threshold = 100; // min distance to be a swipe
        this.restraint = 100; // max perpendicular distance to be a swipe
        this.allowedTime = 300; // max movement time to be a swipe
    }
}