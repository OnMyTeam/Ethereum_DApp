
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "166.104.144.110",
      port: 7545,
      network_id: "*" // Match any network id
    },
    develop:{
      port: 8545,
    },
  },
  compilers: {
    solc: {
       version: "0.6.4"
    }
  },
};
