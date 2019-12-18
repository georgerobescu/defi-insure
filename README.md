# Defi Insure

Automatically insure your Defi positions.

## Problem

There are millions of dollars locked in Defi protocols, with most of them uninsured. It's important to reduce risk as much as reasonably possible to make Defi more publicly usable, but insuring smart contracts is a slow and arduous process, which the average person would not be able to figure out.

## Solution

Given an address, determine which Defi protocols are being used along with the size of their positions. With this data, determine the cost to insure all positions. If the user deems it to be a worthy investment, automatically insure all positions appropriately.

## Use Cases

- Integration with smart contract wallet
- Integration with portfolio manager

## Execution

- User clicks a button to scan their positions.
- A call is made to popular Defi protocols to see if user has a position with these protocols.
  - Accepted protocols will begin with: Compound, dYdX, and Fulcrum.
  - If there is interest in Defi Insure, additional protocols will be continuously added.
- An insurance quote is obtained for each position via Nexus Mutual.
- The total price of insurance for all positions is returned to the user.
- The user chooses to purchase insurance.
- Insurance is purchased for each protocol on behalf of the user.

## Try it yourself

- `git clone`
- `npm install`
- `cd client`
- `npm run start`

## Notes

- Due to several unforeseen constraints, smart contract integration has not yet been setup.