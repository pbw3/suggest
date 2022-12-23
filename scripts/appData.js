console.log('appData.js loaded...');

var AD = {};

AD.version = "0.2022-12-22 07:57:53"; // POC 1.2022-04-20 09:33:58, 1.2022-04-14 18:24:36
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
    'images/sounds/*.aac',
    'index.html',
    'manifest.json',
    'scripts/appData.js',
    'scripts/database.js',
    'scripts/index.js',
    'scripts/listener.js',
    'scripts/utilities.js',
    'styles/icon.css',
    'styles/icon.woff',
    'styles/style.css',
    'views/shell.html',
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