# Auto Suggest
An app to assist choosing wisely by suggesting predetermined options

## Description

* index.html - The app shell; structures the left drawer, center panel, right drawer, and bottom drawer
* serviceWorker.js - Caches all app files on-install so it can function offline; mediates all fetch requests and returns the file from cache if available, or retrieves and caches from network if not.
* appdata.js - Lists all app files to be cached by the service worker 
* index.js - Manages app functions, drawers, and panels in conjunction with panel- and feature-specific modules
* database.js - Manages client storage for offline functionality and fast performance. (see Chrome > Dev Tools > Application > IndexedDb)

## Data Structure
* Suggestions
    * label
    * options
        * label 
* Options
* Events
