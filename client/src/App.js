import React, { Component } from "react";

import ItemManager from "./contracts/ItemManager.json";

import Item from "./contracts/Item.json";

import getWeb3 from "./getWeb3";
import "./App.css";

class App extends Component {

  state = {cost: 0, itemName: "exampleItem1", loaded:false};


  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.

      this.web3 = await getWeb3();


      // Use web3 to get the user's accounts.

      this.accounts = await this.web3.eth.getAccounts();


      // Get the contract instance.

      const networkId = await this.web3.eth.net.getId();


//instances
      this.itemManager = new this.web3.eth.Contract(

        ItemManager.abi,

        ItemManager.networks[networkId] && ItemManager.networks[networkId].address,

      );

      this.item = new this.web3.eth.Contract(

        Item.abi,

        Item.networks[networkId] && Item.networks[networkId].address,

      );

      this.listenToPaymentEvent();

      this.setState({loaded:true});


    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
//.. more code here ...

listenToPaymentEvent =()=> {
  let self= this;
  this.itemManager.events.SupplyChainStep().on("data" ,async function(evt){
    console.log(evt);
    let itemObj= self.itemManager.methods.items(evt.returnValues._itemIndex).call();
    alert("Item" + itemObj._identifier +" was paid,deliver it now!");
  });
}


  
  handleSubmit = async () => {
    const { cost, itemName } = this.state;
    console.log(itemName, cost, this.itemManager);
    let result = await this.itemManager.methods.createItem(itemName, cost).send({ from: this.accounts[0] });
    console.log(result);
    alert("Send "+cost+" Wei to "+result.events.SupplyChainStep.returnValues._address);
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      
      <div className="hello">
      <div className=" ripple-background">
      <a href="https://marvel-university.herokuapp.com/"><img src="marvels.png" className="imgo"alt="marvel" width="100" height="100"></img></a>
      <div className='circle xxlarge shade1'></div>
  <div className='circle xlarge shade2'></div>
  <div className='circle large shade3'></div>
  <div className='circle mediun shade4'></div>
  <div className='circle small shade5'></div>
      <div className="App ">
        <h1 className="supply">Simply Payment/Supply Chain Management</h1>
        <h2>Items</h2>

        <h2>Add Element</h2>
        Cost: <input type="text" className="inputs" name="cost" value={this.state.cost} onChange={this.handleInputChange} />
        Item Name: <input type="text" className="inputs" name="itemName" value={this.state.itemName} onChange={this.handleInputChange} />
        <button type="button" className="btn" onClick={this.handleSubmit}>Create new Item</button>
      </div>
      </div>
      </div>
    );
  }
}


export default App;
