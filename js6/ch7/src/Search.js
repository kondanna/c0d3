import React, { useState, useEffect } from 'react'
import { useLazyQuery, gql } from '@apollo/client'

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        // Update debounced value after delay
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay);
        // Cancel the timeout if value changes (also on delay change or unmount)
        return () => {
            clearTimeout(handler)
        }
    }, [value, delay]) // Only re-call effect if value or delay changes

    return debouncedValue
}

const SEARCH = gql`query search($pokemonName: String) {search(str: $pokemonName) {name}}`
const SELECT_POKEMON = gql`query SelectPokemon($str: String) {selectPokemon(str:$name) {name, image}}`
const LOGIN = gql`query Login($str: String) {login(str:$name) {name, image}}`

const Search = () => {
    const [searchText, setSearchText] = useState('')
    const debouncedSearch = useDebounce(searchText, 500)

    const [search, { data: searchResults }] = useLazyQuery(SEARCH)
    const [selectPokemon, { data: selectedPokemon }] = useLazyQuery(SELECT_POKEMON)
    const [login] = useLazyQuery(LOGIN)

    useEffect(() => {
        if (searchText === '') return
        search({ variables: { pokemonName: searchText }})
    }, [debouncedSearch])

    const handleKeyUp = e => {
        console.log('keyup:', searchText)
        if (e.key === 'Enter') return loadSelection(searchText)
        setSearchText(e.target.value)
    }

    const loadSelection = name => {
        selectPokemon({ variables: { str: name } })
        window.location.reload()
    }

    return (
        <div>
            <h1>Pokemon Search</h1>
            <input type="text" value={searchText} onChange={e => setSearchText(e.target.value)} onKeyUp={e => handleKeyUp(e)} style={{ width: "100%" }} />
            <hr />
            <div>{searchResults.map((pokemon, i) => <h3 key={i} style={{ cursor: 'pointer' }} onClick={() => loadSelection(pokemon.name)}>{pokemon.name}</h3>)}</div>

            {selectedPokemon
                ? <div>
                    <h1>{selectedPokemon.name}</h1>
                    <img src={selectedPokemon.image} />
                    <button onClick={() => login({ variables: { str: selectedPokemon.name } })}>Login</button>
                </div>
                : null}
        </div>
    )
}

export default Search