


import { useListedNfts } from "@hooks/web3";
import { FunctionComponent } from "react";
// import NftItem from "../item";
// import advertisementJson from '../../../../content/advertisement.json';
import advertisementSpaces from '../../../../../content/advertisementSpaces.json'
import ItemList from '../item';
import { Descriptions }from 'antd';

const NftList: FunctionComponent = () => {
    //   const { nfts } = useListedNfts();
    //   console.log('nfts', advertisementJson);

    return (
        <div className="flex flex-col">
            {advertisementSpaces?.map(nft => {
                // const items = { meta: nft }
                // console.log('item', nft);
                return (
                    <Descriptions title="User Info" key={nft.name}>
                        <Descriptions.Item label="UserName">Zhou Maomao</Descriptions.Item>
                        <Descriptions.Item label="Telephone">1810000000</Descriptions.Item>
                        <Descriptions.Item label="Live">Hangzhou, Zhejiang</Descriptions.Item>
                        <Descriptions.Item label="Remark">empty</Descriptions.Item>
                        <Descriptions.Item label="Address">
                            No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
                        </Descriptions.Item>
                    </Descriptions>
                    //   <div key = { nft.image } className = "flex flex-col rounded-lg shadow-lg overflow-hidden" >
                    //   <NftItem
                    //     item={items as any}
                    //     buyNft={nfts.buyNft}
                    //   />
                    // </div>
                )

            }

            )
            }
        </div >
    )
}

export default NftList;
