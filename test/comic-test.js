const { expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { ethers } = require('hardhat');
ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.ERROR);

describe('Comics', () => {
    const MAX_SUPPLY = 500;
    let owner, address1;
    let Comics, comics;

    before(async () => {
        [owner, address1] = await ethers.getSigners();
        Comics = await ethers.getContractFactory('NibiruComicsPolygon');
    });

    beforeEach(async () => {
        comics = await Comics.deploy();
        await comics.deployed();
    });

    it('should revert if non-owner calls setMaxSupply', async () => {
        await expectRevert(
            comics.connect(address1).setMaxSupply(MAX_SUPPLY),
            'Ownable: caller is not the owner'
        );
    });

    it('should update the max supply to the expected value', async () => {
        await comics.connect(owner).setMaxSupply(MAX_SUPPLY);
        expect(await comics.maxSupply()).to.eq(MAX_SUPPLY);
    });

});
