import React, { useState, useEffect } from 'react'
import { sendQuery } from './Search'
import Stars from './Stars'

const Profile = ({ user }) => {
    const [enrollment, setEnrollment] = useState({})
    const [ratings, setRatings] = useState({})

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

            const userRatings = user.ratings || []
            const ratingMap = userRatings.reduce((acc, {title, rating}) => {
                acc[title] = rating
                return acc
            }, {})
            console.log(ratingMap)
            setRatings(ratingMap)
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

    const handleRateLesson = (title, rating) => {
        sendQuery(`mutation {rateLesson(title:"${title}", rating:${rating}) {title, rating}}`).then(console.log)
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
                <div>
                    <h4 key={i} id={title} onClick={() => handleUnenroll(title)}>{title}</h4>
                    <Stars key={i} title={title} rating={ratings[title]} handleRateLesson={handleRateLesson}/>
                </div>)}
            </div>
            <hr />
            <div>
                <h2>Not Enrolled</h2>
                <p>Click to enroll</p>
                {Object.keys(enrollment).filter(title => !enrollment[title].enrolled).map((title, i) =>
                <div>
                    <h4 key={i} id={title} onClick={() => handleEnroll(title)}>{title}</h4>
                    <Stars key={i} title={title} rating={ratings[title]} handleRateLesson={handleRateLesson}/>
                </div>)}
            </div>
        </div>
    )
}

export default Profile