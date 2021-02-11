import React from 'react'
import { useQuery, gql } from '@apollo/client'
import Profile from './Profile'
import Search from './Search'

const GET_USER = gql`{user {name, image, lessons {title, rating}}}`

const App = () => {
    const { loading, data } = useQuery(GET_USER)

    if (loading) return <div><h3>Loading... </h3></div>
    
    return (
        <div>
            {data 
                ? <Profile user={data.user} />
                : <Search />}
        </div>
    )
}

export default App