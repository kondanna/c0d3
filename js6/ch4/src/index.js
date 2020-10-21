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

const Profile = ({ user }) => {
    const [enrollment, setEnrollment] = useState({})

    useEffect(() => {
        sendQuery(`{lessons {title}}`).then(({ lessons }) => {
            const lessonMap = lessons.reduce((acc, lesson) => {
                acc[lesson.title] = { enrolled: false }
                return acc
            }, {})
            const userLessons = user.lessons || []
            userLessons.forEach(lesson => {
                lessonMap[lesson.title].enrolled = true
            })
            setEnrollment(lessonMap)
        })
    }, [])

    const handleEnroll = title => {
        sendQuery(`mutation {enroll(title: "${title}") {title}}`).then(_ => {
            setEnrollment({ ...enrollment, [title]: { enrolled: true } })
        })
    }

    const handleUnenroll = title => {
        sendQuery(`mutation {unenroll(title: "${title}") {title}}`).then(_ => {
            setEnrollment({ ...enrollment, [title]: { enrolled: false } })
        })
    }

    const handleLogout = () => {
        sendQuery(`{login (str:"") {name}}`).then(_ => {
            window.location.reload()
        })
    }

    return (
        <div>
            <h1>{user.name}</h1>
            <img src={user.image} />
            <button onClick={() => handleLogout()}>Logout</button>

            <hr />
            <div>
                <h2>Enrolled</h2>
                <p>Click to unenroll</p>
                {Object.keys(enrollment).filter(title => enrollment[title].enrolled).map((title, i) =>
                    <h4 key={i} id={title} onClick={() => handleUnenroll(title)}>{title}</h4>)}
            </div>
            <hr />
            <div>
                <h2>Not Enrolled</h2>
                <p>Click to enroll</p>
                {Object.keys(enrollment).filter(title => !enrollment[title].enrolled).map((title, i) =>
                    <h4 key={i} id={title} onClick={() => handleEnroll(title)}>{title}</h4>)}
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

        debounce(() => {
            console.log('keyup')
            sendQuery(`{search(str:"${searchText}") {name}}`).then(data => {
                const results = data.search || []
                setSuggestions(results)
            })
        }, 300)()
    }

    const loadSelection = name => {
        setSearchText('')
        sendQuery(`{getPokemon(str:"${name}"){name, image}}`).then(result => {
            console.log(result.getPokemon)
            setSelectedPokemon(result.getPokemon)
            setSuggestions([])
        })
    }

    const handleLogin = name => {
        sendQuery(`{login (str:"${name}") {name}}`).then(_ => {
            window.location.reload()
        })
    }

    return (
        <div>
            <h1>Pokemon Search</h1>
            <input type="text" value={searchText} onChange={e => setSearchText(e.target.value)} onKeyUp={e => handleKeyUp(e)} style={{ width: "100%" }} />
            <hr />
            <div>{suggestions.map((pokemon, i) => <h3 key={i} style={{ cursor: 'pointer' }} onClick={() => loadSelection(pokemon.name)}>{pokemon.name}</h3>)}</div>
            { selectedPokemon.name
                ? <div>
                    <h1>{selectedPokemon.name}</h1>
                    <img src={selectedPokemon.image} />
                    <button onClick={() => handleLogin(selectedPokemon.name)}>Login</button>
                </div>
                : null}
        </div>
    )
}

const App = () => {
    const [currentUser, setCurrentUser] = useState({})

    useEffect(() => {
        sendQuery(`{user {name, image, lessons {title}}}`).then(({ user }) => {
            if (!user) return
            setCurrentUser(user)
        })
    }, [])

    return (
        <div>
            { Object.keys(currentUser).length === 0
                ? <Search />
                : <Profile user={currentUser} />}
        </div>
    )
}

ReactDOM.render(<App />, $root)