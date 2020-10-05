const Stars = () => {
    const [selection, setSelection] = React.useState(0)
    const [tense, setTense] = React.useState('are selecting')
    const stars = [1, 2, 3, 4, 5].map(starIdx => {
        return <i key={starIdx} style={{ color: 'yellow', fontSize: '30px', cursor: 'pointer' }}
            className={selection >= starIdx ? 'fa-star fas' : 'fa-star far'}
            onClick={() => setTense('have selected')}
            onMouseEnter={() => {
                setTense('are selecting')
                setSelection(starIdx)
            }}>
        </i>
    })
    return (
        <div>
            {stars}
            <div>You {tense} {selection} stars!</div>
        </div>
    )
}

const TodoList = ({name, style, data, prev, next, todos, createTodo, deleteTodo, moveTodo}) => {
    const [todoValue, setTodoValue] = React.useState('')

    const todoItems = todos.map(({id, text, todoList}) => {
        const arrowStyle = { display: 'inline-block', cursor: 'pointer', alignSelf: 'center', margin: '10px' }
            return (
                <div key={id} style={{ display: 'flex', justifyContent: 'stretch', margin: '5px', width: '100%' }}>
                    {prev && <div onClick={() => moveTodo(id, text, prev)} style={arrowStyle}>{'<'}</div>}

                    <div onClick={() => deleteTodo(id)} style={{ width: '100%', textAlign: 'justify', margin: '10px 0' }}>{text}</div>

                    {next && <div onClick={() => moveTodo(id, text, next)} style={arrowStyle}>{'>'}</div>}
                </div>
            )
    })

    return (
        <div id={name} style={{ display: 'flex', flexDirection: 'column', margin: '30px', height: '100%' }}>
            <div style={{ ...style, color: 'white', width: '100%', textAlign: 'center' }}>
                <div className={'title'}>{name}</div>
            </div>

            <div>{todoItems}</div>

            <div style={{ display: 'flex', width: '100%' }}>
                <textarea value={todoValue} onChange={e => setTodoValue(e.target.value)} style={{ width: '100%' }}></textarea>
                <button onClick={() => { createTodo(todoValue, name); setTodoValue('') }}>Submit</button>
            </div>
        </div>
    )
}

const Kanban = ({savedKanban}) => {
    const [kanban, setKanban] = React.useState(savedKanban)

    React.useEffect(() => {
        localStorage.setItem('kanban', JSON.stringify(kanban))
    }, [kanban])

    const createTodo = (text, todoList) => setKanban([...kanban, { id: Date.now(), todoList, text }])

    const deleteTodo = id => setKanban(kanban.filter(todo => todo.id !== id))

    const moveTodo = (id, text, todoList) => {
        setKanban(kanban.map(todo => {
            if (todo.id === id) return { id, text, todoList }
            return todo
        }))
    }

    const boards = [
        { name: 'todo', style: { backgroundColor: '#35235D' }, prev: '', next: 'doing' },
        { name: 'doing', style: { backgroundColor: '#CB2402' }, prev: 'todo', next: 'done' },
        { name: 'done', style: { backgroundColor: '#4C49A2' }, prev: 'doing', next: 'approved' },
        { name: 'approved', style: { backgroundColor: '#A31A48' }, prev: 'done', next: '' }
    ]

    const todoLists = boards.map(({ name, style, prev, next }, i) => {
        const todos = kanban.filter(todo => todo.todoList === name)
        return <TodoList key={i} name={name} style={style} todos={todos} createTodo={createTodo} deleteTodo={deleteTodo} moveTodo={moveTodo} prev={prev} next={next} />
    })

    return (
        <div style={{ display: 'flex', margin: '30px' }}>
            {todoLists}
        </div>
    )
}   

const App = () => {
    const app = window.location.pathname.split('/').pop()
    console.log(app)
    if (app.toLowerCase() === 'stars') return <Stars />
    const savedKanban = JSON.parse(localStorage.getItem('kanban') || '[]')
    return <Kanban savedKanban={savedKanban} />
}

ReactDOM.render(<App />, $root)