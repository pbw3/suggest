# Auto Suggest
An app to assist choosing wisely by suggesting predetermined options. The app works like an alarm, by displaying suggestions at scheduled recurring times. Each suggestion may include multiple options. The suggested option is rotated each time the suggestion is displayed.

## Live Demo
https://stitch-unruly-clerk.glitch.me/

## Examples
* Suggestion: Eat Breakfast
    * Recurrence: Daily at 7:00 AM. 
    * Suggested options:
        * Waffles with Fruit
        * Smoothie and Toast
        * Natto with Green Onions
* Suggestion: Record sleep quality
    * Recurrence: Daily at 7:00 AM.

## File Descriptions
* index.html - The app shell; structures the left drawer, center panel, right drawer, and bottom drawer
* serviceWorker.js - Caches all app files on-install so it can function offline; mediates all fetch requests and returns the file from cache if available, or retrieves and caches from network if not.
* appdata.js - Lists all app files to be cached by the service worker 
* index.js - Manages app functions, drawers, and panels in conjunction with panel- and feature-specific modules
* database.js - Manages client storage for offline functionality and fast performance. (see Chrome > Dev Tools > Application > IndexedDb)

## Data Structure
* Suggestions
    * date (integer, primary key)
    * label (string)
    * image (string)
    * options (string array)
    * time (string, hh:mm)
    * recurUnit (enum [minutes|hours|days|weeks|monhts|years])
    * recurValue (integer)
* Events

## Developent Ideas
* add an image field to suggestion
* track the result of each suggestion
    * change suggestion dialog buttons: Accept, Reject, Skip, Ignore
    * add an events table { datetime, suggestionId, option, result }
* allow value or score tracking as well as accept/reject kinds of results
    * add a Note field to the suggestion dialog, allowing score tracking
* turn options into an object array with a label and image for each option
* add a frequency index to each option if you want some to appear more frequently