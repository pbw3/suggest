console.log('index.js loaded...');
var PWAInstallPrompt;
window.addEventListener('beforeinstallprompt', (e) => { PWAInstallPrompt = e; });
window.addEventListener('appinstalled', async() => {
    ENV.settings.pwaInstallStatus = 'Installed';
    await Setting.save();
    console.log('PWA Installed');
    Reader.navigate();
});
document.addEventListener("DOMContentLoaded", initApp);

// GLOBAL VARIABLES
var ENV = {
    appVersion: '',
    curUserId: -1,
    os: '',
    settings: {
        id: 1,
        theme: "Light",
        themeColor: "Gold",
        fontSize: "18",
        lineHeight: "2",
        language: 'en',
        audio: {
            mode: "continuous",
            pitch: 1,
            rate: 1,
            voice: "Google US English",
            // voice: "Google UK English Female",
            volume: 1
        },
        mode: "test",
    },
    sessionTimer: null,
};

async function initApp() {
    console.log('initApp()');

    var asApp = document.querySelector('#asApp');
    var html = await fetch('views/shell.html').then(res => res.text());
    asApp.innerHTML = html;

    Listener.init();
    Listener.resize();
    await registerServiceWorker();
    await Database.init();

    Suggestions.displayAll();

    console.log('App Version: ' + AD.version);
}

async function registerServiceWorker() {
    console.log('registerServiceWorker()');
    return new Promise((resolve, reject) => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("serviceWorker.js")
                .then(function(reg) {
                    console.log("...service worker registered");
                    reg.onupdatefound = () => {
                        console.log('...service worker update found');
                        const installingWorker = reg.installing;
                        installingWorker.onstatechange = () => {
                            switch (installingWorker.state) {
                                case 'installed':
                                    if (navigator.serviceWorker.controller) {
                                        console.log('New update available. Refresh.');
                                        UI.toast('App updated. Refreshing...');
                                        setTimeout(() => {
                                            location.reload();
                                        }, 3000);
                                        resolve(true);
                                    } else {
                                        console.log('No updates available.');
                                        resolve(false);
                                    }
                                    break;
                            }
                        };
                    }
                    resolve(true);
                })
                .catch(function(err) {
                    console.log("...service worker not registered", err);
                    reject(false);
                });
        } else {
            console.log("...service workers not supported by browser");
        }
    });
}

function showTab(tabId) {
    console.log('showTab(' + tabId + ')');
    var newTab, oldTab, tabCntId, newTabCnt, oldTabCnt;
    newTab = document.getElementById(tabId);
    if (newTab) {
        oldTab = newTab.parentElement.querySelector('.current');
        if (oldTab) oldTab.classList.remove('current');
        newTab.classList.add('current');
    }
    tabCntId = tabId.replace(/^tab/, 'tabContent');
    newTabCnt = document.getElementById(tabCntId);
    if (newTabCnt) {
        oldTabCnt = newTabCnt.parentElement.querySelector('.current');
        if (oldTabCnt) {
            oldTabCnt.classList.remove('current');
        }
        newTabCnt.classList.add('current');
    }
}

function toggleTabs(tabId1, tabId2) {
    console.log('toggleTab(' + tabId1 + ',' + tabId2 + ')');
    var curTabId, oldTab, tabCntId, newTabCnt, oldTabCnt;
    var cntId1 = tabId1.replace(/^tab/, 'tabContent');
    var cntId2 = tabId2.replace(/^tab/, 'tabContent');
    var tab1 = document.getElementById(tabId1) || document.getElementById(cntId1);
    var tab2 = document.getElementById(tabId2) || document.getElementById(cntId2);
    if (tab1 && tab2) {
        if (tab1.classList.contains('current')) {
            tab1.classList.remove('current');
            tab2.classList.add('current');
            curTabId = tabId2;
        } else if (tab2.classList.contains('current')) {
            tab2.classList.remove('current');
            tab1.classList.add('current');
            curTabId = tabId1;
        } else {
            oldTab = tab1.parentElement.querySelector('.current');
            if (oldTab) oldTab.classList.remove('current');
            tab1.classList.add('current');
            curTabId = tabId1;
        }
    }
    tabCntId = curTabId.replace(/^tab/, 'tabContent');
    newTabCnt = document.getElementById(tabCntId);
    if (newTabCnt) {
        oldTabCnt = newTabCnt.parentElement.querySelector('.current');
        if (oldTabCnt) oldTabCnt.classList.remove('current');
        newTabCnt.classList.add('current');
    }
}

