require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-web3')
require('@nomiclabs/hardhat-etherscan')

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
	defaultNetwork: 'hardhat',
	networks: {
		hardhat: {},
		mumbai: {
			url: 'https://rpc-mumbai.maticvigil.com',
			accounts: [''],
		},
		matic: {
			url: 'https://polygon-rpc.com/',
			accounts: [''],
		},
	},
	etherscan: {
		// Your API key for Etherscan
		// Obtain one at https://etherscan.io/
		apiKey: '',
	},
	solidity: {
		compilers: [
			{
				version: '0.4.24',
			},
			{
				version: '0.6.6',
				settings: {
					optimizer: {
						enabled: true,
						runs: 0,
					},
				},
			},
			{
				version: '0.6.12',
				settings: {
					optimizer: {
						enabled: true,
					},
				},
			},
			{
				version: '0.7.6',
				settings: {
					optimizer: {
						enabled: true,
						runs: 0,
					},
				},
			},
			{
				version: '0.8.7',
				settings: {
					optimizer: {
						enabled: true,
						runs: 0,
					},
				},
			},
			{
				version: '0.8.0',
				settings: {
					optimizer: {
						enabled: true,
						runs: 0,
					},
				},
			},
		],
	},
}
