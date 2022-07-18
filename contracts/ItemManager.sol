pragma solidity ^0.6.0;

import "./Ownable.sol";
import "./Item.sol";

contract ItemManager is Ownable{
    
    //0 ,1st and 2nd step
    enum SupplyChainState{Created, Paid, Delivered}

    struct S_Item {
        Item _item;
        ItemManager.SupplyChainState _state;
        string _identifier;
        uint _itemPrice;
    }
    mapping(uint => S_Item) public items; //S_Item is state of item
    uint itemIndex;

    event SupplyChainStep(uint _itemIndex, uint _step, address _itemAddress);

    function createItem(string memory _identifier, uint _itemPrice) public  onlyOwner{
        Item item = new Item(this, _itemPrice ,itemIndex);
        items[itemIndex]._item =item;
        items[itemIndex]._itemPrice = _itemPrice;
        items[itemIndex]._state = SupplyChainState.Created;
        items[itemIndex]._identifier = _identifier;
        emit SupplyChainStep(itemIndex, uint(items[itemIndex]._state), address(item));
        itemIndex++;
    }

    function triggerPayment(uint _itemIndex) public payable onlyOwner{
        require(items[_itemIndex]._itemPrice <= msg.value, "Only full payements accepted");
        require(items[_itemIndex]._state == SupplyChainState.Created, "Item is further in the supply chain");
        items[_itemIndex]._state = SupplyChainState.Paid;
        emit SupplyChainStep(_itemIndex, uint(items[_itemIndex]._state), address(items[_itemIndex]._item));
    }

    function triggerDelivery(uint _itemIndex) public {
        require(items[_itemIndex]._state == SupplyChainState.Paid, "Item is further in the supply chain");
        items[_itemIndex]._state = SupplyChainState.Delivered;
        emit SupplyChainStep(_itemIndex, uint(items[_itemIndex]._state),address(items[_itemIndex]._item));
    }
}
