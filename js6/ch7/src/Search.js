import React, { useState, useEffect } from 'react'
import { useLazyQuery, gql } from '@apollo/client'
import Profile from './Profile'
import useDebounce from './useDebounce'

const SEARCH = gql`query search($pokemonName: String) {search(str: $pokemonName) {name}}`
const SELECT_POKEMON = gql`query SelectPokemon($str: String) {selectPokemon(str:$str) {name, image}}`
const LOGIN = gql`query Login($str: String) {login(str:$str) {name, image}}`

const Search = () => {
    const [searchText, setSearchText] = useState('')
    const debouncedSearch = useDebounce(searchText, 500)

    const [search, { data: searchResults }] = useLazyQuery(SEARCH)
    const [selectPokemon, { data: selectedPokemon }] = useLazyQuery(SELECT_POKEMON)
    const [login] = useLazyQuery(LOGIN)

    useEffect(() => {
        if (searchText === '') return
        selectPokemon({}) // clears selected pokemon
        search({ variables: { pokemonName: searchText }})
    }, [debouncedSearch])

    const handleLogin = name => {
        login({ variables: { str: name } })
        window.location.reload()
    }

    return (
        <div>
            <h1>Pokemon Search</h1>
            <input type="text" value={searchText} onChange={e => setSearchText(e.target.value)} style={{ width: "100%" }} />
            <hr />

            {selectedPokemon
                ? <div>
                    <h1>{selectedPokemon.selectPokemon.name}</h1>
                    <img src={selectedPokemon.selectPokemon.image} />
                    <button onClick={() => handleLogin(selectedPokemon.selectPokemon.name)}>Login</button>
                </div>
                : <div>{searchResults && searchResults.search.map((pokemon, i) => <h3 key={i} style={{ cursor: 'pointer' }} onClick={() => selectPokemon({ variables: { str: pokemon.name }})}>{pokemon.name}</h3>)}</div>}
        </div>
    )
}

export default Search