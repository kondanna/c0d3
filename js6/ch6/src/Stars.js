import React from 'react'

const Stars = props => {
    const [selected, setSelected] = React.useState(props.rating)
    const [locked, setLocked] = React.useState(false)
    const [tense, setTense] = React.useState('are selecting')

    const handleClick = () => {
        setLocked(true)
        setTense('have selected')
        props.handleRateLesson(props.title, selected)
    }
    const handleSelect = idx => {
        if (locked) return
        setSelected(idx)
        setTense('are selecting')
    }
    return (
        <div onMouseEnter={() => setLocked(false)}>
            {[1, 2, 3, 4, 5].map(idx => 
                <Star key={idx} idx={idx} isSelected={selected >= idx} handleClick={() => handleClick()} handleSelect={() => handleSelect(idx)} />)}
            <div>You {tense} {selected} stars!</div>
        </div>
    )
}

export default Stars