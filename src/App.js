import React, { useState, useEffect } from "react";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

function App() {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function asyncCalls() {
      await lottery.methods
        .manager()
        .call()
        .then((result) => {
          setManager(result);
        });
      await lottery.methods
        .getPlayers()
        .call()
        .then((result) => {
          setPlayers(result);
        });
      await web3.eth.getBalance(lottery.options.address).then((result) => {
        setBalance(result);
      });
    }

    asyncCalls();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    setMessage("Waiting on transaction success...");
    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei(value, "ether") });
    setMessage("You have been entered to the lottery!");
  };

  const handleClick = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    setMessage("Picking a winner...");
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    setMessage("A winner has been picked! Check your accounts!");
  };

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by {manager}. There are currently{" "}
        {players.length} people entered, competing to win{" "}
        {web3.utils.fromWei(balance, "ether")} ether!
      </p>
      <hr />
      <form onSubmit={handleSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <button type="submit">Enter</button>
        </div>
      </form>
      <hr />
      <h3>{message}</h3>
      <hr />
      <h3>Ready to pick a winner?</h3>
      <button onClick={handleClick}>Pick a winner</button>
    </div>
  );
}

export default App;
