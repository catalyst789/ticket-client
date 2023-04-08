import React from 'react'

const TicketInput = (props) => {
  return (
    <div>
        <p>How many Ticket you want to book ?</p>
        <input value={props.value} onKeyDown={props.keyDownHandler} onChange={props.changeHanlder} type="number"/>  
        <button onClick={props.bookingHandler}>Book</button>
    </div>
  )
}

export default TicketInput