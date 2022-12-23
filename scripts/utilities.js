console.log('utilities.js loaded...');

function requireJs(url) {
    var scripts = document.scripts;
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].getAttribute('src') == url) return;
    }
    var elm = document.createElement("script");
    elm.type = 'text/javascript';
    elm.src = url;
    document.head.appendChild(elm);
}

function requireCss(url) {
    var styles = document.querySelectorAll('link');
    for (var i = 0; i < styles.length; i++) {
        if (styles[i].getAttribute('href') == url) return;
    }
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}

function getCssVar(varName) {
    var root = document.querySelector(':root');
    var style = getComputedStyle(root);
    return style.getPropertyValue(varName);
}

function setCssVar(varName, varValue) {
    // var root = document.querySelector(':root');
    var root = document.documentElement;
    root.style.setProperty(varName, varValue);
}

function formatDate(date) {
    console.log('formatDate()');
    if (typeof date == 'string') { date = new Date(date); }
    if (!date) { date = new Date(); }
    var dateStr = '';
    // var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dateStr = days[date.getDay()] + ', ' +
        months[date.getMonth()] + ' ' +
        date.getDate() + ', ' +
        date.getFullYear();
    // dateStr = date.toString();
    // dateStr = dateStr.match(/[a-z]{3} [a-z]{3} \d{1,2} \d{4}/i)[0];
    return dateStr;
}

function formatDateStr(date, fmt) {
    console.log('formatDateStr()');
    if (!date) { date = new Date(); }
    if (typeof date == 'string') { date = new Date(date); }
    var dateStr = '';
    // var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var day = days[date.getDay()];
    var mon = months[date.getMonth()];
    var d = date.getDate();
    var yyyy = date.getFullYear();
    // dateStr = date.toString();
    // dateStr = dateStr.match(/[a-z]{3} [a-z]{3} \d{1,2} \d{4}/i)[0];
    return dateStr;
}

function dateToClassId(dateStr) {
    return dateStr.replace(/[\-\:\.]/g, '');
}

function classIdToDateStr(classId) {
    console.log('classIdToDateStr()', classId)
    var dateStr = classId.replace(/([a-z]?\-?)(\d{4})(\d{2})(.{5})(\d{2})(\d{2})(.{4})/, "$2-$3-$4:$5:$6.$7");
    console.log(dateStr);
    return dateStr;
}

function copyToClipboard(str) {
    if (!str) { str = document.getSelection(); }
    document.body.insertAdjacentHTML("beforeend", "<textarea id='copyTA'></textarea>");
    var ta = document.getElementById('copyTA');
    ta.value = str;
    ta.select();
    ta.setSelectionRange(0, 99999); /* For mobile devices */
    document.execCommand("copy");
    UI.toast("Text copied to the clipboard.", { duration: 2000 });
    ta.remove();
}

function cleanHtml(html) {
    console.log('cleanHtml()');
    var div = document.createElement('div');
    div.innerHTML = html;
    var scripts = div.getElementsByTagName('script');
    var i = scripts.length;
    while (i--) {
        scripts[i].parentNode.removeChild(scripts[i]);
    }

    // var styles = div.querySelectorAll('[rel = stylesheet], style');
    // i = styles.length;
    // while (i--) {
    //     styles[i].parentNode.removeChild(styles[i]);
    // }

    return div.innerHTML;
}

// function promisify(fn) {
//     return (...args) => {
//         return new Promise((resolve, reject) => {
//             function customCallback(err, ...results) {
//                 if (err) {
//                     return reject(err)
//                 }
//                 return resolve(results.length === 1 ? results[0] : results)
//             }
//             args.push(customCallback)
//             fn.call(this, ...args)
//         })
//     }
// }

function getFromSearchString(url, key) {
    var reStr = '(?:\\?|&)(?:' + key + '=)([^\&]*)';
    console.log('getFromSearchString(' + reStr + ')');
    var re = new RegExp(reStr, "i");
    var matches = url.match(re);
    return matches ? matches[1] : '';
}

function getClassId(elm, prefix) {
    var re = new RegExp(prefix + '([a-z0-9]+)', 'i');
    return elm.className.match(re)[1] || -1;
}

function getClassByPrefix(elm, prefix) {
    var re = new RegExp(prefix + '[a-z0-9]+', 'i');
    var m = elm.className.match(re);
    // return m ? m[0] : -1;
    return m ? m[0] : null;
}

async function pause(ms) {
    console.log('pause(' + ms + ')');
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    })
}

async function awaitLoad(varName) {
    console.log('awaitLoad(' + varName + ')');
    return new Promise(async(resolve) => {
        while (!window.hasOwnProperty(varName)) {
            await pause(100);
            console.log('.');
        }
        resolve(window[varName]);
    })
}

