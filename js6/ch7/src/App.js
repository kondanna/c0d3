import React from 'react'
import { useQuery, gql } from '@apollo/client'
import Profile from './Profile'
import { Search } from './Search'

const GET_USER = gql`{user {name, image, lessons {title, rating}}}`

const App = () => {
    const { error, data } = useQuery(GET_USER)

    if (error) return console.log(error.message)

    return (
        <div>
            {Object.keys(data).length === 0
                ? <Search />
                : <Profile user={data} />}
        </div>
    )
}

export default App