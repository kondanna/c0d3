import React from 'react'
import { useQuery, gql } from '@apollo/client'
import Profile from './Profile'
import { Search } from './Search'

const GET_USER = gql`{user {name, image, lessons {title, rating}}}`

const App = () => {
    const { error, loading, data } = useQuery(GET_USER)

    if (error) return console.log(error.message)

    if (loading) return <div><h3>Loading... </h3></div>
    
    return (
        <div>
            {Object.keys(data.user).length === 0
                ? <Search />
                : <Profile user={data} />}
        </div>
    )
}

export default App