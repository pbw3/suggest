console.log('suggestions.js loaded...');

const Suggestions = (() => {
    console.log('running');

    async function displayAll() {
        console.log('displayAll()');
        var suggestions = await Database.getAll('suggestions');
        let html = '';
        suggestions.map(sug => {
            html += '<a href="#' + sug.date + '" class="menuItem">' + sug.label + '</a>';
        });
        let mainMenu = document.querySelector('#mainMenu');
        console.log(html);
        mainMenu.innerHTML = html;
    }

    async function displayForm(id = null) {
        console.log('displayForm(' + id + ')');
        var sug = id ? await Database.get('suggestions', id) :
            { date: 0, label: '', image: '', options: [], time: '', recurUnit: '', recurValue: 0 };
        var html = await fetch('views/suggestion.html').then(res => res.text());
        html = ejs.render(html, sug);
        let mainContent = document.querySelector('#mainContent');
        mainContent.innerHTML = html;
        ENV.curSug = sug;
    }

    async function create(obj) {
        obj = obj || {
            label: 'Test Item',
            image: '',
            options: ['one', 'two', 'three'],
            time: '',
            recurUnit: 'minutes', // minutes|hours|days|weeks|months|years
            recurValue: 5,
        };
        var nowStr = new Date().valueOf(); // 1671748836982
        obj.date = nowStr;
        await Database.add('suggestions', obj);
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
            time: data.time || ENV.curSug.time || '',
            recurUnit: data.recurUnit || ENV.curSug.recurUnit || '',
            recurValue: data.recurValue || ENV.curSug.recurValue || 0,
        };
        var sugId = await Database.put('suggestions', sug);
        displayAll();
        return sugId;
    }


    return { displayAll, displayForm, create, save };
})();