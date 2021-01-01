import Web3 from "web3";

// ADDITION This is needed to allow this application to interact with metamask
window.ethereum.enable();
// we need to hijack the browser's web3 Provider and inject the accounts from there into our own web3 provider,
// in order to have access to our account addresses inside of the app
const web3 = new Web3(window.web3.currentProvider);

export default web3;
