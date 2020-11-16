import React, { useState, useEffect } from 'react'
// import { ApolloClient } from '@apollo/client'
import Profile from './Profile'
import { sendQuery, Search } from './Search'

// const client = new ApolloClient({
//     uri: 'http://localhost:8123/graphql'
// })

const App = () => {
    const [currentUser, setCurrentUser] = useState({})

    useEffect(() => {
        sendQuery(`{user {name, image, lessons {title}, ratings {title, rating}}}`).then(({ user }) => {
            if (!user) return
            setCurrentUser(user)
        })
    }, [])

    return (
        //<ApolloClient client={client}>
            <div>
            { Object.keys(currentUser).length === 0
                ? <Search />
                : <Profile user={currentUser} />}
            </div>
        //</ApolloClient>
    )
}

export default App