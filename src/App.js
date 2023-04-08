import React, { useState } from 'react';  
import TicketInput from './components/TicketInput';
import Ticket from './components/Ticket';
import StylesApp from './App.module.css';
import { serverInstance } from './axiosConfig/serverInstance';

const App = () => {

  const [userInput, setUserInput] = useState("");
  const [isSelectOption, setIselectOptions] = useState(false);
  const [userSelectedSeats, setUserSelectedSeats] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [bookingResult, setBookingResult] = useState(null);

  const onChangeHandler = (event) => {
    setUserInput(event.target.value>0 ? Number(event.target.value) : '');
  }

  const onBookHandler = async() => {
    try{
      setBookingResult({message: 'Booking Tickets...'});
      var bookingResFromServer;
      if(!userInput){
      setBookingResult(null);
      return;
      };
      if(userInput>7){
        setBookingResult(null);
        alert("Only 7 Tickets at a time allowed..!")
        return;
      }
      if(isSelectOption && userSelectedSeats.length && (userSelectedSeats.length === userInput) && userInput && userInput<8){
       bookingResFromServer = await serverInstance.post('/book', {
        ticketsToBeBooked: userSelectedSeats.length,
        userSelectedTickets: userSelectedSeats
      })
      setBookingResult(bookingResFromServer.data);
      console.log("bookingResFromServer", bookingResFromServer);
    }else if(!isSelectOption && userInput && userInput<8){
       bookingResFromServer = await serverInstance.post('/book', {
        ticketsToBeBooked: userInput,
      })
      setBookingResult(bookingResFromServer.data);
      console.log("bookingResFromServer", bookingResFromServer);
    }
    console.log("booked");
    setUserInput("");
    setIselectOptions(false);
    setUserSelectedSeats([]);
  }catch(error){
    console.log(error)
    setBookingResult(error.response.data.Error);
  }
  }

  const handleKeyDown = (event) => {
    if(event.key === 'Enter') onBookHandler();
    else return;
  }

  const onSelectTicketsHandler = async() => {
    setUserInput("");
    setBookingResult(null)
    setIselectOptions(true);
    setUserSelectedSeats([]);
    const fetchedAvailabeSeats = await serverInstance.get('/availabe');
    setAvailableSeats(fetchedAvailabeSeats.data);
  }

  const handleSeatNumberClicked = (event, isSelected, setIsSelected) => {
    if(userSelectedSeats.length===7){
      alert("Only 7 tickets at time allowed...!");
      return;
    }
    setIsSelected(!isSelected);
    const selectedSeat = Number(event.target.id);
    if(!userSelectedSeats.includes(selectedSeat)){
      setUserSelectedSeats([...userSelectedSeats, selectedSeat]);
      console.log("selected", selectedSeat);
      setUserInput(userSelectedSeats.length+1);
    }else{
      setUserSelectedSeats(userSelectedSeats.filter((seatNo) => seatNo !== selectedSeat));
      console.log("unselected", selectedSeat);
      setUserInput(userSelectedSeats.length-1>0 ? userSelectedSeats.length-1 : "");
    }
  }

  console.log(userSelectedSeats);

  return (
    <div>
      <h1>Tc Algo Matcher</h1>
      <TicketInput value={userInput} keyDownHandler={handleKeyDown} changeHanlder={onChangeHandler} bookingHandler={onBookHandler} />
      <p>OR</p>
      <button onClick={onSelectTicketsHandler}>Select Ticket by own</button><br />
      <div className={StylesApp.ticketsList}>
        {isSelectOption && (
          availableSeats.map((seatNumber) => 
          <Ticket key={seatNumber} onSelectSeatHanlder={handleSeatNumberClicked} seatNumber={seatNumber} available={true} />
          )
        )}
      </div>
      {bookingResult && <div>
        <h1>{typeof(bookingResult) === 'string' && bookingResult}</h1>
        <h1>{bookingResult.message}</h1>
        {bookingResult?.tickets?.length>0 && (
          bookingResult.tickets.map((bookedTicket) => 
          // {
            <ul key={bookedTicket._id}>
            <li>Ticket Id: {bookedTicket._id}</li>
            <li>Seat Number: {bookedTicket.seatNumber}</li>
            <li>Row Number: {bookedTicket.rowNumber}</li>
            <br />
          </ul>
          // }
          )
        )}
        </div>}
    </div>
  )
}

export default App;