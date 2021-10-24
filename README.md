### what?

a google chrome extension that finds the track info for a song played at the https://www.fip.fr/ radio and adds it to your spotify playlist

### why?

This project has two purposes:

1. learning - a first attempt of creating a google chrome extension
2. convenience - makes it easier to add songs played at the https://www.fip.fr/ radio to your own spotify playlist

### how?

as the extension is intended for personal use only, i find it sufficient to supply the spotify client id from a .env file in the root directory (although it ultimately exposes it in the build file)

1.  run `npm run build`
2.  `REACT_APP_REDIRECT_URI` in google chrome: go to extensions, load unpacked, select your newly created `build` directory, take note of the chromium url
3.  `REACT_APP_CLIENT_ID` - sign in to your spotify developer dashboard, create an app
4.  `REACT_APP_PLAYLIST_ID` find the id of the playlist to which you want to add the songs

### and then?

opening the extension and clicking the Sign in button initiates an authentication (Oauth PKCE) flow that requires you to sign in to Spotify\
once completed, play some tunes at https://www.fip.fr/, get the track info, and add it to your playlist

### ...and then?

this is a very raw version. perhaps more to come.
