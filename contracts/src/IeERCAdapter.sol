// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IeERCAdapter {
    function verifyProof(bytes calldata ciphertext, bytes calldata proof) external view returns (bool);
    function submitEncryptedTransfer(address recipient, bytes calldata ciphertext, bytes calldata proof) external;
    function getEncryptedBalance(address account) external view returns (bytes memory);
    function isRegistered(address account) external view returns (bool);
}