async function handleBtnMore(e) {
    console.log('handleBtnMore()');
    var target = e.target || e.srcElement;
    var html = '';
    var elm = document.querySelector('.moreShield');
    elm.classList.add('active');
    elm = elm.querySelector('.moreMenu');
    elm.style.left = '0px';
    if (target.parentElement.classList.contains('bookmark')) {
        ENV.curBookmarkId = target.parentElement.id;
        html += '<a href="#0" id="btnUpdateBookmark" class="menuButton">Update</a>';
        html += '<a href="#0" id="btnRenameBookmark" class="menuButton">Rename</a>';
        html += '<a href="#0" id="btnDeleteBookmark" class="menuButton">Delete</a>';
    } else if (target.parentElement.classList.contains('user')) {
        ENV.curUserId = target.parentElement.id.replace(/^user/, '');;
        html += '<a href="#0" id="btnRemoveUser" class="menuButton">Remove</a>';
    } else if (target.parentElement.classList.contains('bookCard')) {
        ENV.curBook = target.parentElement.id.replace(/^bk/, '');
        html += '<a href="#0" id="btnRemoveBook" class="menuButton">Remove</a>';
    } else if (target.id == 'centerPanelBtnBarMore') {
        // html += '<a href="#0" id="btnLanguageHelps" class="menuButton">Language Helps</a>';
        html += '<a href="#0" id="btnPlayAudio" class="menuButton">Play Audio</a>';
        html += '<a href="#0" id="btnPrint" class="menuButton">Print</a>';
        html += '<a href="#0" id="btnSettings" class="menuButton">Settings</a>';
    } else if (target.id == 'avatar') {
        html += '<a href="#0" id="btnSignOut" class="menuButton">Sign Out</a>';
        html += '<a href="#0" id="btnSwitchUser" class="menuButton">Switch User</a>';
    } else if (target.parentElement.classList.contains('noteBar')) {
        ENV.curNoteId = target.parentElement.parentElement.id;
        html += '<a href="#0" id="btnEditNote" class="menuButton">Edit</a>';
        html += '<a href="#0" id="btnDeleteNote" class="menuButton">Delete</a>';
    }
    elm.innerHTML = html;
    var targetRect = e.target.getBoundingClientRect();
    elm.style.left = (targetRect.right - elm.offsetWidth) + 'px';
    elm.style.top = targetRect.bottom + 'px';
}

function handleTab(elm) {
    console.log('handleTab()');
    showTab(elm.id);
}

