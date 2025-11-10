// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RoomFactory {
    struct Room {
        string id;
        string name;
        address owner;
        address[] members;
    }

    mapping(string => Room) private rooms;

    event RoomCreated(string id, string name, address owner);
    event MemberAdded(string roomId, address wallet);

    function createRoom(string memory _id, string memory _name) public {
        require(rooms[_id].owner == address(0), "Room already exists");

        address[] memory initialMembers;
        rooms[_id] = Room(_id, _name, msg.sender, initialMembers);
        rooms[_id].members.push(msg.sender);

        emit RoomCreated(_id, _name, msg.sender);
    }

    function addMember(string memory _roomId, address _wallet) public {
        Room storage room = rooms[_roomId];
        require(room.owner != address(0), "Room not found");
        require(room.owner == msg.sender, "Only owner can add members");
        // avoid duplicates
        if (!isMember(_roomId, _wallet)) {
            room.members.push(_wallet);
            emit MemberAdded(_roomId, _wallet);
        }
    }

    // ---------- READ HELPERS (for backend verification) ----------

    function roomExists(string memory _roomId) public view returns (bool) {
        return rooms[_roomId].owner != address(0);
    }

    function isOwner(string memory _roomId, address _user) public view returns (bool) {
        Room storage room = rooms[_roomId];
        return room.owner == _user;
    }

    function isMember(string memory _roomId, address _user) public view returns (bool) {
        Room storage room = rooms[_roomId];
        if (room.owner == _user) return true; // owners are members by definition
        for (uint256 i = 0; i < room.members.length; i++) {
            if (room.members[i] == _user) {
                return true;
            }
        }
        return false;
    }

    function getMembers(string memory _roomId) public view returns (address[] memory) {
        return rooms[_roomId].members;
    }
}
