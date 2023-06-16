import { useListedNfts } from "@hooks/web3";
import { FunctionComponent, useMemo } from "react";
import NftItem from "../item";


const NftList: FunctionComponent = () => {
    const { nfts } = useListedNfts();
    const { data } = nfts;
    // { value: 'platform', label: 'platform' },
    // { value: 'internetCelebrity', label: 'internetCelebrity' },
    // { value: 'brand', label: 'brand' },
    // { value: 'buyer', label: 'buyer' },
    const newNfts = useMemo(() => {
        const newData = data?.filter((item) => item?.meta.createRole === 'buyer');
        return { ...nfts, data: newData }
    }, [data, nfts])
    return (
        <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
            {newNfts?.data?.map((nft, i) => {
                // const items = { meta: nft }
                return (
                    <div key={i} className="flex flex-col rounded-lg shadow-lg overflow-hidden max-w-xs" >
                        <NftItem
                            item={nft as any}
                            buyNft={nfts.buyNft}
                        />
                    </div>
                )
            }
            )
            }
        </div >
    )
}

export default NftList;
