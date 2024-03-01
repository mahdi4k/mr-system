import { Checkbox, Flex } from '@mantine/core'
import Image from 'next/image'
import React, { FC } from 'react'

type Iprops = {
    value: string[],
    setValue: React.Dispatch<React.SetStateAction<string[]>>

}

const AmdOrIntelFilter: FC<Iprops> = ({ value, setValue }) => {

    return (
        <Checkbox.Group value={value} onChange={setValue}>
            <Flex justify={'center'} align={'center'}>
                <Checkbox
                    ml={'auto'}
                    label={<Image alt='amd kiwi part' width={40} height={15} src={'/amd.png'} />}
                    value={'amd'}
                />
                <Checkbox
                    label={<Image alt='intel kiwi part' width={40} height={20} src={'/intel.png'}/>}
                    value={'intel'}
                />
            </Flex>
        </Checkbox.Group>
    )
}

export default AmdOrIntelFilter