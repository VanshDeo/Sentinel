// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library Errors {
    error NotSafeOwner();
    error NotEERCRegistered(address account);
    error InvalidProof();
    error InvalidBindingProof();
    error PolicyCapExceeded(bytes32 ruleId, uint256 cap);
    error CounterpartyNotAllowed(address recipient);
    error NotFinanceLead();
    error BatchNotReady();
    error AlreadySettled(bytes32 batchId);
    error ModuleNotEnabled();
}
