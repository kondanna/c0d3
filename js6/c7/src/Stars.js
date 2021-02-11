import React, { useState, useEffect } from 'react'

const Star = ({ idx, isSelected, handleClick, handleSelect }) => {
    return (
        <i key={idx} className={'star'}
            className={isSelected ? 'star fa-star fas' : 'star fa-star far'}
            onClick={() => handleClick(idx)}
            onMouseEnter={() => handleSelect(idx)}>
        </i>
    )
}

const Stars = props => {
    const { title, rating, handleRateLesson } = props

    const [selected, setSelected] = useState(rating)
    const [locked, setLocked] = useState(false)
    const [tense, setTense] = useState('have selected')

    const handleClick = () => {
        setLocked(true)
        setTense('have selected')
        handleRateLesson(title, selected)
    }
    const handleSelect = idx => {
        if (locked) return
        setSelected(idx)
        setTense('are selecting')
    }
    return (
        <div onMouseEnter={() => setLocked(false)}>
            {[1, 2, 3, 4, 5].map(idx =>
                <Star key={idx} idx={idx} isSelected={selected >= idx} handleClick={handleClick} handleSelect={() => handleSelect(idx)} />)}
            <div>You {tense} {selected} stars!</div>
        </div>
    )
}

export default Stars