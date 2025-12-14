// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Tests base para DocumentRegistry
// Implementación detallada en siguientes pasos

import "forge-std/Test.sol";
import "src/DocumentRegistry.sol";

contract DocumentRegistryTest is Test {
        function testStoreDocumentWithZeroAddress() public {
            bytes32 hash = keccak256("doc9");
            uint256 timestamp = block.timestamp;
            bytes memory signature = hex"1234";
            address zero = address(0);
            vm.expectRevert("Signer cannot be zero address");
            registry.storeDocumentHash(hash, timestamp, signature, zero);
        }

        function testStoreDocumentWithEmptySignature() public {
            bytes32 hash = keccak256("doc10");
            uint256 timestamp = block.timestamp;
            bytes memory signature = "";
            registry.storeDocumentHash(hash, timestamp, signature, signer);
            DocumentRegistry.Document memory doc = registry.getDocumentInfo(hash);
            assertEq(doc.signature.length, 0);
        }
    DocumentRegistry registry;
    address signer;
    uint256 signerPrivateKey;

    function setUp() public {
        registry = new DocumentRegistry();
        signerPrivateKey = 0xA11CE;
        signer = vm.addr(signerPrivateKey);
    }

    function testStoreDocument() public {
        bytes32 hash = keccak256("doc1");
        uint256 timestamp = block.timestamp;
        bytes memory signature = hex"1234";
        registry.storeDocumentHash(hash, timestamp, signature, signer);
        DocumentRegistry.Document memory doc = registry.getDocumentInfo(hash);
        assertEq(doc.hash, hash);
        assertEq(doc.timestamp, timestamp);
        assertEq(doc.signer, signer);
        assertEq(doc.signature, signature);
    }

    function testCannotStoreDuplicateDocument() public {
        bytes32 hash = keccak256("doc2");
        uint256 timestamp = block.timestamp;
        bytes memory signature = hex"1234";
        registry.storeDocumentHash(hash, timestamp, signature, signer);
        vm.expectRevert("Document already exists");
        registry.storeDocumentHash(hash, timestamp, signature, signer);
    }

    function testVerifyDocument() public {
        bytes32 hash = keccak256("doc3");
        uint256 timestamp = block.timestamp;
        bytes memory signature = hex"abcd";
        registry.storeDocumentHash(hash, timestamp, signature, signer);
        bool valid = registry.verifyDocument(hash, signer, signature);
        assertTrue(valid);
    }

    function testVerifyDocumentWrongSigner() public {
        bytes32 hash = keccak256("doc4");
        uint256 timestamp = block.timestamp;
        bytes memory signature = hex"abcd";
        registry.storeDocumentHash(hash, timestamp, signature, signer);
        address other = address(0xBEEF);
        bool valid = registry.verifyDocument(hash, other, signature);
        assertFalse(valid);
    }

    function testVerifyDocumentWrongSignature() public {
        bytes32 hash = keccak256("doc5");
        uint256 timestamp = block.timestamp;
        bytes memory signature = hex"abcd";
        registry.storeDocumentHash(hash, timestamp, signature, signer);
        bytes memory wrongSig = hex"dead";
        bool valid = registry.verifyDocument(hash, signer, wrongSig);
        assertFalse(valid);
    }

    function testGetDocumentInfoRevertsIfNotExists() public {
        bytes32 hash = keccak256("not-exist");
        vm.expectRevert("Document does not exist");
        registry.getDocumentInfo(hash);
    }

    function testIsDocumentStored() public {
        bytes32 hash = keccak256("doc6");
        assertFalse(registry.isDocumentStored(hash));
        registry.storeDocumentHash(hash, block.timestamp, hex"01", signer);
        assertTrue(registry.isDocumentStored(hash));
    }

    function testGetDocumentCountAndByIndex() public {
        bytes32 hash1 = keccak256("doc7");
        bytes32 hash2 = keccak256("doc8");
        registry.storeDocumentHash(hash1, block.timestamp, hex"01", signer);
        registry.storeDocumentHash(hash2, block.timestamp, hex"02", signer);
        assertEq(registry.getDocumentCount(), 2);
        assertEq(registry.getDocumentHashByIndex(0), hash1);
        assertEq(registry.getDocumentHashByIndex(1), hash2);
    }

    function testGetDocumentHashByIndexReverts() public {
        vm.expectRevert("Index out of bounds");
        registry.getDocumentHashByIndex(0);
    }
}
