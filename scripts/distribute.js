const { ethers } = require('hardhat');
const csv = require('csvtojson');
const BigNumber = require('@ethersproject/bignumber').BigNumber;

async function main() {
    const contractAddress = '0xa772A8C5Bb0D9723E3aF07652c0d6AD1C5BD4830';
    const csvPath = './data/genesiss_stone_snapshots_adjusted_3.csv';
    const users = await csv().fromFile(csvPath);
    const Comics = await ethers.getContractFactory('NibiruComicsPolygon');
    const comics = await Comics.attach(contractAddress);

    // loop through whitelist and mint tokens
    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        try {
            let txn = await comics._mintLoop(user.Address, user.Quantity, {
                gasLimit: BigNumber.from('1000000'),
            });
            await waitForTrnx(txn.hash);
            console.log(`${i}. Minted ${user.Quantity} NFT(s) for ${user.Address}`);
        } catch (error) {
            console.error(error);
        }
    }
}

const infuraUrl = 'https://polygon-mumbai.infura.io/v3/';
const provider = ethers.getDefaultProvider(infuraUrl, {
    infura: {
        projectId: '',
        projectSecret: '',
    },
});


async function waitForTrnx(hash) {
    const receipt = await provider.waitForTransaction(hash);
    if (receipt.status != 1) {
        const errMessage = `Error minting, stopping. Hash: ${hash}`;
        console.log(errMessage);
        throw new Error(errMessage);
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
