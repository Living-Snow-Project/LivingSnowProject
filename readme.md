Thanks for considering to contribute to Living Snow Project App!

The app is written in React-Native then built and tested through Expo using its 'managed workflow'. To get started, go to https://expo.io/learn. Follow steps 2 & 3 to make sure you have an Expo environment.

The backend of the app is hosted in Azure and uses an App Service and SQL.

If you'd like to contribute, here's some ideas of features and improvements we'd like to make. They are in no particular order. If you decide you want to implement something, let us know through kodnerlab@gmail.com, to minimize duplicating work.

 - Smaller changes, features, bug fixes, and improvements -

1. Getting Started\First Run Experience screen - make it look better
2. A notification when saved records are uploaded (records are saved when they fail to upload, many times we take samples in remote areas with no data connection)
3. Some indication around how many saved records exist
4. A separate screen to see the saved records
5. A way to edit saved records
6. A "What's New" screen\modal box for whenever we release a new version of the app
7. Add a timeout\connection test when refreshing the timeline of records (currently spins infinitely when no there's data connection)
8. Add a screen that drills in to a record
9. Ability to create a way point GPX file for a record and link it to other programs (ie. Gaia GPS, Email)
10. Switch focus to the next input box (in Getting Started, Settings, and Record screens)
11. Add multi-line input boxes in the Record Screen
12. Improve the keyboard avoiding view experience (flaky when moving to other input boxes and keyboard still open)
13. Make the Settings options look more Platform specific
14. Filtering displayed records (ie. date, name, location, etc)
15. General UI and graphic design improvements
16. Activity spiny when looking for GPS Signal

 - Bigger changes -

1. Pictures - selection, upload, thumbnail, download, caching (requires service work)
2. Push notifications (ie. new records received, research team messaging)
3a. Saving sync'd records (requires service work) and only request for new records
3b. Detecting when a record is deleted and removes it from list of saved records
4. Stats screen with charts (ie. number of records\samples, leaderboard by person\organization, etc)
5. Integration with a mapping\GIS technology
6. Chaining - append additional records to an initial record to better track the progression of a bloom (requires service work)
7. Automated tests