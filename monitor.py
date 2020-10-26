import os
import asyncio
from datetime import datetime, timedelta


from upload import sheets

kindle_path = "/Volumes/Kindle/documents/"
delim = "==========\n"
sheet_id = "1SYhTC_rsnhazrShXLLcgx30XQN3VsTgPNEtuaMtppyU"

class Clipping:
    def __init__(self, title, author, content, added, page=None):
        self.title = title
        self.author = author
        self.page = page
        self.added = added
        self.content = content

def build_clipping(entry):
    attribution, location, *content = entry
    
    title = attribution[:attribution.rfind('(')-1].strip()
    author = attribution[attribution.rfind('(')+1:attribution.rfind(')')].strip()

    page = None
    if 'Highlight on' in location or 'Bookmark on' in location:
        page, loc, added = location.split('|')
        page = page[page.find('Page ') + len('Page '):]
    else:
        loc, added = location.split('|')
    
    added = added[added.find('Added on ') + len('Added on '):]
    added_date = datetime.strptime(added, '%A, %B %d, %Y, %I:%M %p') #idrc about leap years
    return Clipping(title, author, "\n".join(content), added_date, page) if content else None 
    
def update_clippings():
    clipping_path = os.path.join(kindle_path, "My Clippings.txt")
    backup_path = os.path.join(os.path.dirname(__file__), "backups")
    if os.path.isfile(clipping_path):
        with open(clipping_path, encoding='utf-8-sig') as cf:
            lines = cf.readlines()

            content = "".join(lines)
            clippings = [v for c in content.split(delim) if c and (v := build_clipping(filter(None, c.strip().split('\n'))))]

        try:
            sheets.spreadsheets().values().append(
                spreadsheetId=sheet_id,
                range="Quotes!A:A",
                valueInputOption="RAW",
                body={
                    "values": [[str(v.added), v.content, v.title, v.author, v.page] for v in clippings],
                    "majorDimension": "ROWS"
                }
            ).execute()
            open(clipping_path, 'w', encoding='utf-8-sig').close()

        except Exception as e:
            with open(os.path.join(backup_path, f"backup-{datetime.now()}"), 'w+') as backup:
                backup.writelines(lines)
    else:
        print("Not the Kindle!")
            

        
if __name__ == "__main__":
    update_clippings()
