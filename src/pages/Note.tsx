import React, { useEffect } from 'react'
import { Container } from "react-bootstrap"
import { Link } from 'react-router-dom'
import NoteList from "../assets/notes.json"

// ディレクトリ構造を表す型
interface DirectoryNode {
    type : string; //ファイルの型
    name : string; //ディレクトリ名またはファイル名
    children? : DirectoryNode[]; //ディレクトリのとき、その中身
    meta? : NoteMeta;
}

// 各ノートのメタ情報を表す型
interface NoteMeta {
    title: string,
    tags?: string[],
    date: string,
}

// @ts-ignore
const pages: DirectoryNode[] = NoteList

// directoryNodeを再帰的に展開してDOMを生成する関数
const expandDir = (currentPath: string[], dirTree: DirectoryNode[]) => {
    return dirTree.map((node) => {
        if (node.type === 'directory' && node.children) {
            return (
                <div key={node.name}>
                    <h2>{node.name}</h2>
                    <ul>
                        { expandDir([...currentPath, node.name], node.children) }
                    </ul>
                </div>    
            )
        } else if (node.type === 'file' && node.meta) {
            const pathParam = new URLSearchParams()
            currentPath.forEach(dir => {
                pathParam.append("path", dir);
            });
            pathParam.append("path", node.name);
            return (
                <div key={node.meta.title}>
                    <li><Link to={`../articles?${pathParam.toString()}`}>{node.meta.title}</Link> ({ new Date(node.meta.date).toDateString() })</li>
                </div>
            )
        }
    })
}

export const Note: React.FC<{}> = () => {

    return (
        <Container>
            日頃の知見をごった煮にして並べるスペース。
            <h1>記事一覧</h1>
            { expandDir([], pages) }
        </Container>
    )
}
