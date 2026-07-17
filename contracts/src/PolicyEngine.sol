// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Errors.sol";
import "./Events.sol";
import "./PolicyLib.sol";

contract PolicyEngine {
    struct Rule {
        uint256 cap;
        address[] allowlist;
        uint64 effectiveFrom;
        bool active;
    }

    bytes32 public constant FINANCE_LEAD_ROLE = keccak256("FINANCE_LEAD_ROLE");

    mapping(bytes32 => Rule) public rules;
    mapping(address => bytes32) public orgRoleRegistry;
    mapping(bytes32 => bytes32[]) public ruleHistory;
    
    bytes32 public currentRuleId;

    constructor() {
        orgRoleRegistry[msg.sender] = FINANCE_LEAD_ROLE;
    }

    modifier onlyFinanceLead() {
        if (orgRoleRegistry[msg.sender] != FINANCE_LEAD_ROLE) {
            revert Errors.NotFinanceLead();
        }
        _;
    }

    function setRole(address account, bytes32 role) external onlyFinanceLead {
        bytes32 oldRole = orgRoleRegistry[account];
        orgRoleRegistry[account] = role;
        emit Events.RoleChanged(account, oldRole, role, msg.sender);
    }

    function createRule(bytes32 ruleId, uint256 cap, address[] calldata allowlist, uint64 effectiveFrom) external onlyFinanceLead {
        rules[ruleId] = Rule({
            cap: cap,
            allowlist: allowlist,
            effectiveFrom: effectiveFrom,
            active: true
        });
        currentRuleId = ruleId;
        emit Events.RuleCreated(ruleId, effectiveFrom, msg.sender);
    }

    function deactivateRule(bytes32 ruleId) external onlyFinanceLead {
        rules[ruleId].active = false;
        emit Events.RuleDeactivated(ruleId, uint64(block.timestamp), msg.sender);
    }

    // Evaluate proposal against current active rule
    function evaluate(bytes32 proposalId, uint256 revealedAmount, bytes calldata bindingProof, address recipient) external returns (bool passed, bytes32 reasonCode) {
        // verifyBindingProof(bindingProof, revealedAmount) logic would go here.
        // For MVP, we assume bindingProof is valid if passed.
        
        Rule memory rule = rules[currentRuleId];
        
        if (!rule.active || rule.effectiveFrom > block.timestamp) {
            passed = false;
            reasonCode = keccak256("NO_ACTIVE_RULE");
        } else if (!PolicyLib.checkCap(revealedAmount, rule.cap)) {
            passed = false;
            reasonCode = keccak256("CAP_EXCEEDED");
        } else if (!PolicyLib.checkAllowlist(recipient, rule.allowlist)) {
            passed = false;
            reasonCode = keccak256("COUNTERPARTY_NOT_ALLOWED");
        } else {
            passed = true;
            reasonCode = keccak256("PASS");
        }

        emit Events.PolicyChecked(proposalId, passed, reasonCode, currentRuleId);
        return (passed, reasonCode);
    }
}
