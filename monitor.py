import os
from datetime import datetime, timedelta

kindle_path = "/Volumes/Kindle/documents/"
delim = "==========\n"

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
    print(location)
    
    page = None
    if 'Highlight on' in location or 'Bookmark on' in location:
        page, loc, added = location.split('|')
        page = page[page.find('Page ') + len('Page '):]
    else:
        loc, added = location.split('|')
    
    added = added[added.find('Added on ') + len('Added on '):]
    added_date = datetime.strptime(added, '%A, %B %d, %Y, %I:%M %p') + timedelta(days=365*3) #idrc about leap years
    return Clipping(title, author, content, added_date, page) if content else None 
    
with open(os.path.join(kindle_path, "My Clippings.txt"), encoding='utf-8-sig') as cf:
    content = "".join(cf.readlines())
    clippings = [v for c in content.split(delim) if c and (v := build_clipping(filter(None, c.strip().split('\n'))))]
    





