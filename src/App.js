import './App.css';
import { useEffect, useState } from 'react';
import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import logo from './logo.png';
import loader from "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Audio } from  'react-loader-spinner'
import ReactTooltip from "react-tooltip";
import Price from './maticPrice.js';

// import ReactDOM from 'react-dom';
//import { BrowserRouter as Router } from "react-router-dom";

const NUM_BLOCKS = 5;


function App() {

  const [blockHistory, setBlockHistory] = useState(null);
  const [avgGas, setAvgGas] = useState(null);
  const [avgBlockVolume, setAvgBlockVolume] = useState(null);


  const formatOutput = (data) => {

    let avgGasFee = 0;
    let avgFill = 0;
    let blocks = [];

    for (let i = 0; i < NUM_BLOCKS; i++) {

      avgGasFee = avgGasFee + Number(data.reward[i][1]) + Number(data.baseFeePerGas[i])
      avgFill = avgFill + Math.round(data.gasUsedRatio[i] * 100);

      blocks.push({
        blockNumber: Number(data.oldestBlock) + i,
        reward: data.reward[i].map(r => Math.round(Number(r) / 10 ** 9)),
        baseFeePerGas: Math.round(Number(data.baseFeePerGas[i]) / 10 ** 9),
        gasUsedRatio: Math.round(data.gasUsedRatio[i] * 100),
      })
    }

    avgGasFee = avgGasFee / NUM_BLOCKS;
    avgGasFee = Math.round(avgGasFee / 10 ** 9)

    avgFill = avgFill / NUM_BLOCKS;
    
    return [blocks, avgGasFee, avgFill];
  }



  useEffect(() => {

    
    const web3 = createAlchemyWeb3(
      "wss://polygon-mainnet.g.alchemy.com/v2/Wq8pHfawsfS8L426HyXtx6GcPM0c1bPp",
    );

    let subscription = web3.eth.subscribe('newBlockHeaders');

    subscription.on('data', () => {
      web3.eth.getFeeHistory(NUM_BLOCKS, "latest", [25, 50, 75]).then((feeHistory) => {
        const [blocks, avgGasFee, avgFill] = formatOutput(feeHistory, NUM_BLOCKS);
        setBlockHistory(blocks);
        setAvgGas(avgGasFee);
        setAvgBlockVolume(avgFill);
      });
    });

    return () => {
      web3.eth.clearSubscriptions();
    }


  }, [])


  return (
    <div className='main-container'>

    <a data-tip data-for='info' style={{position: 'absolute', right: '5px'}}> How is gas calculated? </a>
    <ReactTooltip id='info' place='bottom' type='dark' effect='float'>
    <span>The gas price displayed ("Average Gas Cost") is calculated between lower and higher percentiles of priority fees (Priority 1, 2 & 3). The Average Gas Cost changes faster than the badge icon as it's calculated in real time and is based on a range of data. The blocks are displayed below. The icon badge is based on the standard fee from one block pulled every 15 seconds. Matic price is from Coingecko. If this does not load, open and close the extension to refresh.</span>
    </ReactTooltip>


      <h1 style={{padding: "30px"}}>
      <img style={{ width: "2em" , height:"2em" }}src={logo} />

      Polygon-Matic Gas Tracker
      </h1>
      {!blockHistory && <div> <p>Connecting to Polygon...</p> <div className="bars"><Audio heigth="100"
    width="100"
    color='#7b3fe4'
    text-align="center"
    ariaLabel= "loading"/> </div> </div>}
      {avgGas && avgBlockVolume && <h2>
        <span className='gas' style={{ color: "white", padding: "10px", backgroundColor: "#7b3fe4"}} >Average Gas Cost: {avgGas} Gwei </span>
      </h2>}
      
      
     {blockHistory && <table>
        <thead>
          <tr>
            <th>Block Number</th>
            <th>Base Fee</th>
            <th>Reward (25%)</th>
            <th>Reward (50%)</th>
            <th>Reward (75%)</th>
            <th>Gas Used</th>
          </tr>
        </thead>
        <tbody>
          {blockHistory.map(block => {
            return (
              <tr key={block.blockNumber}>
                <td>{block.blockNumber}</td>
                <td>{block.baseFeePerGas}</td>
                <td>{block.reward[0]}</td>
                <td>{block.reward[1]}</td>
                <td>{block.reward[2]}</td>
                <td>{block.gasUsedRatio}%</td>
              </tr>
            )
          })}
        </tbody>
      </table> }
      <Price />
    <p style={{padding: "5px"}}>See the conversion from gwei to matic at <a href="https://polygonscan.com/unitconverter" target="_blank">Polygonscan</a></p>

    </div>
  );

}

export default App;