#General

##what?

a google chrome extension that finds the track info for a song played at the https://www.fip.fr/ radio and adds it to your spotify playlist

##why?

This project has two purposes:

1. learning - a first attempt of creating a google chrome extension
2. convenience - makes it easier to add songs played at the https://www.fip.fr/ radio to your own spotify playlist

##how?

as the extension is intended for personal use only, i find it sufficient to supply the spotify client ids from a .env file (and ultimately exposing it in the build file)

1. run `npm run build`
2. in google chrome: go to extensions, load unpacked, select your newly created `build` directory, take note of the chromium url
3. sign in to your spotify developer dashboard, create an app, take note of the app client id.
4. find the id of the playlist to which you want to add the songs
5. create an .env file with the following fields:

`REACT_APP_CLIENT_ID`
`REACT_APP_PLAYLIST_ID`
`REACT_APP_REDIRECT_URI`
