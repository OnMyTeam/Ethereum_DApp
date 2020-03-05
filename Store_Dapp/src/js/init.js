Init = {
    web3Provider: null,
    contracts: {},

    init: async function() {
      return await Init.initWeb3();
    },
  
    // initWeb3: async function() {
        initWeb3: async function() {
        // if (window.ethereum) {
        //     Init.web3Provider = window.ethereum;
        //     try {
        //       // Request account access
        //       await window.ethereum.enable();
        //     } catch (error) {
        //       // User denied account access...
        //       console.error("User denied account access")
        //     }
        //   }
        //   // Legacy dapp browsers...
        //   else if (window.web3) {
        //     Init.web3Provider = window.web3.currentProvider;
        //   }
        //   // If no injected web3 instance is detected, fall back to Ganache
        //   else {
            Init.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
          // }
          web3 = new Web3(Init.web3Provider);
    },

  
  };