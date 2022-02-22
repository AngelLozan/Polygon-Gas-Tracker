# Lessons learned:

This project contains dependencies in package.json that were purposefully not the latest version. 
Conflicts with Webpack version 5 required an initial buld that employed these versions. Loading the initial build as an extension was done with the outdated versions found in package.json. 
I then ran the command `$npm update` in the root directory to gain the full methods employed by the version of @alch/alchemy-web3 npm package version 1.2.2 (latest) that would allow for the method getFeeHistory.
@alch/alchemy-web3 (Version Latest) utilizes webpack 5 as a dependency. 

- Dist folder is to be loaded `unpacked` to chrome extensions at chrome://extensions 
- You need to re-build each time. 
- Specific environment variables are needed in the build to ensure webpack does not minify the JS
- Understading of the content security policy with chrome extenstions is helpful. Find this stackoverflow that helped me understand what I needed to post: https://stackoverflow.com/questions/32986074/content-security-policy-meta-tag-for-allowing-web-socket
- Webpack loaders and configuration was also useful in making preliminary versions of this app function. More information on those here: https://webpack.js.org/concepts/#loaders
- Information on configuring the webpack.config.js from this thread: https://github.com/digitalbazaar/forge/issues/908 to comply with webpack 5 update.
- Chrome is pretty verbose about the issues you might face when loading an unpacked dist or build folder from your project directory with errors. Still, a helpful guide is here on how to use React in a chrome extension: https://gilfink.medium.com/building-a-chrome-extension-using-react-c5bfe45aaf36
- Build script from this tutorial: https://dev.to/bayardlouis470/create-chrome-extension-in-react-3pna
- Set up the webpack -cli here: https://webpack.js.org/guides/getting-started/
- Used this to determine gas blocks: https://dev.to/rounakbanik/building-an-eip-1559-gas-tracker-4p7k
- Used React-loader npm package for the loading screen.
- Used React-tool-tip npm package for tooltip to display reload info.

# Biggest Lessons Learned: React lifecycle & webpack 5 configuration.
- Issue: Webpack 5 upgrade
	
	Webpack upgraded to 5 and react uses 5. So create-react-app needed to be downgraded during installation in order for many of the functions to work without advanced configuration. 

	Aftertwards, since Alchemy-web3 library does not have the proper methods to call getFeeHistory() so I ran $ npm upgragde from root directory.


- Issue: React lifecycle

import React, { useState, useEffect } from "react";

const Price = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [price, setWmatic] = useState({});


  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=wmatic&vs_currencies=usd")
      .then(res => res.json())
      .then(
        (result) => {

* Don't mix these two up. If you set the result after the setIsLoaded(), then See below lesson from Renie

>>>>>>>>  setWmatic(result); >>>>>>>>>>
>>>>>>>>  setIsLoaded(true); >>>>>>>>>>

        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {

		 setIsLoaded(true);
		 setError(error);
        }
      )
      fetch("https://api.coingecko.com/api/v3/simple/price?ids=wmatic&vs_currencies=usd");
  }, ["https://api.coingecko.com/api/v3/simple/price?ids=wmatic&vs_currencies=usd"])

// current output of Matic Price = {"price":{"wmatic":{"usd":2.01}}}  {JSON.stringify({price})}

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <p className='gas' style={{ color: "white", padding: "10px", marginLeft: "5px", marginRight: "5px", backgroundColor: "#7b3fe4", fontSize: "15px"}}>Current Matic Price: ${price.wmatic.usd} </p>
    );
  }
}

export default Price;

* Below leson: 
so, in the moment you set the isLoaded, react will try to re-render the screen already, that is how state works. But if it does it, it will fell in you third IF condition before the object ‘price’ is populated
then you get an error
if you populate first, it will re-render, but won’t pass by if else (!isLoaded) anymore
because the result is there, but it is still loading
it is simple but quite tricky actually. you problem was not about javascript in this case, but about React lifecycle


- Helpful in understanding updating react components with hooks: https://stackoverflow.com/questions/59803959/refresh-table-with-useeffect

- The API reference from polygon docs: https://docs.polygon.technology/docs/develop/tools/polygon-gas-station/ Where this came from: (https://gasstation-mainnet.matic.network/v2)


- Number formatting for api data: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed






### To Build uses special script. Command is `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.


### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
