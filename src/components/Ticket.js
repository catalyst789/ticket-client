import React, { useState } from 'react'

const Ticket = (props) => {

    const [available, setAvailable] = useState(props.available);
    const [isSelected, setIsSelected] = useState(false);

    const onSelecteHandler = () => {
        setIsSelected(!isSelected);
    }

  return (
    <button style={isSelected ? {
        backgroundColor: '#000',color: '#fff'
    } : {}} id={props.seatNumber} onClick={(e) => {
        // props.onSelecteHandler(isSelected, setIsSelected)
        props.onSelectSeatHanlder(e, isSelected, setIsSelected);
    }} disabled={!available}>Seat No. {props.seatNumber}</button>
  )
}

export default Ticket;