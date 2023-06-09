import {
  ContractTransaction,
  ContractInterface,
  BytesLike as Arrayish,
  BigNumber,
  BigNumberish,
} from 'ethers';
import { EthersContractContextV5 } from 'ethereum-abi-types-generator';

export type ContractContext = EthersContractContextV5<
  AirdropContract,
  AirdropContractMethodNames,
  AirdropContractEventsContext,
  AirdropContractEvents
>;

export declare type EventFilter = {
  address?: string;
  topics?: Array<string>;
  fromBlock?: string | number;
  toBlock?: string | number;
};

export interface ContractTransactionOverrides {
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
  /**
   * The price (in wei) per unit of gas
   */
  gasPrice?: BigNumber | string | number | Promise<any>;
  /**
   * The nonce to use in the transaction
   */
  nonce?: number;
  /**
   * The amount to send with the transaction (i.e. msg.value)
   */
  value?: BigNumber | string | number | Promise<any>;
  /**
   * The chain ID (or network ID) to use
   */
  chainId?: number;
}

export interface ContractCallOverrides {
  /**
   * The address to execute the call as
   */
  from?: string;
  /**
   * The maximum units of gas for the transaction to use
   */
  gasLimit?: number;
}
export type AirdropContractEvents = undefined;
export interface AirdropContractEventsContext {}
export type AirdropContractMethodNames =
  | 'multiTransferToken'
  | 'multiTransferETH'
  | 'getSum';
export interface AirdropContract {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param _token Type: address, Indexed: false
   * @param _addresses Type: address[], Indexed: false
   * @param _amounts Type: uint256[], Indexed: false
   */
  multiTransferToken(
    _token: string,
    _addresses: string[],
    _amounts: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: true
   * Constant: false
   * StateMutability: payable
   * Type: function
   * @param _addresses Type: address[], Indexed: false
   * @param _amounts Type: uint256[], Indexed: false
   */
  multiTransferETH(
    _addresses: string[],
    _amounts: BigNumberish[],
    overrides?: ContractTransactionOverrides
  ): Promise<ContractTransaction>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: pure
   * Type: function
   * @param _arr Type: uint256[], Indexed: false
   */
  getSum(
    _arr: BigNumberish[],
    overrides?: ContractCallOverrides
  ): Promise<BigNumber>;
}
