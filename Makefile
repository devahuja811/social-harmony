all:
	cd truffle && truffle compile && truffle migrate --network testnet --reset > migrate.output
	cp -R truffle/build/contracts ui/
	cp -R truffle/build/contracts seeder/
	cp truffle/migrate.output helper/	
	cd helper && node index.js
	cd seeder && node index.js

