console.log('appData.js loaded...');

var AD = {};

AD.version = "1.2022-12-24 11:32:13"; // Ctrl + Shift + I
AD.cacheName = "Suggest-Cache-1";
AD.dbName = "Suggest-DB-1";

AD.appFiles = [
    '/',
    'favicon.ico',
    'images/banners/calling.jpg',
    'images/icons/icon-120x120.png',
    'images/icons/icon-180x180.png',
    'images/icons/icon-192x192.png',
    'images/icons/icon-256x256.png',
    'images/icons/icon-384x384.png',
    'images/icons/icon-512x512.png',
    'images/sounds/Alarm Dawn.mp3',
    'index.html',
    'manifest.json',
    'scripts/appData.js',
    'scripts/database.js',
    'scripts/ejs.js',
    'scripts/index.js',
    'scripts/listener.js',
    'scripts/suggestions.js',
    'scripts/timer.js',
    'scripts/utilities.js',
    'styles/icon.css',
    'styles/icon.woff',
    'styles/style.css',
    'views/shell.html',
    'views/suggestion.html',
];

AD.nonCacheFiles = [
    // 'updater.html',
];

// Useful cmd command to collect and update files:
// dir /b       (and /s to include subdirectories)
AD.checkAppFiles = async function() {
    for (var i = 0; i < AD.appFiles.length; i++) {
        console.log(i, AD.appFiles[i]);
        await fetch(AD.appFiles[i]);
    }
}

AD.test = function() {
    var response = AD.nonCacheFiles.includes('content/catalog.json');
    console.log(response);
}