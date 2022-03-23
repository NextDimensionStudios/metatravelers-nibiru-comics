const fs = require('fs');
// const wait = require('wait');
const { ethers } = require('hardhat');
const csv = require('csvtojson');
// const BigNumber = require('@ethersproject/bignumber').BigNumber;

async function main() {
    const contractAddress = '0xa772A8C5Bb0D9723E3aF07652c0d6AD1C5BD4830';
    const csvPath = './data/MetaTravelers_Comics_Minting_List_-_Episode_2_Final.csv';
    const users = await csv().fromFile(csvPath);
    const Comics = await ethers.getContractFactory('NibiruComicsPolygon');
    const comics = await Comics.attach(contractAddress);
    const signer0 = await ethers.provider.getSigner(0);
    const nonce = await signer0.getTransactionCount();
    // loop through whitelist and mint tokens
    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        try {
            let txn = await comics._mintLoop(user.Address, user.Quantity, {
                nonce: nonce + i
            });
            await txn.wait();
            console.log(`${i + 2}. Minted ${user.Quantity} NFT(s) for ${user.Address}`);
            fs.appendFileSync('distribute_log.txt', `${i + 2}. Minted ${user.Quantity} NFT(s) for ${user.Address}\n`, function (err) {
                if (err) throw err;
            });
            // await wait(9000);
        } catch (error) {
            console.error(error);
            fs.appendFileSync('distribute_log.txt', 'missing\n', function (err) {
                if (err) throw err;
            });
        }
    }
}


// const infuraUrl = 'https://polygon-mainnet.infura.io/v3/837cb63ffadc4296869619fcdb832f98';
// const provider = ethers.getDefaultProvider(infuraUrl, {
//     infura: {
//         projectId: '837cb63ffadc4296869619fcdb832f98',
//         projectSecret: '1f40d17dd0284113a252a372113895e8',
//     },
// });


// async function waitForTrnx(hash) {
//     const receipt = await provider.waitForTransaction(hash);
//     if (receipt.status != 1) {
//         const errMessage = `Error minting, stopping. Hash: ${hash}`;
//         console.log(errMessage);
//         fs.appendFileSync('distribute_log.txt', errMessage);
//         throw new Error(errMessage);
//     }
// }

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
