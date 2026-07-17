// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@safe-global/safe-contracts/contracts/Safe.sol";
import "./Errors.sol";
import "./Events.sol";
import "./PolicyEngine.sol";
import "./TreasuryManager.sol";
import "./AuditRegistry.sol";
import "./IeERCAdapter.sol";

contract SentinelModule {
    Safe public immutable safe;
    PolicyEngine public policyEngine;
    TreasuryManager public treasuryManager;
    AuditRegistry public auditRegistry;
    IeERCAdapter public eERCAdapter;

    uint256 public nonce;

    struct Proposal {
        address recipient;
        bytes ciphertext;
        bytes proof;
        address proposer;
        bool processed;
    }
    
    mapping(bytes32 => Proposal) public proposals;

    constructor(
        address payable _safe,
        address _policyEngine,
        address _treasuryManager,
        address _auditRegistry,
        address _eERCAdapter
    ) {
        safe = Safe(_safe);
        policyEngine = PolicyEngine(_policyEngine);
        treasuryManager = TreasuryManager(_treasuryManager);
        auditRegistry = AuditRegistry(_auditRegistry);
        eERCAdapter = IeERCAdapter(_eERCAdapter);
    }

    function proposeTransfer(address recipient, bytes calldata ciphertext, bytes calldata proof) external {
        if (!safe.isOwner(msg.sender)) {
            revert Errors.NotSafeOwner();
        }
        
        if (!eERCAdapter.verifyProof(ciphertext, proof)) {
            revert Errors.InvalidProof();
        }

        nonce++;
        bytes32 proposalId = keccak256(abi.encodePacked(msg.sender, recipient, ciphertext, nonce));
        
        emit Events.TransferProposed(proposalId, msg.sender, recipient, keccak256(ciphertext), block.timestamp);
        
        proposals[proposalId] = Proposal(recipient, ciphertext, proof, msg.sender, false);
    }

    function evaluateProposal(bytes32 proposalId, uint256 revealedAmount, bytes calldata bindingProof) external {
        Proposal storage p = proposals[proposalId];
        require(p.proposer != address(0), "Proposal not found");
        require(!p.processed, "Already processed");
        p.processed = true;

        (bool passed, bytes32 reasonCode) = policyEngine.evaluate(proposalId, revealedAmount, bindingProof, p.recipient);

        if (passed) {
            treasuryManager.queueTransfer(proposalId, p.recipient, p.ciphertext, p.proof);
            emit Events.TransferApproved(proposalId, bytes32(0)); 
        } else {
            auditRegistry.logRejection(proposalId, reasonCode);
        }
    }
}
