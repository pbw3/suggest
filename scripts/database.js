console.log('database.js loaded...');

var Database = {

    /** Database object structures with sample values and formats 
     * Updated 8/20/21. Use console command to see last values:
     * > await Database.getLast('[bookmarks | notes | recents | etc.]')
     */
    samples: {
        suggestions: [{
            date: 1671748836982,
            label: 'Test Item',
            image: '',
            options: ['one', 'two', 'three'],
            time: '',
            recurUnit: 'minutes', // minutes|hours|days|weeks|months|years
            recurValue: 5,
        }]
    },

    /** Open the IndexedDB; create object stores if the Database is new or upgraded
     */
    init: async function() {
        console.log('Database.init()');
        await new Promise((resolve) => {
            var request;
            window.indexedDB = window.indexedDB || window.mozIndexedDB ||
                window.webkitIndexedDB || window.msIndexedDB;
            window.IDBTransaction = window.IDBTransaction ||
                window.webkitIDBTransaction || window.msIDBTransaction;
            window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange ||
                window.msIDBKeyRange
            if (!window.indexedDB) throw "The browser doesn't support IndexedDB.";

            request = window.indexedDB.open(AD.dbName, 5);
            request.onerror = function(event) {
                throw ("Database.open error. ");
            }
            request.onsuccess = function(event) {
                Database.db = request.result;
                console.log("Database.open success. ");
                resolve();
            }
            request.onupgradeneeded = function(event) {
                var objectStore;
                Database.db = event.target.result;
                var storeNames = Database.db.objectStoreNames;
                // Create Stores
                if (!storeNames.contains('suggestions'))
                    Database.db.createObjectStore("suggestions", { keyPath: "date" });
                // Delete Old Stores
                // if (storeNames.contains('actions')) Database.db.deleteObjectStore("actions");
            }
        });
    },

    /** Create a new record in the specified object store; see Database.samples for structure
     * @param {string} storeName - name of the object store
     * @param {object} recordObj - object to be stored
     * @returns {object} newly created record
     */
    add: async function(storeName, recordObj) {
        console.log('Database.add(' + storeName + ', obj...)');
        return new Promise((resolve) => {
            var request = Database.db.transaction([storeName], "readwrite")
                .objectStore(storeName)
                .add(recordObj);
            request.onerror = function(event) {
                throw ("Database.add failure. Unable to add data.");
            }
            request.onsuccess = function(event) {
                console.log("Database.add success. Record has been added.");
                resolve(event.target.result);
            }
        });
    },

    /** Return the record from the specified object store with the specified key value
     * @param {string} storeName - name of the object store to search
     * @param {string} keyValue - record's unique identifier
     * @returns {object} requested record
     */
    get: async function(storeName, keyValue) {
        console.log('Database.get(' + storeName + ',' + keyValue + ')');
        var request;
        return new Promise((resolve) => {
            request = Database.db.transaction([storeName], "readonly")
                .objectStore(storeName)
                .get(keyValue);
            request.onerror = function(event) {
                reject(event);
                throw ("Database.get error.");
            }
            request.onsuccess = function(event) {
                resolve(event.target.result);
            }
        });
    },

    /** Return the last record created in the specified object
     * @param {string} storeName - name of the object store to search
     * @returns {object} requested record
     */
    getLast: async function(storeName) {
        console.log('Database.getLast(' + storeName + ')');
        var request;
        return new Promise((resolve) => {
            request = Database.db.transaction([storeName], "readonly")
                .objectStore(storeName)
                .openCursor(null, 'prev');
            request.onerror = function(event) {
                reject(event);
                throw ("Database.getLast error.");
            }
            request.onsuccess = function(event) {
                let res = event.target.result ? event.target.result.value : '';
                return resolve(res);
            }
        });
    },

    /** Return the records just before the specified anchor record
     * @param {string} storeName - name of the object store
     * @param {string} anchorId - ID of the record after the deisred record
     * @param {number} count - the number of records to return
     * @returns {object} requested records
     */
    getPrevious: async function(storeName, anchorId, count) {
        console.log('Database.getPrevious(' + storeName + ',' + anchorId + ')' + count + ')');
        var request;
        return new Promise((resolve) => {
            request = Database.db.transaction([storeName], "readonly")
                .objectStore(storeName)
                // Todo can't figure out this query. looking for last item just before anchorId
                // but it's currently returning the first item (of many) that come before anchorId
                .getAll(IDBKeyRange.upperBound(anchorId), count);
            // .getAll(IDBKeyRange.lowerBound(anchorId, true), count);
            request.onerror = function(event) {
                reject(event);
                throw ("Database.getLast error.");
            }
            request.onsuccess = function(event) {
                console.log(event);
                resolve(event.target.result.value);
            }
        });
    },

    /** Return all records from the specified object store
     * @param {string} storeName - name of the desired object store
     * @returns {object} all records in the object store
     */
    getAll: async function(storeName) {
        console.log('Database.getAll(' + storeName + ')');
        return new Promise((resolve, reject) => {
            request = Database.db.transaction(storeName, 'readonly')
                .objectStore(storeName)
                .getAll();
            request.onsuccess = function(event) {
                resolve(event.target.result);
            }
            request.onerror = function(event) {
                reject(event);
                throw ("Database.getAll error.");
            }
        });
    },

    /** Update the record in the specified object store where the specified key matches the value
     * @param {string} storeName - name of the object store to search
     * @param {string} keyField - name of the field to search
     * @param {string} keyValue - value to find in the key field
     * @param {object} recordObj - updated object to be stored
     * @returns {object} newly updated record
     */
    update: async function(storeName, keyField, keyValue, recordObj) {
        console.log('Database.update(' + storeName + ', ' + keyValue + ')');
        return new Promise((resolve, reject) => {
            var request = Database.db.transaction([storeName], "readwrite")
                .objectStore(storeName)
                .openCursor();
            request.onerror = function(event) {
                throw ("Database.openCursor failure.");
            }
            request.onsuccess = function(event) {
                var cursor = event.target.result;
                console.log('dbtransaction event: ', event);
                if (cursor) {
                    if (cursor.value[keyField] === keyValue) {
                        // console.log('Database.update.onsuccess.cursor:');
                        // console.log(cursor);
                        var request = cursor.update(recordObj);
                        request.onerror = function(event) {
                            reject(event);
                            throw ("Database.update failure.");
                        }
                        request.onsuccess = function(event) {
                            console.log('Database.update success.');
                            resolve(event.target.result);
                        }
                    }
                    cursor.continue();
                } else {
                    console.log('Database error. no cursor.');
                }
            }
        });
    },

    /** Update the record (with a matching key) or create a new one if it doesn't already exist
     * @param {string} storeName - name of the object store to search
     * @param {object} recordObj - updated or new object to be stored
     * @returns {object} newly updated or created record
     */
    put: async function(storeName, recordObj) {
        console.log('Database.put(' + storeName + ', recordObj...)');
        return new Promise((resolve, reject) => {
            var request = Database.db.transaction([storeName], "readwrite")
                .objectStore(storeName)
                .put(recordObj);
            request.onerror = function(event) {
                reject(event);
                throw ("Database.put failure.");
            }
            request.onsuccess = function(event) {
                console.log('Database.put success.');
                resolve(event.target.result);
            }
        });
    },

    /** Delete the record with the matching key value
     * @param {string} storeName - name of the object store to search
     * @param {string} keyValue - record's unique identifier
     * @returns {object} Database response event
     */
    delete: async function(storeName, keyValue) {
        console.log('Database.delete(' + storeName + ', ' + keyValue + ')');
        return new Promise((resolve, reject) => {
            var request = Database.db.transaction([storeName], "readwrite")
                .objectStore(storeName)
                .delete(keyValue);
            request.onerror = function(event) {
                throw ("Database.delete failure.");
                reject(event);
            }
            request.onsuccess = function(event) {
                console.log("Database.delete success.");
                resolve(event);
            }
        });
    },

    exportStore: async function(storeName) {
        console.log('Note.exportStore2(' + storeName + ')');
        var csvContent = 'data:text/csv;charset=utf-8,';
        var items = await Database.getAll(storeName);
        var rows = [];
        var i, k, keys;
        keys = Object.keys(items[0]);
        for (i in items) {
            rows[i] = [];
            for (k in keys) {
                let val = items[i][keys[k]];
                if (typeof val === 'object') val = JSON.stringify(val).replace(/"/g, ' ');
                if (!val) val = '';
                val = (val + '').replace(/#!/g, "");
                rows[i].push(val);
            }
        }
        rows.unshift(keys);
        csvContent += toCSV(rows);
        var encodedUri = encodeURI(csvContent);
        encodedUri = encodedUri.replace(/#/g, '%23');
        var link = document.createElement("a");
        link.href = encodedUri;
        link.target = '_blank';
        link.download = storeName + '.csv';
        document.body.appendChild(link); // Required for FF
        link.click();
    },

    exportStoreJSON: async function(storeName) {
        console.log('Database.exportStoreJSON()');
        var content = 'data:application/json,';
        var items = await Database.getAll(storeName);
        content += JSON.stringify(items);
        var encodedUri = encodeURI(content);
        encodedUri = encodedUri.replace(/#/g, '%23');
        var link = document.createElement("a");
        link.href = encodedUri;
        link.target = '_blank';
        link.download = "items.json";
        document.body.appendChild(link); // Required for FF
        link.click();
    },

    uploadNewItems: async function(storeName, sinceDate) {
        console.log('Database.uploadNewItems(' + storeName + ')');
        return new Promise(async(resolve) => {
            var items = await this.getAll(storeName);
            items = items.filter(item => {
                try {
                    return item.date > sinceDate;
                } catch (e) { console.log('Error filtering:', item, e); }
            });
            if (items.length > 0) {
                var postItem = {
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify({
                        "storeName": storeName,
                        "userId": ENV.curUser,
                        "items": items
                    })
                };
                var res = await fetch('../api/' + storeName, postItem)
                    .then(res => res.json())
                    .catch(e => { console.log('Database.uploadNewItems Error:', e); return; });
                ENV.uploadBytes += (JSON.stringify(postItem).length * 2); // estimate 2 bytes per character
                console.log('Uploaded:', res);
            }
            return resolve(res);
        });
    },

    downloadNewItems: async function(storeName, sinceDate) {
        console.log('Database.downloadNewItems(' + storeName + ')');
        return new Promise(async(resolve) => {
            var i = 0;
            var items = await fetch(
                    '../api/' + storeName +
                    '?u=' + ENV.curUser +
                    '&since=' + sinceDate)
                .then(response => {
                    if (!response.ok) return;
                    ENV.downloadBytes += (response.headers.get("content-length") * 1);
                    return response.json();
                })
                .catch(e => {
                    console.log('downloadNewItems.fetch Error:', e);
                    return;
                });
            if (!items) return;
            for (i in items) {
                delete items[i].eventId;
                Database.put(storeName, items[i])
            }
            console.log('Downloaded ' + i + ' ' + storeName);
            return resolve();
        });
    }


};