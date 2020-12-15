import React, { useState, useEffect } from 'react'
import { useQuery, useLazyQuery, gql } from '@apollo/client'
import useDebounce from './useDebounce'

const SEARCH = gql`query search($pokemonName: String) {search(str: $pokemonName) {name}}`
const SELECT_POKEMON = gql`query getPokemon($str: String) {getPokemon(str:$name){name, image}}`

const Search = () => {
    const [searchText, setSearchText] = useState('')
    const debouncedSearch = useDebounce(searchText, 500)
    const [suggestions, setSuggestions] = useState([])
    const [selectedPokemon, setSelectedPokemon] = useState({})

    const [search, searchResults] = useLazyQuery(SEARCH)
    const [selectPokemon, { data }] = useLazyQuery(SELECT_POKEMON)

    useEffect(() => {
        if (searchText === '') return
        search({
            variables: {
               pokemonName: searchText 
            }
        })
        setSuggestions(searchResults.data)

    }, [debouncedSearch])

    const handleKeyUp = e => {
        console.log('keyup:', searchText)
        if (e.key === 'Enter') return loadSelection(searchText)
        setSearchText(e.target.value)
    }

    const loadSelection = name => {
        setSearchText('')
        selectPokemon({ variables: { str: name } })
        setSelectedPokemon(data)
        setSuggestions([])
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