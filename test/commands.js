

const instance = await NftMarket.deployed();

instance.mintToken("https://gateway.pinata.cloud/ipfs/QmbiE5ZdZb97C7WuCmbSQ6o7yHn4FRroojwmGDLtevPHC7","500000000000000000", {value: "25000000000000000",from: accounts[0]})
instance.mintToken("https://gateway.pinata.cloud/ipfs/QmbTp4n88Yjj931Gg4qz4LYLuCSdQwCv6sn5u8fzs16KsBN","300000000000000000", {value: "25000000000000000",from: accounts[0]})