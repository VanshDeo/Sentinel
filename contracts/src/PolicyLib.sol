// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library PolicyLib {
    function checkCap(uint256 amount, uint256 cap) internal pure returns (bool) {
        return amount <= cap;
    }

    function checkAllowlist(address recipient, address[] memory allowlist) internal pure returns (bool) {
        // If allowlist is empty, we assume no restriction applies
        if (allowlist.length == 0) {
            return true;
        }
        for (uint256 i = 0; i < allowlist.length; i++) {
            if (allowlist[i] == recipient) {
                return true;
            }
        }
        return false;
    }
}
