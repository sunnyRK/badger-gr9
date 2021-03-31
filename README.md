# Idle Finance & Badger Sett Vault Strategy

## Solution

I have used Idle finance interface `ILendingProtocol` to starture for strategy.

Where strategy consumes a `Badger` token and internall it will call `deposit` or `withdraw` of BarnBridge and buy or sell BarnBridge bBadger token and earn apy.

## IdleBadger Strategy Code and test case:

`Strategy:` You can find code in `contracts/wrappers/IdleBadger.sol` path.  
[Clieck here to go strategy code](https://github.com/sunnyRK/badger-gr9/blob/master/contracts/wrappers/IdleBadger.sol)


`Test-case:` You can find test case in `test/idleBadger-test.js` path.  
[Click here to go test cases](https://github.com/sunnyRK/badger-gr9/blob/master/test/idleBadger-test.js)  

## Run

`Download code`
1). Clone repo

`Install dependency`
2). yarn

`to run on mainnet fork`  
3). npx hardhat test --network hardhat

## Contact

[Twitter](https://twitter.com/RadadiyaSunny)  
`Discord: sunny#3937` 




