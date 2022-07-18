// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./ItemManager.sol";

contract Item{
    uint public priceInWei;
    uint public pricePaid;
    uint public index;
    ItemManager parentContract;

    constructor(ItemManager _parentContract , uint _priceInWei , uint _index) public{
        priceInWei = _priceInWei;
        index = _index;
        parentContract= _parentContract;
    }
     //->Low level function:- a low level function is lil dangerous than high level function because something goes wrong it doesn't take care of throwing the exception.
    //fallback function
    receive() external payable{
        require(pricePaid==0,"Item is paid already");
        require(priceInWei==msg.value,"Only full payments allowed");
        pricePaid+=msg.value;
        (bool success ,)= address(parentContract).call.value(msg.value)(abi.encodeWithSignature("triggerPayment(uint256)",index));
        require(success, "The transaction wasn't successful ,cancelling");
        
    }

    fallback() external {

    }

}