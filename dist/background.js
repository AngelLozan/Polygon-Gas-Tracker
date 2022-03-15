// You can set the let onceFlag to true and call getGas initially to set the badge from the moment you open the app. 

// let onceFlag = true

// if (onceFlag == true) {
//   onceFlag = false
//   GetGas()
// } 

// var appData = {
//   gasData: {}
// };

// chrome.alarms.create('fetch_gas_price',{
//   "periodInMinutes": 1
// });

// chrome.alarms.onAlarm.addListener(alarm => {
//   fetchGasPrice();
// });

// function updateBadge() {
//   chrome.storage.sync.get({
//     gasPriceOption: "standard",
//   }, function(items) {
//     const gasPrice = appData.gasData[items.gasPriceOption].gwei;
//     chrome.browserAction.setBadgeText({text: String(gasPrice)});
//   });
// }


chrome.alarms.create('get_gas', { periodInMinutes: 0.25 })

chrome.alarms.onAlarm.addListener(() => {
  console.log('badge refresh is functional! Service worker is active');
  GetGas();
});


async function GetGas(items) {
  let response = await fetch('https://gasstation-mainnet.matic.network/v2');
  let json = await response.json()
  let standard = (json['standard']['maxFee']).toFixed(1)
   chrome.action.setBadgeText({ text: String(standard) });
}

//GetGas();
//setInterval(GetGas, 10000)

// function getProviderUrl(provider) {
//   switch(provider) {
//     case 'maticgasstation':
//       // return "https://gasprice-proxy.herokuapp.com/"; // Firefox specific proxy
//       return "https://gasstation-mainnet.matic.network/v2";
//   }
// }

// function fetchGasPrice() {
//   return new Promise((resolve, reject)=>{
//     chrome.storage.sync.get({
//       provider: "maticgasstation",
//     }, function(items) {
//       const url = getProviderUrl(items.provider);

//       fetch(url).then((res) => {return res.json()})
//       .then(data => {
//         // Store the current data for the popup page
//         appData.gasData = parseApiData(data, items.provider);
//         // Update badge
//         updateBadge();

//         // Resolve promise on success
//         resolve();
//       })
//       .catch((error) => {
//         // reject();
//       });
//     });
//   });
// }

// // Create a consistent structure for data so we can use multiple providers
// function parseApiData(apiData, provider) {
//   if(provider === "maticgasstation") {
//     return {
//       "slow": {
//         "gwei": parseInt(apiData.safeLow, 10)/10,
//         "wait": "~"+apiData.safeLowWait + " minutes"
//       },
//       "standard": {
//         "gwei": parseInt(apiData.average, 10)/10,
//         "wait": "~"+apiData.avgWait + " minutes"
//       },
//       "fast": {
//         "gwei": parseInt(apiData.fast, 10)/10,
//         "wait": "~"+apiData.fastWait + " minutes"
//       },
//       "rapid": {
//         "gwei": parseInt(apiData.fastest, 10)/10,
//         "wait": "~"+apiData.fastestWait + " minutes"
//       }
//     }
//   }
  
// }

// fetchGasPrice(); // Initial fetch