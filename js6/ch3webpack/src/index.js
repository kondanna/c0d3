import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

const Star = ({ idx, isSelected, handleClick, handleSelect }) => {
    return (
        <i key={idx} className={'star'}
            className={isSelected ? 'star fa-star fas' : 'star fa-star far'}
            onClick={() => handleClick(idx)}
            onMouseEnter={() => handleSelect(idx)}>
        </i>
    )
}
const Stars = () => {
    const [selected, setSelected] = useState(0)
    const [locked, setLocked] = useState(false)
    const [tense, setTense] = useState('are selecting')
    const handleClick = () => {
        setLocked(true)
        setTense('have selected')
    }
    const handleSelect = idx => {
        if (locked) return
        setSelected(idx)
        setTense('are selecting')
    }
    return (
        <div onMouseEnter={() => setLocked(false)}>
            {[1, 2, 3, 4, 5].map(idx =>
                <Star key={idx} idx={idx} isSelected={selected >= idx} handleClick={() => handleClick()} handleSelect={() => handleSelect(idx)} />)}
            <div>You {tense} {selected} stars!</div>
        </div>
    )
}
const kanbanStructure = [
    { name: 'todo', style: { backgroundColor: '#35235D' }, prev: '', next: 'doing' },
    { name: 'doing', style: { backgroundColor: '#CB2402' }, prev: 'todo', next: 'done' },
    { name: 'done', style: { backgroundColor: '#4C49A2' }, prev: 'doing', next: 'approved' },
    { name: 'approved', style: { backgroundColor: '#A31A48' }, prev: 'done', next: '' }
]
const TodoItem = ({ idx, listName, text, prev, next, deleteTodo, moveTodo }) => {
    return (
        <div className={'todoContainer'}>
            {prev && <div className={'arrow'} onClick={() => moveTodo(idx, text, listName, prev)}>{'<'}</div>}
            <div className={'todoText'} onClick={() => deleteTodo(idx, listName)}>{text}</div>
            {next && <div className={'arrow'} onClick={() => moveTodo(idx, text, listName, next)}>{'>'}</div>}
        </div>
    )
}
const TodoList = ({ name, style, prev, next, todos, createTodo, deleteTodo, moveTodo }) => {
    const [todoValue, setTodoValue] = useState('')
    const handleSubmit = (text, list) => {
        createTodo(text, list)
        setTodoValue('')
    }
    return (
        <div id={name} className={'todoList'}>
            <div className={'titleBar'} style={style}>
                <div>{name}</div>
            </div>
            <div>{todos.map((todo, i) => {
                return <TodoItem
                    key={i}
                    idx={i}
                    listName={name}
                    text={todo}
                    prev={prev}
                    next={next}
                    deleteTodo={deleteTodo}
                    moveTodo={moveTodo} />
            })}
            </div>
            <div className={'inputContainer'}>
                <textarea value={todoValue} onChange={e => setTodoValue(e.target.value)} style={{ width: '100%' }}></textarea>
                <button onClick={() => handleSubmit(todoValue, name)}>Submit</button>
            </div>
        </div>
    )
}
const Kanban = props => {
    const [kanban, setKanban] = useState(props.savedKanban)
    useEffect(() => {
        localStorage.setItem('kanban', JSON.stringify(kanban))
    }, [kanban])
    const createTodo = (text, toList) => {
        setKanban({ ...kanban, [toList]: [...kanban[toList], text] })
    }
    const deleteTodo = (idx, fromList) => {
        setKanban({ ...kanban, [fromList]: kanban[fromList].filter((todo, i) => i !== idx) })
    }
    const moveTodo = (idx, text, fromList, toList) => {
        setKanban({ ...kanban, [fromList]: kanban[fromList].filter((todo, i) => i !== idx), [toList]: [...kanban[toList], text], })
    }
    return (
        <div className={'kanban'}>
            {kanbanStructure.map(todoList => {
                const { name, style, prev, next } = todoList
                return <TodoList
                    key={name}
                    name={name}
                    style={style}
                    prev={prev}
                    next={next}
                    todos={kanban[name]}
                    createTodo={createTodo}
                    deleteTodo={deleteTodo}
                    moveTodo={moveTodo} />
            })}
        </div>
    )
}
const App = () => {
    const app = window.location.pathname.split('/').pop()
    if (app.toLowerCase() === 'stars') return <Stars />
    const savedKanban = JSON.parse(localStorage.getItem('kanban') || '{"todo":[],"doing":[],"done":[],"approved":[]}')
    return <Kanban savedKanban={savedKanban} />
}
ReactDOM.render(<App />, $root)