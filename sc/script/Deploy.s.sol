// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "src/DocumentRegistry.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        DocumentRegistry registry = new DocumentRegistry();
        console.log("DocumentRegistry deployed at:", address(registry));
        vm.stopBroadcast();
    }
}
