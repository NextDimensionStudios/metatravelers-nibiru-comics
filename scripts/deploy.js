const hre = require('hardhat')

const whitelist = [
	['0x307919c85E1545C2AA2f6276dA1B60DB04648A71', 1],
	['0x3e4EfeB5BC5f67D8B61EAee5aC61cac6b6ff31E3', 1],
	['0x1e19AF366e564055E3973952459B2f39d05F1eda', 1],
]

async function main() {
	// deploy the contract
	const ComicsFactory = await hre.ethers.getContractFactory(
		'NibiruComicsPolygon'
	)
	const comics = await ComicsFactory.deploy()
	await comics.deployed()
	console.log('Nibiru Comics deployed to:', comics.address)

	// set the supply
	try {
		let maxSupply = '2' // change this value to the max supply you want to set
		let txn = await comics.setMaxSupply(maxSupply)
		await txn.wait()
		console.log('Max supply set to:', maxSupply)
	} catch (error) {
		console.error(error)
	}

	// set tokenURI here

	// loop through whitelist and mint tokens
	for (const [address, amount] of whitelist) {
		try {
			let txn = await comics._mintLoop(address, amount)
			await txn.wait()
			console.log('Minted NFT(s) for', address)
		} catch (error) {
			console.error(error)
		}
	}
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error)
		process.exit(1)
	})
