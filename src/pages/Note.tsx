import React from 'react'
import { Container } from "react-bootstrap"
import { Link } from 'react-router-dom'

export interface NoteProps {
    title: string,
    tags?: string[],
    date: string,
    content: string,
}

export const Note: React.FC<{ notes: NoteProps[] }> = (props) => {
    return (
        <Container>
            <h1>目次</h1>
            { props.notes.sort((a,b) => (new Date(b.date).getTime() - new Date(a.date).getTime())).map((note, index) => { 
                return (
                    <div key={index}>
                        <li><Link to={`./${note.title}`}>{note.title}</Link> ({ new Date(note.date).toDateString() })</li>
                    </div>
                ) 
            })}

        </Container>
    )
}
