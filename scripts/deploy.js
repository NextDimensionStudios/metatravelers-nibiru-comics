const hre = require('hardhat')

const whitelist = [
	['0x307919c85E1545C2AA2f6276dA1B60DB04648A71', 10],
	['0x3e4EfeB5BC5f67D8B61EAee5aC61cac6b6ff31E3', 5],
	['0x1e19AF366e564055E3973952459B2f39d05F1eda', 7],
]

async function main() {
	const ComicsFactory = await hre.ethers.getContractFactory(
		'NibiruComicsPolygon'
	)
	const comics = await ComicsFactory.deploy()

	await comics.deployed()

	console.log('Nibiru Comics deployed to:', comics.address)

	// set tokenURI here

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
