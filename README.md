## ZparkNotes

Quick tool to upload Kindle text clippings to a Google Sheet on sync

## Setup

1. Place a Google Sheets credentials file named ```sheets.json``` (easily obtainable [here](https://developers.google.com/sheets/api/quickstart/python)) in the ```credentials/``` folder
2. Add the Sheet ID for your notes to the ```config.json``` file (this must be a Sheet that you have edit rights to) as well as the Kindle path (only necessary if the Kindle has been renamed)
3. Add [this plist](https://github.com/Nathansbud/LaunchdNonsense/blob/master/com.nathansbud.zparknotes.plist) to the user LaunchAgents folder ($USER/Library/LaunchAgents/)
3. Edit the plist to reference the ```monitor.py``` file and the relevant Python environment at run-time