async function testPause() {
    console.log('testPause()');
    await pause(3000);
    console.log('test complete');
}

shuffle = function(array) {
    var currentIndex = array.length,
        randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }
    return array;
}

function isScrolledIntoView(el) {
    var eRect = el.getBoundingClientRect();
    var pRect = el.parentElement.getBoundingClientRect();

    // Only completely visible elements return true:
    // var isVisible = (eRect.top >= 0) && (eRect.bottom <= window.innerHeight);
    var isVisible = (eRect.top >= pRect.top) && (eRect.bottom <= pRect.bottom);
    // Partially visible elements return true:
    // isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
}


// ToDo: get this working. not working yet. 
// check if el is visible, accounting for hidden parents, siblings, etc.
function isVisible(el) {
    if (!el.parentElement) return true;
    var eRect = el.getBoundingClientRect();
    var pRect = el.parentElement.getBoundingClientRect();
    if (eRect.top > pRect.top) {
        console.log(el.tagName + '#' + el.id + '.' + el.className);
        return isVisible(el.parentElement);
    } else { return false; }
}

function scrollIntoViewIfNeeded(el) {
    console.log('scrollIntoViewIfNeeded(');
    if (!isScrolledIntoView(el)) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
}

function isNumber(num) {
    return !isNaN(num)
}

function isDescendant(parent, child) {
    var node = child.parentNode;
    while (node != null) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

function getDescendants(node, descendants) {
    var i;
    descendants = descendants || [];
    for (i = 0; i < node.childNodes.length; i++) {
        descendants.push(node.childNodes[i])
        getDescendants(node.childNodes[i], descendants);
    }
    return descendants;
}

function isMobile() {
    var check = false;
    (function(a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

function getDimensions() {
    return (window.screen.width + ' X ' + window.screen.height);
}

function detectDevice() { return isMobile() ? 'Mobile' : 'PC'; }

function getOS() {
    var userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'Windows';
    } else if (/Android/.test(userAgent)) {
        os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
        os = 'Linux';
    }

    return os;
}

function detectBrowser() {
    var browser = '';
    var version = '';
    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
        browser = 'Opera';
    } else if (navigator.userAgent.indexOf("Edge") != -1) {
        browser = 'Edge';
    } else if (navigator.userAgent.indexOf("Edg") != -1) {
        browser = 'Edg';
    } else if (navigator.userAgent.indexOf("Chrome") != -1) {
        browser = 'Chrome';
    } else if (navigator.userAgent.indexOf("Safari") != -1) {
        browser = 'Safari';
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
        browser = 'Firefox';
    } else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true)) {
        browser = 'IE';
    } else {
        browser = 'Unknown';
    }
    var re = new RegExp('(' + browser + ')[^0-9]*([0-9]+)', 'i');
    var m = navigator.userAgent.match(re);
    if (m && m[2]) version = m[2];
    if (browser == 'Edg') browser = 'Edge';
    console.log(browser + ' ' + version);
    return (browser + ' ' + version);
}

function detectDisplayMode() {
    var sa = window.matchMedia('(display-mode: standalone)').matches;
    return sa ? 'Standalone' : 'Browser';
}

function getDeviceDetails() {
    var device = isMobile() ? 'Mobile' : 'PC';
    var os = getOS();
    var dim = getDimensions();
    var browser = detectBrowser();
    var mode = detectDisplayMode();
    return AD.version + ', ' + device + ', ' + os + ', ' + dim + ', ' + browser + ', ' + mode;
}

function triggerMouseEvent(target, type) {
    console.log('triggerMouseEvent()');
    if (document.createEvent) {
        e = new Event(type);
        console.log(e);
        target.dispatchEvent(e);
    } else {
        e = document.createEventObject();
        target.fireEvent('on' + type, e);
    }
}

/** Simulate a natural mouse-click sequence. */
function simulateClick(target) {
    console.log('simulateClick()');
    triggerMouseEvent(target, "mouseover");
    triggerMouseEvent(target, "mousedown");
    triggerMouseEvent(target, "mouseup");
    triggerMouseEvent(target, "click");
}

function getNodeIndex(node) {
    var i = 0;
    while ((node = node.previousSibling) != null) { i++; }
    return i;
}

function getNextSibling(elm, sel) {
    // console.log('getNextSibling(', elm.tagName, '.', elm.className, ',', sel);
    let sib = elm.nextElementSibling;
    while (sib) {
        if (sib.matches(sel)) return sib;
        sib = sib.nextElementSibling;
    }
}

function getPathToParent(endNode, startNode) {
    console.log('getPathToParent([endNode],[startNode])');
    var path = [];
    var i = 0;
    var node = startNode;
    while (node != endNode) {
        i = getNodeIndex(node);
        path.unshift(i);
        node = node.parentNode;
    }
    console.log('...path:', path);
    return path;
}

