import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import Stars from './Stars'

const GET_LESSONS = gql`query Lessons($title: String) {lessons {title}}`
const ENROLL_LESSON = gql`mutation Enroll($title: String) {enroll(title: $title) {title, rating}}`
const UNENROLL_LESSON = gql`mutation Unenroll($title: String) {unenroll(title: $title) {title, rating}}`
const RATE_LESSON = gql`mutation RateLesson($title: String, $rating: Int) {rateLesson(title: $title, rating: $rating) {title, rating}}`
const LOGOUT = gql`query Login($str: String) {login (str: $string) {name}}`

const Profile = ({ user }) => {
    const [enrollment, setEnrollment] = useState({})
    
    const { data } = useQuery(GET_LESSONS)
    const [enroll] = useMutation(ENROLL_LESSON)
    const [unenroll] = useMutation(UNENROLL_LESSON)
    const [rateLesson] = useMutation(RATE_LESSON)
    const [logout] = useLazyQuery(LOGOUT)

    useEffect(() => {
        const lessonMap = data.lessons.reduce((acc, lesson) => {
            acc[lesson.title] = { enrolled: false }
            return acc
        }, {})

        const userLessons = user.lessons || []
        userLessons.forEach(lesson => {
            lessonMap[lesson.itle].enrolled = true
            lessonMap[lesson.title].rating = lesson.rating
        })
        setEnrollment(lessonMap)
    }, [])
                                        
    const handleRateLesson = (title, rating) => {
        rateLesson({ variables: { title, rating }})
        setEnrollment({ ...enrollment, [title]: { enrolled: true, rating } })
    }

    const handleLogout = () => {
        logout({ variables: { str: "" }})
        window.location.reload()
    }

    return (
        <div>
            <h1>{user.name}</h1>
            <img src={user.image} />
            <button onClick={handleLogout}>Logout</button>

            <hr />
            <div>
                <h2>Enrolled</h2>
                <p>Click to unenroll</p>
                {Object.keys(enrollment).filter(title => enrollment[title].enrolled).map((title, i) =>
                    <div key={i}>
                        <h4 id={title} onClick={() => unenroll({ variables: { title }})}>{title}</h4>
                        <Stars title={title} rating={enrollment[title].rating} handleRateLesson={() => handleRateLesson(title, rating)} />
                    </div>)}
            </div>
            <hr />
            <div>
                <h2>Not Enrolled</h2>
                <p>Click to enroll</p>
                {Object.keys(enrollment).filter(title => !enrollment[title].enrolled).map((title, i) =>
                    <div key={i}>
                        <h4 id={title} onClick={() => enroll({ variables: { title }})}>{title}</h4>
                    </div>)}
            </div>
        </div>
    )
}

export default Profile