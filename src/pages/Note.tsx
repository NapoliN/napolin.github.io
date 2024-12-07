import React from 'react'
import { Container } from "react-bootstrap"
import { Link } from 'react-router-dom'

export interface NoteProps {
    title: string,
    tags?: string[],
    date?: string,
    content: string,
}

export const Note: React.FC<{ notes: NoteProps[] }> = (props) => {
    return (
        <Container>
            <h1>目次</h1>
            { props.notes.map((note, index) => { 
                return (
                    <div key={index}>
                        <li><Link to={`./${note.title}`}>{note.title}</Link></li>
                    </div>
                ) 
            })}

        </Container>
    )
}
