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

## Notes

- A duration needs to be specified.
  - Would be nice for users to have the option as to the duration but we also want it to be as simple as possible so any smart contract wallet could integrate it. 
  - Would be ideal if a default duration is picked and it can either be automatically renewed or some kind of reminder is sent to the user for renewal.
- Compound cannot currently be insured on Nexus Mutual as it's hit a cap. Let's assume that this will be fixed in the future and continue as if it works.
- Can't get a nexus mutual quote from a smart contract call, so will have to be done with an api call.
- Do we need to query every single token for positions?
- dYdX will not have a straight forward approach to query a user's balance
  - https://api.dydx.exchange/v1/accounts/<address> will return JSON of all accounts
  - Then I can query the accounts and add together the balances
  - Then I'll have to calculate their values in Dai based on market id
- We'll start with only Compound since it has the clearest docs
  - Ironically though Compound is the only contract that can't currently be insured.