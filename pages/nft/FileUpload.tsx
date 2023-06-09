import { Form, Input } from "antd";
import { useState, FunctionComponent, useMemo, useCallback } from "react"
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons";
import { pullAt } from 'lodash';

interface AttrValue { name: string, value: string }
interface MoreAttrType<T> {
    value?: T,
    onChange?: (value: T) => void;
}
const MoreAttr: FunctionComponent<MoreAttrType<AttrValue[]>> = ({
    value: attrValue = [{
        name: '',
        value: ''
    }], onChange
}) => {
    // const [attr, setAttr] = useState(value ?? [{
    //     name: '',
    //     value: ''
    // }]);



    const changeAttr = useCallback((index) => {
        if (index + 1 === attrValue?.length) {
            onChange?.([...attrValue, {
                name: '',
                value: ''
            }])
        } else {
            onChange?.(attrValue.filter((_, i) => (i !== index)))
        }

    }, [onChange, attrValue])

    const valueChange = (value: string, index: number, type?: string) => {
        let attrs = [];
        if (type === 'name') {
            attrs = attrValue?.map((item, i) => {
                if (i === index) {
                    return { ...item, name: value }
                }
                return item;
            })
        } else {
            attrs = attrValue?.map((item, i) => {
                if (i === index) {
                    return { ...item, value: value }
                }
                return item;
            })
        }
        onChange?.(attrs)
    }


    return (
        <div>
            {
                attrValue?.map((_, index) => {
                    return (
                        <div className="flex items-center flex-row mb-1" key={index}>

                            <div className="flex flex-1">
                                <div className="basis-1/2 pr-2">
                                    <Input
                                        // value={name}
                                        maxLength={32}
                                        placeholder="Please enter attribute name！"
                                        onChange={(e) => {
                                            valueChange(e?.target.value ?? '', index, 'name')
                                        }}
                                    />
                                </div>
                                <div className="basis-1/2 pr-2">
                                    <Input
                                        maxLength={256}
                                        // value={attrValue}
                                        placeholder="Please enter attribute value！"
                                        onChange={(e) => {
                                            valueChange(e?.target.value ?? '', index, 'value')
                                        }}
                                    />
                                </div>
                            </div>
                            <div
                                className="w-20px h-full flex items-center"
                                onClick={() => {
                                    changeAttr(index)
                                }}
                            >
                                {
                                    attrValue?.length !== index + 1 ?
                                        <MinusSquareOutlined rev={undefined} style={{ color: '#1677ff' }} /> :
                                        <PlusSquareOutlined rev={undefined} style={{ color: '#1677ff' }} />
                                }

                            </div>
                        </div>
                    )
                })
            }
        </div>
    )

}
const AttrInput: FunctionComponent<MoreAttrType<AttrValue>> = ({ value, onChange }) => {

    const { name = '', value: attrValue = '' } = value ?? {};
    const onValueChange = (v: string, type: string) => {
        if (type === 'name') {
            onChange?.({
                name: v,
                value: attrValue,
            })
        } else {
            onChange?.({
                name,
                value: v,
            })
        }
    }
    return (
        <div className="flex flex-1">
            <div className="basis-1/2 pr-2">
                <Input
                    // value={name}
                    placeholder="Please enter attribute name！"
                    onChange={(e) => {
                        onValueChange(e.target.value ?? '', 'name')
                    }}
                />
            </div>
            <div className="basis-1/2 pr-2">
                <Input
                    // value={attrValue}
                    placeholder="Please enter attribute value！"
                    onChange={(e) => {
                        onValueChange(e.target.value ?? '', 'value')
                    }}
                />
            </div>
        </div>
    )
}

export default MoreAttr;
