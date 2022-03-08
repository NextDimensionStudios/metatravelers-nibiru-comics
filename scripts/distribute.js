const { ethers } = require('hardhat');
const csv = require('csvtojson');
const BigNumber = require('@ethersproject/bignumber').BigNumber;
const wait = require('wait');

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
            await txn.wait();
            console.log(`${i}. Minted ${user.Quantity} NFT(s) for ${user.Address}`);
            await wait(12000);
        } catch (error) {
            console.error(error);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
