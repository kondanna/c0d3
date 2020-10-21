import React, { useState } from 'react'

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

export { sendQuery, Search }