function handleLink(e) {
    var target = e.target || e.srcElement;
    console.log('handleLink(): ' + target.getAttribute('href'));
    var elm = target;
    var href = elm.getAttribute('href');
    if (href == '' || href == '#0') { return; }
    var hType = /^https?:\/\//i.test(href) ? 'absolute' :
        /^mailto/i.test(href) ? 'mailto' :
        /^data/i.test(href) ? 'data' :
        /^#!/i.test(href) ? 'book/page' :
        /^[a-z0-9]+/i.test(href) ? 'relative' :
        /^#/i.test(href) ? 'anchor' : '';
    console.log('Link Type:', hType);
    if (/cdnapisec.kaltura.com|youtube.com|vimeo.com|video.byui.edu|brightcove.|byui.zoom.us/.test(href)) {
        Events.record('Video', href);
    }

    var u = Reader.parseUrl(elm.href);
    if (hType == 'mailto' || hType == 'data') {
        window.open(href, '_blank');
    } else if (hType == 'anchor') {
        let id = href.replace(/^#/, '');
        let targetElm = document.getElementById(id);
        // let targParent = targetElm ? targetElm.parentElement : null;
        // let targetElm = document.querySelector(href);
        if (targetElm && targetElm.classList.contains('overlay')) { // || targParent.classList.contains('overlay')
            UI.overlay('', targetElm.innerHTML);
        } else if (targetElm) targetElm.scrollIntoView();

    } else if (u.host == location.host & !/(xls|xlsx|doc|docx|pdf|jpg)$/.test(href)) {
        if (u.pathname.match(/[^\/]+\/$/)) {
            console.log('...link to book: ' + u.pathname);
        }
        Reader.displayPage(href);
    } else {
        if (hType == 'relative') href = 'content/' + ENV.curBook + '/OEBPS/' + href;
        window.open(href, '_blank');
    }
}

function handleCustomSelect(elm) {
    console.log('handleCustomSelect()');
    prev = elm.parentElement.querySelector('a.selected');
    if (prev) { prev.classList.remove('selected'); }
    elm.classList.add('selected');
    var input = elm.parentElement.querySelector('input');
    input.value = getFromSearchString(elm.href, 'val');
}

function handleMenuItem(elm) {
    var prev, parts, bookCode, pageCode, u;
    console.log('handleMenuItem() ');
    prev = elm.parentElement.querySelector('a.selected');
    if (prev) { prev.classList.remove('selected'); }
    elm.classList.add('selected');
    let id = elm.href.replace(/.*#/, '') * 1;
    Suggestions.displayForm(id)
    return;
}

function toggleLeft() {
    var elm = document.querySelector('.leftPanel');
    if (elm.classList.contains('open')) {
        closeLeft();
    } else { openLeft(); }
}

function openLeft() {
    var elm = document.querySelector('.leftPanel');
    elm.classList.add('open');
    if (window.innerWidth < 800) {
        elm = elm.querySelector('.shield');
        elm.classList.add('active');
    }
}

function closeLeft() {
    var elm = document.querySelector('.leftPanel');
    elm.classList.remove('open');
    elm = elm.querySelector('.shield');
    elm.classList.remove('active');
}

function closeMoreMenu() {
    var elm = document.querySelector('.moreShield');
    elm.classList.remove('active');
}

function toggleBottom() {
    var elm = document.querySelector('.bottomPanel');
    elm.classList.toggle('open');
}

function openBottom() {
    var elm = document.querySelector('.bottomPanel');
    elm.classList.add('open');
}

function closeBottom() {
    var elm = document.querySelector('.bottomPanel');
    elm.classList.remove('open');
}

function toggleRight() {
    var elm = document.querySelector('.rightPanel');
    // elm.classList.toggle('open');
    if (elm.classList.contains('open')) { closeRight(); } else { openRight(); }
}

function openRight() {
    var elm = document.querySelector('.rightPanel');
    elm.classList.add('open');
    if (window.innerWidth < 601) {
        elm = elm.querySelector('.shield');
        elm.classList.add('active');
    }
}

function closeRight() {
    var elm = document.querySelector('.rightPanel');
    elm.classList.remove('open');
    elm = elm.querySelector('.shield');
    elm.classList.remove('active');
}

function resetSessionTimer() {
    clearTimeout(ENV.sessionTimer);
    if (!ENV.curUser) return;
    ENV.sessionTimer = setTimeout(() => {
        Reader.signOut();
    }, 15 * 60 * 1000);
}

function pauseSessionTimer() {
    clearTimeout(ENV.sessionTimer);
}

function updateTheme(toTheme) {
    console.log('updateTheme(' + toTheme + ')');
    toTheme = toTheme || ENV.theme;
    if (toTheme == 'Light') {
        setCssVar('--surface', '#F7F8F8');
        setCssVar('--on-surface', '#4b4b4b');
        setCssVar('--secondary', '#d6d7d8');
        setCssVar('--secondaryLight', '#E6E7E8');
        setCssVar('--on-secondary', '#2F302C');
        setCssVar('--highlightOpacity', '.25');
    }
    if (toTheme == 'Dark') {
        setCssVar('--surface', '#000000');
        setCssVar('--on-surface', '#bdbdbd');
        setCssVar('--secondary', '#262627');
        setCssVar('--secondaryLight', '#464647');
        setCssVar('--on-secondary', '#B3B3B3');
        setCssVar('--highlightOpacity', '.5');
    }
    ENV.theme = toTheme;
}