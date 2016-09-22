# Title bar
Can be hidden with `CMD+/` for a frameless window. 

# Windows
Windows can float on top of all others. `CMD+ALT+M` allows to enter window dimensions. Holding `ALT` allows to drag windows around.

# Preferences
For default interface state and a couple options. Preferences are stored in a json file and can be reset to factory settings.

# Omnibox
`CMD+L` bring up the omnibox. It serves as the URL and search bar. The search dictionary `Oryoki > Search Dictionary...` allows to search directly for wikipedia articles, images, dev docs, etc. The dictionary is entirely customizable, so you add your own.

# Devtools
`CMD+ALT+I` for standard Chrome devtools.

# Mini Console
Bring up with `CMD+ALT+C`. Only displays the last message (for now). Supports javascript execution in the web page.

# Screen Grab
Save to downloads with `CMD+~`. `CMD+SHIFT+C` to copy to clipboard.

# Video Recording
Experimental. Requires ffmpeg for encoding. Supports `prores` and `mp4` quality preferences. Ōryōki looks for ffmpeg in /usr/local/bin.

# Notifications
Show rough loading times and loading state. Recording mutes notifications.

# Web plugins
Web plugins allow to execute bits of local js on a specific domain name when visiting it. Web plugins are by default located in `Application Support/Oryoki/Web Plugins` but you can set a custom path (like `./js`) in the preferences.