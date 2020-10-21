import React, { useState, useEffect } from 'react'
import { sendQuery } from './Search'

const Profile = ({ user }) => {
    const [enrollment, setEnrollment] = useState({})

    useEffect(() => {
        sendQuery(`{lessons {title}}`).then(({ lessons }) => {
            const lessonMap = lessons.reduce((acc, lesson) => {
                acc[lesson.title] = { enrolled: false }
                return acc
            }, {})
            const userLessons = user.lessons || []
            userLessons.forEach(lesson => {
                lessonMap[lesson.title].enrolled = true
            })
            setEnrollment(lessonMap)
        })
    }, [])

    const handleEnroll = title => {
        sendQuery(`mutation {enroll(title: "${title}") {title}}`).then(_ => {
            setEnrollment({ ...enrollment, [title]: { enrolled: true } })
        })
    }

    const handleUnenroll = title => {
        sendQuery(`mutation {unenroll(title: "${title}") {title}}`).then(_ => {
            setEnrollment({ ...enrollment, [title]: { enrolled: false } })
        })
    }

    const handleLogout = () => {
        sendQuery(`{login (str:"") {name}}`).then(_ => {
            window.location.reload()
        })
    }

    return (
        <div>
            <h1>{user.name}</h1>
            <img src={user.image} />
            <button onClick={() => handleLogout()}>Logout</button>

            <hr />
            <div>
                <h2>Enrolled</h2>
                <p>Click to unenroll</p>
                {Object.keys(enrollment).filter(title => enrollment[title].enrolled).map((title, i) =>
                    <h4 key={i} id={title} onClick={() => handleUnenroll(title)}>{title}</h4>)}
            </div>
            <hr />
            <div>
                <h2>Not Enrolled</h2>
                <p>Click to enroll</p>
                {Object.keys(enrollment).filter(title => !enrollment[title].enrolled).map((title, i) =>
                    <h4 key={i} id={title} onClick={() => handleEnroll(title)}>{title}</h4>)}
            </div>
        </div>
    )
}

export default Profile