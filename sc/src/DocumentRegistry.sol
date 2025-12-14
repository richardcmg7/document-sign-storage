// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// DocumentRegistry.sol
// Estructura y funciones base según task.md

contract DocumentRegistry {
    struct Document {
        bytes32 hash;
        uint256 timestamp;
        address signer;
        bytes signature;
    }

    mapping(bytes32 => Document) public documents;
    bytes32[] public documentHashes;

    // --- Modifiers ---
    modifier documentNotExists(bytes32 _hash) {
        require(documents[_hash].signer == address(0), "Document already exists");
        _;
    }

    modifier documentExists(bytes32 _hash) {
        require(documents[_hash].signer != address(0), "Document does not exist");
        _;
    }

    // --- Store document ---
    function storeDocumentHash(
        bytes32 _hash,
        uint256 _timestamp,
        bytes memory _signature,
        address _signer
    ) external documentNotExists(_hash) {
        require(_signer != address(0), "Signer cannot be zero address");
        documents[_hash] = Document({
            hash: _hash,
            timestamp: _timestamp,
            signer: _signer,
            signature: _signature
        });
        documentHashes.push(_hash);
    }

    // --- Verify document ---
    function verifyDocument(
        bytes32 _hash,
        address _signer,
        bytes memory _signature
    ) external view documentExists(_hash) returns (bool) {
        Document memory doc = documents[_hash];
        return (doc.signer == _signer && keccak256(doc.signature) == keccak256(_signature));
    }

    // --- Get document info ---
    function getDocumentInfo(bytes32 _hash) external view documentExists(_hash) returns (Document memory) {
        return documents[_hash];
    }

    // --- Check if document is stored ---
    function isDocumentStored(bytes32 _hash) external view returns (bool) {
        return documents[_hash].signer != address(0);
    }

    // --- Get document count ---
    function getDocumentCount() external view returns (uint256) {
        return documentHashes.length;
    }

    // --- Get document hash by index ---
    function getDocumentHashByIndex(uint256 _index) external view returns (bytes32) {
        require(_index < documentHashes.length, "Index out of bounds");
        return documentHashes[_index];
    }
}
