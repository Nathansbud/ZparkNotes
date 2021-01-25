import React, {useState, useEffect} from 'react'
import Papa from 'papaparse'

import './App.css'

type ZparkNote = {
    text: string,
    book: string,
    author: string,
    date: Date,
    page: number | null
}
type ZparkView = 'card' | 'list' | 'log'

type NoteProps = {note: ZparkNote}
const NoteCard = ({note: {text, book, author, date, page, ...props}}: NoteProps) => {
    
    return (<div className='card'>
        <h2>{text}</h2>
        <h3>&mdash; <b>{book}</b> ({author}), {page}</h3>
    </div>)    
}

const LogoText = () => {
    return (
        <h1 className='title center'>
            <b>
                <sup className='asterisk'>*</sup>zpark
            </b>
            <span>notes</span>
        </h1>
    )
}
function App() {
    const sheetUrl = process.env.REACT_APP_ZPARKNOTES_SHEET_URL    
    const [zparkNotes, setZparkNotes] = useState<ZparkNote[]>([])
    const [loaded, setLoaded] = useState(false)
    const [failed, setFailed] = useState(false)
    const [zparkView, setView] = useState<ZparkView>('card')

    useEffect(() => {
        if(sheetUrl) {
            Papa.parse(sheetUrl, {
                download: true,
                step: (row) => {
                    const [date, text, book, author, page] = row.data as string[]
                    setZparkNotes((stored) => [...stored, {
                        text: text,
                        date: new Date(date),
                        book: book,
                        author: author,
                        page: parseInt(page)
                    } as ZparkNote])
                },
                complete: () => {
                  console.log("Finished loading Zparknotes!")
                },
                error: (e) => {
                    console.log("???")
                    // console.log(e)
                }
            })
            console.log(zparkNotes)
        } else {
            console.error("No sheet URL specified as an environment variable!")
        }
    }, [])
    
    if(zparkNotes.length == 0) {
        return (<>
            <LogoText/>
        </>)
    } else if(!failed) {
        switch(zparkView) {
            case 'card':
                if(zparkNotes) {
                    console.log(zparkNotes)
                    return (<>
                        <LogoText/>
                        <NoteCard note={zparkNotes[0]}/>
                    </>)
                }
                return <h1>yeet</h1>
            case 'list':
                const noteElems = zparkNotes.map((zn, i) => (<li key={i}>{zn.text}</li>))
                return (<>
                    <LogoText/>
                    <ul>
                        {noteElems}
                    </ul>            
                </>)
            default:
                return (<LogoText/>)
        }
    } else {
        return (<>
            <LogoText/>
            <p>Failed to load lmaooo</p>
        </>)
    }
}

export default App;