import React, { useState, useEffect } from "react";
import './App.css';

const Price = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [price, setWmatic] = useState({});


  useEffect(() => {
    const apiCall = fetch("https://api.coingecko.com/api/v3/simple/price?ids=wmatic&vs_currencies=usd")
      .then(res => res.json())
      .then(
        (result) => {
          setWmatic(result);
          setIsLoaded(true);
          console.log('wmatic set')
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
      
      fetch("https://api.coingecko.com/api/v3/simple/price?ids=wmatic&vs_currencies=usd");

  }, ["https://api.coingecko.com/api/v3/simple/price?ids=wmatic&vs_currencies=usd"]);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Price is Loading...</div>;
  } else {
    return (
      <p className='gas' style={{ color: "white", padding: "10px", marginLeft: "5px", marginRight: "5px", backgroundColor: "#7b3fe4", fontSize: "15px"}}>Current Matic Price: ${(Math.round(price.wmatic.usd * 100) / 100).toFixed(2)} </p>
    );
  }
}

export default Price;

