import React, { useState, useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'
import useDebounce from './useDebounce'

const SEARCH_POKEMON = gql`{search(str: $pokemonName) {name}}`

const Search = () => {
    const [searchText, setSearchText] = useState('')
    const debouncedSearch = useDebounce(searchText, 500)
    const [suggestions, setSuggestions] = useState([])
    const [selectedPokemon, setSelectedPokemon] = useState({})

    useEffect(() => {
        if (searchText === '') return
        const { error, data } = useQuery(SEARCH_POKEMON, {
            variables: { pokemonName }, 
        })

        setSuggestions(data)
        
    }, [debouncedSearch])

    const handleKeyUp = e => {
        console.log('keyup:', searchText)
        if (e.key === 'Enter') return loadSelection(searchText)

        setSearchText(e.target.value)
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
            {selectedPokemon.name
                ? <div>
                    <h1>{selectedPokemon.name}</h1>
                    <img src={selectedPokemon.image} />
                    <button onClick={() => handleLogin(selectedPokemon.name)}>Login</button>
                </div>
                : null}
        </div>
    )
}

export default Search