/* eslint-disable @next/next/no-img-element */

import type { NextPage } from 'next'
import { ChangeEvent, useState } from 'react';
import { BaseLayout } from '@ui'
import { Switch, Button, Input, Form, Upload, UploadFile, Select, message, Image, Spin } from 'antd'
import Link from 'next/link'
import { NftMeta, PinataRes } from '@_types/nft';
import axios from 'axios';
import { useWeb3 } from '@providers/web3';
import { ethers } from 'ethers';
import { toast } from "react-toastify";
import { useAccount, useListedNfts, useNetwork } from '@hooks/web3';
import { ExclamationIcon } from '@heroicons/react/solid';
import MoreAttr from './FileUpload';
import { ERC20_AIRDROP_TOKEN, ERC20_Token_Address } from 'pages/api/utils';
import { UploadChangeParam } from 'antd/es/upload';

// const ALLOWED_FIELDS = ["name", "description", "image", "attributes"];
const fileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
const NftCreate: NextPage = () => {
  const { ethereum, contract } = useWeb3();
  const { nfts } = useListedNfts();
  const { account } = useAccount();
  const [metaForm] = Form.useForm()
  const [priceForm] = Form.useForm()
  const { network } = useNetwork();
  const [nftURI, setNftURI] = useState("");
  const [price, setPrice] = useState("");
  const [hasURI, setHasURI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attr, setAttr] = useState<{ [key: string]: string }[]>([{
    attr: '',
    content: ''
  }]);
  const [nftMeta, setNftMeta] = useState<NftMeta>({
    name: "",
    description: "",
    image: "",
    type: "",
    createRole: "",
    custorm: [{ name: "", value: "" }],
  });

  const getSignedData = async () => {
    const messageToSign = await axios.get("/api/verify");
    const accounts = await ethereum?.request({ method: "eth_requestAccounts" }) as string[];
    const account = accounts[0];

    const signedData = await ethereum?.request({
      method: "personal_sign",
      params: [JSON.stringify(messageToSign.data), account, messageToSign.data.id]
    })

    return { signedData, account };
  }

  // const handleImageChange = (info: UploadChangeParam<UploadFile>) => {
  //   const { status } = info.file;
  //   if (status !== 'uploading') {
  //     setLoading(true);
  //   }
  //   if (status === 'done') {
  //     setLoading(false);
  //     message.success(`${info.file.name} file uploaded successfully.`);
  //   } else if (status === 'error') {
  //     setLoading(false);
  //     message.error(`${info.file.name} file upload failed.`);
  //   }
  // }

  // : UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
  //   if (info.file.status === 'uploading') {
  //     setLoading(true);
  //     return;
  //   }
  //   if (info.file.status === 'done') {
  //     // Get this url from response in real world.
  //     getBase64(info.file.originFileObj as RcFile, (url) => {
  //       setLoading(false);
  //       setImageUrl(url);
  //     });
  //   }
  // };

  const handleImage = async (file: any) => {
    const { type, size } = file;
    if (!fileTypes.includes(type)) {
      message.error('文件类型错误');
      return false;
    }
    if (size / 1024 / 1024 > 10) {
      message.error('图片大小不能超过10m');
      return false;
    }
    setLoading(true);
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    try {
      const { signedData, account } = await getSignedData();
      const promise = axios.post("/api/verify-image", {
        address: account,
        signature: signedData,
        bytes,
        contentType: file.type,
        fileName: file.name.replace(/\.[^/.]+$/, "")
      });

      const res = await toast.promise(
        promise, {
        pending: "Uploading image",
        success: "Image uploaded",
        error: "Image upload error"
      }
      )
      const data = res.data as PinataRes;
      setLoading(false);
      setNftMeta({
        ...nftMeta,
        image: `${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`
      });
    } catch (e: any) {
      setLoading(false);
      console.error(e.message);
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNftMeta({ ...nftMeta, [name]: value });
  }

  // const handleAttributeChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   const attributeIdx = nftMeta.attributes.findIndex(attr => attr.trait_type === name);

  //   nftMeta.attributes[attributeIdx].value = value;
  //   setNftMeta({
  //     ...nftMeta,
  //     attributes: nftMeta.attributes
  //   })
  // }

  const uploadMetadata = async (v: any) => {
    try {
      const { signedData, account } = await getSignedData();
      const { image } = nftMeta;
      const promise = axios.post("/api/verify", {
        address: account,
        signature: signedData,
        nft: { ...v, image }
      })

      const res = await toast.promise(
        promise, {
        pending: "Uploading metadata",
        success: "Metadata uploaded",
        error: "Metadata upload error"
      }
      )

      const data = res.data as PinataRes;
      setNftURI(`${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`);
    } catch (e: any) {
      console.error(e.message);
    }
  }

  const createNft = async () => {
    const erc20Adress = ERC20_Token_Address;
    const owners = ERC20_AIRDROP_TOKEN;
    try {
      // const nftRes = await axios.get(nftURI);
      // const content = nftRes.data;
      // debugger;
      // Object.keys(content).forEach(key => {
      //   if (!ALLOWED_FIELDS.includes(key)) {
      //     throw new Error("Invalid Json structure");
      //   }
      // })
      // 创建nft并空投30enb
      const tx = await contract?.mintToken(
        nftURI,
        ethers.utils.parseEther(price),
        erc20Adress,
        owners,
        [account.data] as string[],
        [30],
        {
          value: ethers.utils.parseEther(0.025.toString())
        });

      await toast.promise(
        tx!.wait(), {
        pending: "Minting Nft Token",
        success: "Nft has ben created",
        error: "Minting error"
      }
      );
    } catch (e: any) {
      console.error(e.message);
    }
  }

  if (!network.isConnectedToNetwork) {
    return (
      <BaseLayout>
        <div className="rounded-md bg-yellow-50 p-4 mt-10">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Attention needed</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  {network.isLoading ?
                    "Loading..." :
                    `Connect to ${network.targetNetwork}`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </BaseLayout>
    )
  }

  return (
    <BaseLayout>
      <div>
        <div className="py-4">
          {!nftURI &&
            <div className="flex">
              <div className="mr-2 font-bold underline">Do you have meta data already?</div>
              <Switch
                checked={hasURI ?? false}
                onChange={() => {
                  setHasURI(!hasURI)
                }}
              // className={`${hasURI ? 'bg-indigo-900' : 'bg-indigo-700'}
              //   relative inline-flex flex-shrink-0 h-[28px] w-[64px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              />

              {/* <div>
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`${hasURI ? 'translate-x-9' : 'translate-x-0'}
                    pointer-events-none inline-block h-[24px] w-[24px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                />
              </div> */}

            </div>
          }
        </div>
        {(nftURI || hasURI) ?
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">List NFT</h3>
                <p className="mt-1 text-sm text-gray-600">
                  This information will be displayed publicly so be careful what you share.
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <Form
                form={priceForm}
                layout='vertical'
              >
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  {hasURI &&
                    <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                      <div>
                        <label htmlFor="uri" className="block text-sm font-medium text-gray-700">
                          URI Link
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <Input
                            onChange={(e) => setNftURI(e.target.value)}
                            // type="text"
                            // name="uri"
                            // id="uri"
                            // className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                            placeholder="http://link.com/data.json"
                          />
                        </div>
                      </div>
                    </div>
                  }
                  {nftURI &&
                    <div className='mb-4 p-4'>
                      <div className="font-bold">Your metadata: </div>
                      <div>
                        <Link href={nftURI}>
                          <a className="underline text-indigo-600">
                            {nftURI}
                          </a>
                        </Link>
                      </div>
                    </div>
                  }
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price (ETH)
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <Input
                          onChange={(e) => setPrice(e.target.value)}
                          value={price}
                          type="number"
                          name="price"
                          id="price"
                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                          placeholder="0.8"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      onClick={createNft}
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      CreateNft
                    </button>
                  </div>
                </div>
              </Form>
              {/* <form>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  {hasURI &&
                    <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                      <div>
                        <label htmlFor="uri" className="block text-sm font-medium text-gray-700">
                          URI Link
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <Input
                            onChange={(e) => setNftURI(e.target.value)}
                            // type="text"
                            name="uri"
                            id="uri"
                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                            placeholder="http://link.com/data.json"
                          />
                        </div>
                      </div>
                    </div>
                  }
                  {nftURI &&
                    <div className='mb-4 p-4'>
                      <div className="font-bold">Your metadata: </div>
                      <div>
                        <Link href={nftURI}>
                          <a className="underline text-indigo-600">
                            {nftURI}
                          </a>
                        </Link>
                      </div>
                    </div>
                  }
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price (ETH)
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <Input
                          onChange={(e) => setPrice(e.target.value)}
                          value={price}
                          type="number"
                          name="price"
                          id="price"
                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                          placeholder="0.8"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      onClick={createNft}
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      List
                    </button>
                  </div>
                </div>
              </form> */}
            </div>
          </div>
          :
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Design Nft Meta</h3>
                <p className="mt-1 text-sm text-gray-600">
                  This information will be displayed publicly so be careful what you share.
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <Form
                form={metaForm}
                layout='vertical'
                onFinish={(v) => {
                  uploadMetadata({...v, createRole: account?.role})
                }}
              >
                <Form.Item
                  name='name'
                  label='name'
                  rules={[{ required: true, message: 'Please input NFT name!' }]}
                >
                  <Input
                    maxLength={256}
                    placeholder='Please enter a name'
                    autoComplete='off'
                  />
                </Form.Item>
                <Form.Item
                  name='description'
                  label='description'
                  rules={[{ required: true, message: 'Please input NFT description!' }]}
                >
                  <Input.TextArea
                    rows={3}
                    placeholder='Please enter NFT description...'
                  />
                </Form.Item>
                <Form.Item
                  name='type'
                  label='type'
                  rules={[{ required: true, message: 'Please select NFT type!' }]}
                  initialValue={'collection'}
                >
                  <Select
                    placeholder='Please select NFT type'
                    options={[
                      { value: 'collection', label: 'collection' },
                      { value: 'space', label: 'space' },
                      { value: 'organism', label: 'organism' },
                      { value: 'design', label: 'design' }
                    ]}
                  />
                </Form.Item>

                <div>
                  <Form.Item name='file-upload' label='Upload a file'>
                    <Upload.Dragger
                      beforeUpload={handleImage}
                      // onChange={handleImageChange}
                      disabled={loading}
                      itemRender={() => null}

                    >
                      <Spin className="space-y-1 text-center" spinning={loading}>

                        {
                          nftMeta.image ?

                            <div className="flex-shrink-0 h-24 overflow-hidden justify-center flex items-center">
                              <Image
                                rootClassName='h-full'
                                className={`w-full object-cover`}
                                style={{ height: '100%' }}
                                alt="NFT"
                                preview={false}
                                // width={200}
                                // height={200}
                                src={nftMeta?.image}
                              // fallback="data:image/png;base64,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"
                              />
                            </div> : <svg
                              className="mx-auto h-24 w-24 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                        }



                        <p className="pl-1">or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </Spin>
                    </Upload.Dragger>

                  </Form.Item>
                </div>

                <Form.Item name='custorm' label='Custom Attribute'>
                  <MoreAttr />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">submitMetaJson</Button>
                </Form.Item>
              </Form>
              {/* <form>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <Input
                          value={nftMeta.name}
                          onChange={handleChange}
                          // type="text"
                          name="name"
                          id="name"
                          // className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                          placeholder="Please enter a name"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <div className="mt-1">
                        <Input.TextArea
                          value={nftMeta.description}
                          onChange={handleChange}
                          id="description"
                          name="description"
                          rows={3}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                          placeholder="Some Advertising Space description..."
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Brief description of NFT
                      </p>
                    </div>
                    //Has Image?
                    {nftMeta.image ?
                      <img src={nftMeta.image} alt="" className="h-40" /> :
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Image</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                              >
                                <span>Upload a file</span>
                                <input
                                  onChange={handleImage}
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                          </div>
                        </div>
                      </div>
                    }
                    <div className="grid grid-cols-6 gap-6">
                    { nftMeta.attributes.map(attribute =>
                      <div key={attribute.trait_type} className="col-span-6 sm:col-span-6 lg:col-span-2">
                        <label htmlFor={attribute.trait_type} className="block text-sm font-medium text-gray-700">
                          {attribute.trait_type}
                        </label>
                        <input
                          onChange={handleAttributeChange}
                          value={attribute.value}
                          type="text"
                          name={attribute.trait_type}
                          id={attribute.trait_type}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    )}
                  </div>
                    <p className="text-sm !mt-2 text-gray-500">
                    Choose value from 0 to 100
                  </p>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      onClick={uploadMetadata}
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      List
                    </button>
                  </div>
                </div>
              </form> */}
            </div>
          </div>
        }
      </div>
    </BaseLayout>
  )
}

export default NftCreate
