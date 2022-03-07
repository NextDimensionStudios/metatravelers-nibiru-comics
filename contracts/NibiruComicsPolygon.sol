// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

/**
████████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████████
██████████████████████████████▓╝╘███████████████████████████████
████████████████████████████▓▓    ▓█████████████████████████████
██████████████████████▓▀╙              ╙▀▓██████████████████████
███████████████████▀"     ,▄▄▄▄▄▄▄▄▄▄,     "▀███████████████████
████████████████▓╜    ▄█████████████████▓w    ╙█████████████████
██████████████▓┘   ╔███████████████████████▓╕   └███████████████
█████████████▓   ╓██▓╝``╙▓████████████▓╩```██▓,   ▀█████████████
████████████╝   ▄███▓     `▀████████▓"     ████▄   ▐████████████
███████████▓   ▓████▓   ╒    ▀███▓▀        █████▓   ▀███████████
██████████▓   ▐█████▓   ]▓▄    ╙╝    ▄▓[   █████▓L   ███████████
█████████▓╝   ██████▓   ]███▓,    ,▓██▓[   ██████▓   ╚██████████
███████Ü      ███████▓▓▓▓▓▓▓▓▓r   ▓▓▓▓▓▓▓▓▓██████▓      ║███████
████████▓▄╖   ██████▓                      ██████▓   ╓▄█████████
██████████▓   ▐██████▓&&&&&&&&    &&&&&&&&▄█████▓F   ███████████
███████████@   █████▓                      █████▓   ▐███████████
███████████▓L   █████▄╥▄▄▄▄▄╥╓    ▄▄▄▄▄▄▄▄▄████▓   ╔████████████
█████████████N   ▀████████████r   ███████████▓╝   ▄█████████████
██████████████▓    ▀██████████▓▄▄██████████▓╝   ,███████████████
████████████████▓,   "▀▓████████████████▓╝    ,▄████████████████
███████████████████▄      "╙▀▀▓▓▓▀▀▀╩"     ,▄███████████████████
██████████████████████▓▄µ              ╓▄███████████████████████
█████████████████████████████▓    ██████████████████████████████
██████████████████████████████▓,,███████████████████████████████
████████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████████
 */

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NibiruComicsPolygon is ERC721, Ownable {
    using Strings for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private supply;

    string public uriPrefix = "";
    uint256 public maxSupply;

    constructor() ERC721("Metatravelers: Nibiru Comics", "NBRUCOM") {}

    function totalSupply() public view returns (uint256) {
        return supply.current();
    }

    function walletOfOwner(address _owner)
        external
        view
        returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory ownedTokenIds = new uint256[](ownerTokenCount);
        uint256 currentTokenId = 1;
        uint256 ownedTokenIndex = 0;

        while (
            ownedTokenIndex < ownerTokenCount && currentTokenId <= maxSupply
        ) {
            address currentTokenOwner = ownerOf(currentTokenId);

            if (currentTokenOwner == _owner) {
                ownedTokenIds[ownedTokenIndex] = currentTokenId;

                ownedTokenIndex++;
            }

            currentTokenId++;
        }

        return ownedTokenIds;
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(_tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        _tokenId.toString()
                    )
                )
                : "";
    }

    function setMaxSupply(uint256 _maxSupply) external onlyOwner {
        maxSupply = _maxSupply;
    }

    function setUriPrefix(string memory _uriPrefix) external onlyOwner {
        uriPrefix = _uriPrefix;
    }

    function _mintLoop(address _receiver, uint256 _mintAmount)
        external
        onlyOwner
    {
        for (uint256 i = 0; i < _mintAmount; i++) {
            require(supply.current() < maxSupply, "Minting supply limit reached");
            supply.increment();
            _safeMint(_receiver, supply.current());
        }
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return uriPrefix;
    }
}
