# Title bar
Toggle with `CMD+/` for a frameless window. 

# Windows
Windows can float on top of all others. `CMD+ALT+M` allows to enter window dimensions. Holding `ALT` allows to drag windows around.

# Filters
Webview can be inverted (`CMD+I`) or put in grayscale (`CMD+G`).

# Search Dictionary
`CMD+L` brings up the omnibox. The search dictionary allows to search directly for wikipedia articles, images, dev docs, etc. The dictionary is entirely customizable, so you can add your own.

# Devtools
`CMD+ALT+I` for Chrome devtools.

# Mini Console
Bring up with `CMD+ALT+C`. Only displays the last message (for now). Supports javascript execution in the web page.

# Notifications
Show rough loading times and loading state. Recording mutes notifications.

# Picture in Picture
Ōryōki fullscreens in the window (not the screen) by default. This option can be changed in preferences.

# Preferences
For default interface state, behavior and paths options. Preferences are stored in a json file and can be reset to factory settings.

# Screen Grab
Save to downloads with `CMD+~`. `CMD+SHIFT+C` to copy to clipboard.

# Metadata
Ōryōki saves the source url and title of a website in the PNG's tEXt chunks. Saved screen grabs can be opened (`CMD+O`) or dropped on the omnibox to revisit the website captured.

# Video Recording
Experimental. Requires ffmpeg for encoding. Supports `prores` and `mp4` quality preferences. Ōryōki looks for ffmpeg in /usr/local/bin.

# Web plugins
Web plugins allow to execute bits of local js on a specific domain name when visiting it. You can set a custom path (like `./js`) for the plugins in the preferences.

# Updates
Ōryōki will ping you when an update is available. Updates can be downloaded in the background. One just need to replace the .app once the update is downloaded.