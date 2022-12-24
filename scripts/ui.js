console.log('ui.js loaded...');
var UI = {

    init: function() {
        var html = '';
        var cd = document.querySelector('#customDialog');
        if (!cd) {
            html += '<div id="customDialog" class="shield">';
            // html += '  <div class="cdBox">';
            // html += '    <div class="cdTitle"></div>';
            // html += '    <form id="cdForm">';
            // html += '      <div class="cdBody">';
            // html += '        <input id="cdInput" type="text">';
            // html += '      </div>';
            // html += '      <div class="cdButtons">';
            // html += '        <button id="cdOk" class="systemBtn">OK</button>';
            // html += '        <button id="cdCancel" class="systemBtn">Cancel</button>';
            // html += '      </div>';
            // html += '    </form>';
            // html += '  </div>';
            html += '</div>';
            document.body.insertAdjacentHTML('beforeend', html);
        }
    },

    prompt: async function(message, defaultValue) {
        console.log('prompt(' + message + ', ' + defaultValue + ')');
        return new Promise(async(resolve) => {
            var cd = document.querySelector('#customDialog');
            var html = '';
            html += '  <div class="cdBox">';
            html += '    <div class="cdTitle">' + message + '</div>';
            html += '    <form id="cdForm">';
            html += '      <div class="cdBody">';
            html += '        <input id="cdInput" type="text" value="' + defaultValue + '">';
            html += '      </div>';
            html += '      <div class="cdButtons">';
            html += '        <button class="primary systemBtn" id="cdOk">OK</button>';
            html += '        <button class="secondary systemBtn" id="cdCancel">Cancel</button>';
            html += '      </div>';
            html += '    </form>';
            html += '  </div>';
            cd.innerHTML = html;

            // var cdTitle = cd.querySelector('.cdTitle');
            // cdTitle.innerHTML = message;

            // var input = cd.querySelector('#cdInput');
            // input.value = defaultValue;

            // var ok = cd.querySelector('#cdOk');
            var ok = await getNewElement('#cdOk');
            ok.onclick = () => {
                var cd = document.querySelector('#customDialog');
                var input = cd.querySelector('#cdInput');
                cd.classList.remove('active');
                cd.innerHTML = '';
                resolve(input.value);
            }

            var cancel = cd.querySelector('#cdCancel');
            cancel.onclick = () => {
                var cd = document.querySelector('#customDialog');
                cd.classList.remove('active');
                cd.innerHTML = '';
                resolve('');
            }

            cd.classList.add('active');
            var input = cd.querySelector('#cdInput');
            input.focus();
            input.select();
        });
    },

    confirm: async function(message) {
        console.log('confirm(' + message + ')');
        return new Promise(async(resolve) => {
            var cd = document.querySelector('#customDialog');
            var html = '';
            html += '  <div class="cdBox">';
            html += '    <div class="cdTitle">' + message + '</div>';
            html += '    <form id="cdForm">';
            html += '      <div class="cdButtons">';
            html += '        <button class="primary systemBtn" id="cdOk">OK</button>';
            html += '        <button class="secondary systemBtn" id="cdCancel">Cancel</button>';
            html += '      </div>';
            html += '    </form>';
            html += '  </div>';
            cd.innerHTML = html;

            var ok = await getNewElement('#cdOk');
            ok.onclick = () => {
                var cd = document.querySelector('#customDialog');
                cd.classList.remove('active');
                cd.innerHTML = '';
                resolve(true);
            }

            var cancel = cd.querySelector('#cdCancel');
            cancel.onclick = () => {
                var cd = document.querySelector('#customDialog');
                cd.classList.remove('active');
                cd.innerHTML = '';
                resolve(false);
            }

            cd.classList.add('active');
        });
    },

    // (AKA Snackbar, Toast)
    toast: function(message, options = {}) {
        var box = document.getElementById('toast');
        var duration = options.duration ? options.duration : 5000;
        var position = options.position ? options.position : 'top';
        if (!box) {
            var html = "<div id='toast'></div>";
            document.body.insertAdjacentHTML("beforeend", html);
            box = document.getElementById('toast');
        }
        box.innerText = message;
        box.classList.add('active');
        if (options.warning) box.classList.add('warning');
        if (position == 'bottom') { box.classList.add('bottom'); } else { box.classList.remove('bottom'); }
        setTimeout(function() {
            box = document.getElementById('toast');
            box.classList.remove('active', 'warning');
        }, duration);
    },

    warn: function(message, options = {}) {
        console.log('UI.warn()');
        options.warning = true;
        this.toast(message, options);
    },

    showProgress: function(val, title, detail) {
        var cd = document.getElementById('customDialog');
        cd.classList.add('active');
        var progressShell = cd.querySelector('.progressShell');
        if (!progressShell) {
            var html = '';
            html += '  <div class="cdBox">';
            html += '    <div class="cdTitle">' + title + '</div>';
            html += '      <div class="progressValue">' + val + '%</div>';
            html += '    <div class="progressShell">';
            html += '      <div class="progressBar" style="width:' + val + '%">&nbsp;</div>';
            html += '    </div>';
            html += '    <div class="progressDetail">' + detail + '</div>';
            html += '  </div>';
            cd.innerHTML = html;
        } else {
            cd.querySelector('#customDialog .progressBar').style.width = val + '%';
            cd.querySelector('#customDialog .progressValue').innerHTML = val + '%';
            cd.querySelector('#customDialog .progressDetail').innerHTML = detail;
        }
        if (val >= 100) {
            cd.classList.remove('active');
            cd.innerHTML = '';
        }
    },

    overlay: function(title, bodyHtml) {
        console.log('UI.overlay(' + title + ', [bodyHtml string])');
        var cd = document.querySelector('#customDialog');
        var html = '';
        html += '<div class="overlayContent">';
        // html += '  <div class="bar surface">';
        // html += '    <div class="colContainer">';
        // html += '      <div class="barLabel">' + title + '</div>';
        // html += '      <button id="btnOverlayClose" class="button icon-close" aria-label="Close Overlay"></button>';
        // html += '    </div>';
        // html += '  </div>';
        html += '  <div>{{bodyHtml}}</div>';
        html += '</div>';
        cd.innerHTML = html.replace('{{bodyHtml}}', bodyHtml);
        cd.classList.add('active');
    },

    dialog: async function(title, bodyHtml) {
        console.log('dialog(' + title + ', [html string])');
        return new Promise(async(resolve) => {
            var cd = document.querySelector('#customDialog');
            var html = '';
            html += '<form id="cdForm">';
            html += '  <div class="cdBox">';
            html += '    <div class="cdTitle">' + title + '</div>';
            html += '    <div class="cdBody">' + bodyHtml + '</div>';
            html += '    <div class="cdButtons">';
            html += '        <button class="primary systemBtn" id="cdOk">OK</button>';
            html += '        <button class="secondary systemBtn" id="cdCancel">Cancel</button>';
            html += '    </div>';
            html += '  </div>';
            html += '</form>';
            cd.innerHTML = html;

            var ok = await getNewElement('#cdOk');
            ok.onclick = () => {
                var cd = document.querySelector('#customDialog');
                var cdForm = cd.querySelector('#cdForm');
                var response = {};
                var frmElms = cd.querySelectorAll('input, select, textarea');
                for (var i = 0; i < frmElms.length; i++) {
                    response[frmElms[i].id] = frmElms[i].value;
                }
                cd.classList.remove('active');
                cd.innerHTML = '';
                resolve(response);
            }

            var cancel = cd.querySelector('#cdCancel');
            cancel.onclick = () => {
                var cd = document.querySelector('#customDialog');
                cd.classList.remove('active');
                cd.innerHTML = '';
                resolve(false);
            }

            cd.classList.add('active');
            cdForm.elements[0].focus();
        });
    },

    closeDialog: function() {
        var cd = document.querySelector('#customDialog');
        cd.classList.remove('active');
    }

};

window.addEventListener('DOMContentLoaded', UI.init);