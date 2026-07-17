// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library Events {
    event TransferProposed(
        bytes32 indexed proposalId,
        address indexed proposer,
        address indexed recipient,
        bytes32 commitmentHash,
        uint256 timestamp
    );
    event PolicyChecked(bytes32 indexed proposalId, bool passed, bytes32 reasonCode, bytes32 ruleId);
    event TransferApproved(bytes32 indexed proposalId, bytes32 approvedAtSafeTxHash);
    event TransferRejected(bytes32 indexed proposalId, bytes32 reasonCode, uint256 timestamp);
    event BatchQueued(bytes32 indexed proposalId, uint256 batchEpoch);
    event BatchSettled(
        bytes32 indexed batchId,
        bytes32[] proposalIds,
        bytes32 settlementTxHash,
        uint256 timestamp
    );
    event RuleCreated(bytes32 indexed ruleId, uint64 effectiveFrom, address indexed actor);
    event RuleUpdated(bytes32 indexed ruleId, uint64 effectiveFrom, address indexed actor);
    event RuleDeactivated(bytes32 indexed ruleId, uint64 effectiveFrom, address indexed actor);
    event RoleChanged(address indexed account, bytes32 oldRole, bytes32 newRole, address indexed actor);
    event AuditKeyCommitmentSet(bytes32 keyCommitment, uint256 timestamp);
}
