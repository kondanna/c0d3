import React, { useState, useEffect } from 'react'
import { sendQuery } from './Search'
import Stars from './Stars'

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
                lessonMap[lesson.title].rating = lesson.rating
            })
            setEnrollment(lessonMap)
        })
    }, [])

    const handleEnroll = title => {
        sendQuery(`mutation {enroll(title: "${title}") {title, rating}}`).then(_ => {
            setEnrollment({ ...enrollment, [title]: { enrolled: true, rating: 0 } })
        })
    }

    const handleUnenroll = title => {
        sendQuery(`mutation {unenroll(title: "${title}") {title, rating}}`).then(_ => {
            setEnrollment({ ...enrollment, [title]: { enrolled: false, rating: 0 } })
        })
    }

    const handleRateLesson = (title, rating) => {
        sendQuery(`mutation {rateLesson(title:"${title}", rating:${rating}) {title, rating}}`).then(_ => {
            setEnrollment({ ...enrollment, [title]: { enrolled: true, rating } })
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
                    <div key={i}>
                        <h4 id={title} onClick={() => handleUnenroll(title)}>{title}</h4>
                        <Stars title={title} rating={enrollment[title].rating} handleRateLesson={handleRateLesson} />
                    </div>)}
            </div>
            <hr />
            <div>
                <h2>Not Enrolled</h2>
                <p>Click to enroll</p>
                {Object.keys(enrollment).filter(title => !enrollment[title].enrolled).map((title, i) =>
                    <div key={i}>
                        <h4 id={title} onClick={() => handleEnroll(title)}>{title}</h4>
                    </div>)}
            </div>
        </div>
    )
}

export default Profile