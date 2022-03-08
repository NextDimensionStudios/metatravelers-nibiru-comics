const hre = require('hardhat');

async function main() {
    const tokenURI = 'ipfs://QmbmwzNK3adHuMkM1BFdqEdp7e7Le8W7SCUpGyZ7PfSyDD/';
    const maxSupply = '500';

    // Deploy the contract
    const ComicsFactory = await hre.ethers.getContractFactory(
        'NibiruComicsPolygon'
    );
    const comics = await ComicsFactory.deploy();
    await comics.deployed();
    console.log('Nibiru Comics deployed to:', comics.address);

    // Set the supply
    try {
        let txn = await comics.setMaxSupply(maxSupply);
        await txn.wait();
        console.log('Max supply set to:', maxSupply);
    } catch (error) {
        console.error(error);
    }

    // Set the tokenURI
    try {
        let txn = await comics.setUriPrefix(tokenURI);
        await txn.wait();
        console.log('tokenURI set to:', tokenURI);
    } catch (error) {
        console.error(error);
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