function getPathToPara(startNode) {
    console.log('getPathToPara([startNode])', startNode);
    var path = '';
    var i = 0;
    var node = startNode;
    console.log('nodeType:', nodeType);
    while (!node.className || !node.className.match(/paraId-/)) {
        i = getNodeIndex(node);
        path = i + (path.length ? '.' : '') + path;
        node = node.parentNode;
    }
    console.log('PathToPara:', startNode, path);
}

function getParentPara_1(startNode) {
    var node = startNode;
    while (node && (!node.className || !node.className.match(/paraId-/))) {
        node = node.parentNode;
    }
    return (node && node.className.match(/paraId-/)) ? node : null;
}

function getParentPara_2(startNode) {
    var node = startNode;
    while (node && (!node.className || !node.className.match(/paraId-/))) {
        // if (node.matches && node.matches('.longAnswer')) {
        try {
            if (node.className.contains('longAnswer')) {
                node = node.querySelector('p');
            } else { node = node.parentNode; }
        } catch (error) {
            console.log('Error on node:', node);
            node = null;
        }
    }
    return (node && node.className.match(/paraId-/)) ? node : null;
}

function getParentPara(node) {
    if (node.nodeType == 1) { // Element Node
        if (node.className.match(/paraId-/)) return node;
        let sibling = node.previousElementSibling;
        while (sibling) {
            if (sibling.className.match(/paraId-/)) return sibling;
            sibling = sibling.previousElementSibling;
        }
    }
    if (node.parentElement) return getParentPara(node.parentElement);
}

function padStart(val, length, char) {
    char = char || '0';
    var str = '' + val;
    while (str.length < length) {
        str = char + str;
    }
    return str;
}

/** Generate a sortable code for a precise content location
 *  Book Code -page-para-char
 *  0000000BOM-0001-0001-0001
 */
function getPlaceCode(book, page, para, char) {
    book = book || ENV.curBook || '';
    page = page || ENV.curPage || '';
    para = para || ENV.selection.startPara || '';
    char = char || ENV.selection.startChar || '';
    return padStart(book, 10) + '-' +
        padStart(page, 4) + '-' +
        padStart(para, 4) + '-' +
        padStart(char, 4);
}

function split2D(str, rowD, colD) {
    if (!rowD) {
        rowD = ';';
    }
    if (!colD) {
        colD = ',';
    }
    ary = str.split(rowD);
    for (i = 0; i < ary.length; i++) {
        ary[i] = ary[i].split(colD);
    }
    return ary;
}

function getTextNodesIn(node, includeWhitespaceNodes) {
    var textNodes = [],
        whitespace = /^\s*$/;

    function getTextNodes(node) {
        if (node.nodeType == 3) {
            if (includeWhitespaceNodes || !whitespace.test(node.nodeValue)) {
                textNodes.push(node);
            }
        } else {
            for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                getTextNodes(node.childNodes[i]);
            }
        }
    }

    getTextNodes(node);
    return textNodes;
}

function getChildIndex(childElm) {
    var sibs = childElm.parentElement.children;
    return Array.prototype.indexOf.call(sibs, childElm);
}

function openFullscreen(elm) {
    elm = elm || document.documentElement;
    if (elm.requestFullscreen) {
        elm.requestFullscreen();
    } else if (elm.webkitRequestFullscreen) { /* Safari */
        elm.webkitRequestFullscreen();
    } else if (elm.msRequestFullscreen) { /* IE11 */
        elm.msRequestFullscreen();
    }
}

function closeFullscreen() {
    if (document.fullscreenElement) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
    }
}

function isFullscreen() {
    return (document.fullscreenElement != null);
}

async function getNewElement(sel) {
    console.log('getNewElement(' + sel + ')');
    return new Promise(async(resolve) => {
        var elm = document.querySelector(sel);
        while (!elm) {
            await pause(100);
            elm = document.querySelector(sel);
            console.log(elm);
        }
        resolve(elm);
    })
}

async function fetchJson(url) {
    return await fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('FetchJson problem');
            return response.json();
        })
        .catch(e => {
            console.log('fetchJson Error:', e);
            return;
        });
    // .then(function(response) { return response.text(); })
    // .then(function(response) { return JSON.parse(response); });
}

function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("myTable2");
    switching = true;
    dir = "asc";
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

function camelToSentence(camelStr) {
    var sentence = camelStr.replace(/([A-Z])/g, " $1");
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
    return sentence;
}

function setSelect(select, val) {
    console.log('setSelect(', select, val, ')');
    select.value = val;
}

function getFormData(frm) {
    let data = {};
    let [...fields] = frm.querySelectorAll('input, textarea, select');
    fields.map(fld => {
        data[fld.id] = fld.value;
    })
    return data;
}