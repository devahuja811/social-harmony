all:
	cd truffle && truffle compile && truffle migrate --network testnet --reset
	cp -R truffle/build/contracts ui/contracts

