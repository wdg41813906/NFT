import { FunctionComponent } from "react";
// import { NftMeta, Nft } from "../../../../types/nft";
import advertisementItem from '../../../../../content/advertisement.json';

// type NftItemProps = {
//   item: Nft;
//   buyNft: (token: number, value: number) => Promise<void>;
// }


function shortifyAddress(address: string) {
    return `0x****${address.slice(-4)}`
}

const NftItem: FunctionComponent = () => {

    return (
        <div className="flex flex-col">
            {advertisementItem.map((item, index) => {
                return <span key={index}>{item.name + item.desc}</span>
            })}
        </div>
    )
}

export default NftItem;
