import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

const debounce = (fn, time) => {
    let timeout;
    return () => {
        clearTimeout(timeout)
        timeout = setTimeout(fn, time)
    }
}

const sendQuery = query => {
    return fetch('/graphql', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            operationName: null,
            variables: {},
            query
        }),
    }).then(r => r.json()).then(r => r.data)
}

const Profile = props => {
    const [enrolled, setEnrolled] = useState([])
    const [notEnrolled, setNotEnrolled] = useState([])

    useEffect(() => {
        sendQuery(`{user {name, image, lessons {title}}, lessons {title}}`).then(({ user, lessons }) => {
            const userLessons = user.lessons || []
            const enrolledLessons = userLessons.map(lesson => lesson.title) // array of lesson objects => array of titles
            const notEnrolledLessons = lessons.filter(e => !enrolledLessons.includes(e))
            setEnrolled(enrolledLessons)
            setNotEnrolled(notEnrolledLessons)
        })
    }, [])

    const handleEnroll = title => {
        sendQuery(`mutation {enroll(title: "${title}") {title}}`).then(_ => {
            setEnrolled([...enrolled, title])
        })
    }

    const handleUnenroll = title => {
        sendQuery(`mutation {unenroll(title: "${title}") {title}}`).then(_ => {
            setNotEnrolled(enrolled.filter(lesson => lesson !== title))
        })
    }

    const handleLogout = () => {
        sendQuery(`{login (str:"") {name}}`).then(_ => {
            return <Search />
        })
    }

    return (
        <div>
            <h1>{props.name}</h1>
            <img src={props.image}/>
            <button onClick={() => handleLogout()}></button>

            <hr/>
            <div>
                <h2>Enrolled</h2>
                <p>Click to unenroll</p>
                {enrolled.map(lesson => 
                <h4 id={lesson.title} onClick={e => handleUnenroll(e.target.id)}>{lesson.title}</h4>)}
            </div>
            <hr/>
            <div>
                <h2>Not Enrolled</h2>
                <p>Click to enroll</p>
                {notEnrolled.map(lesson => 
                <h4 id={lesson.title} onClick={e => handleEnroll(e.target.id)}>{lesson.title}</h4>)}
            </div>
        </div>
    )
}

const Search = () => {
    const [searchText, setSearchText] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [selectedPokemon, setSelectedPokemon] = useState({})

    const handleKeyUp = e => {
        if (e.key === 'Enter') return loadSelection(searchText)

        console.log('keyup')
        debounce(() => {
            sendQuery(`{search(str:"${searchText}") {name}}`).then(data => {
                const results = data.search || []
                setSuggestions(results)
            })
        }, 300)
    }
    
    const loadSelection = name => {
        setSearchText('')
        sendQuery(`{getPokemon(str:"${name}"){name, image}}`).then(result => {
            console.log(result)
            setSelectedPokemon(result)
        })
    }

    const handleLogin = name => {
        sendQuery(`{login (str:"${name}") {name}}`).then(result => {
            return <Profile user={result.name}/>
        })
    }

    return (
        <div>
            <h1>Pokemon Search</h1>
            <input type="text" value={searchText} onkeyup={e => { handleKeyUp(e)}} style="width: 100%;"/>
            <hr/>
            { selectedPokemon ? 
            <div>{suggestions.map(pokemon => <h3 onclick={() => {loadSelection(pokemon)}}>{pokemon.name}</h3>)}</div> :
            <div>
                <h1>${selectedPokemon.name}</h1>
                <img src={selectedPokemon.image} />
                <button onclick={() => handleLogin(selectedPokemon.name)}>Login</button>
            </div> }
        </div>
    )
}

const App = () => {
    [currentUser, setCurrentUser] = useEffect('')

    useEffect(() => {
        sendQuery(`{user {name, image, lessons {title}}, lessons {title}}`).then(({ user, lessons }) => {
            console.log(user)
            if (!user) return 
            setCurrentUser(user) // user = array of enrolled lessons, lessons = array of all lessons
        })
    }, [])

    return (
        <div>
            { currentUser ? <Profile user={currentUser}/> : <Search /> }
        </div>
    )
    
}

ReactDOM.render(<App />, $root)