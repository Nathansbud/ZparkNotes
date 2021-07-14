import {useState, useEffect} from 'react'
import Papa from 'papaparse'

import useKeyPress from './hooks/useKeyPress'
import './App.css'

type ZparkNote = {
    text: string,
    book: string,
    author: string,
    date: Date,
    page: number
}
type ZparkView = 'card' | 'list' | 'log'

type NoteProps = {note: ZparkNote}
const NoteCard = ({note: {text, book, author, date, page, ...props}}: NoteProps) => {    
    return (<div className='card'>
        <h2>{text[0].toUpperCase() + text.slice(1)}</h2>
        <h3>&mdash; <b>{book}</b> ({author}){!isNaN(page) && `, ${page}`}</h3>
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
    
    const [currentIdx, setCurrentIdx] = useState(0)
    const [seenIdxs, setSeenIdxs] = useState<number[]>([])

    const [failed, setFailed] = useState(false)
    const [zparkView] = useState<ZparkView>('card')
    
    const spacePressed = useKeyPress(' ')
    
    useEffect(() => { 
        if (spacePressed && zparkNotes.length > 0) {
            if (seenIdxs.length + 1 === zparkNotes.length) {
                setSeenIdxs([])
            } else {
                const validKeys = [...Array(zparkNotes.length).keys()].filter(
                    (idx) => !(idx === currentIdx) && !seenIdxs.includes(idx) 
                )
                
                setSeenIdxs(seenIdxs.concat(currentIdx))
                setCurrentIdx(validKeys[Math.floor(Math.random() * validKeys.length)])
            }
        }

        if(sheetUrl && zparkNotes.length === 0) {
            Papa.parse(sheetUrl, {
                download: true,
                complete: (parseResult) => {
                    const rows = parseResult.data.map(
                        (row) => {
                            const [date, text, book, author, page] = row as string[]
                            return {
                                text: text,
                                date: new Date(date),
                                book: book,
                                author: author,
                                page: parseInt(page)
                            }
                        }
                    )
                    
                    setCurrentIdx(Math.floor(Math.random() * rows.length))
                    setZparkNotes(rows)
                }            
            })
        } else if(!sheetUrl) {
            console.error("No sheet URL specified as an environment variable!")
            setFailed(true)
        }
    }, [sheetUrl, zparkNotes, spacePressed])
    
    if(zparkNotes.length === 0) {
        return (<>
            <LogoText/>
        </>)
    } else if(!failed) {
        switch(zparkView) {
            case 'card':
                if(zparkNotes) {
                    return (<>
                        <LogoText/>
                        <NoteCard note={zparkNotes[currentIdx]} />
                    </>)
                }
                return <h1>Loading quotes...</h1>
            case 'list':
                return (<>
                    <LogoText/>
                    <ul>
                        {zparkNotes.map((zn, i) => (<li key={i}>{zn.text}</li>))}
                    </ul>            
                </>)
            default:
                return (<LogoText/>)
        }
    } else {
        return (<>
            <LogoText/>
            <p>Failed to load quotes!</p>
        </>)
    }
}

export default App;