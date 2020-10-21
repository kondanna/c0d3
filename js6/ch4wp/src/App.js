import React, { useState, useEffect } from 'react'
import Profile from './Profile'
import { sendQuery, Search } from './Search'

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

export default App