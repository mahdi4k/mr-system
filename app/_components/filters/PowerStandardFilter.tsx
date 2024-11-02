import { Checkbox, Flex } from '@mantine/core'
import React, { FC } from 'react'

type Iprops = {
    value: string[],
    setValue: React.Dispatch<React.SetStateAction<string[]>>

}
const PowerStandardFilter: FC<Iprops> = ({ value, setValue }) => {
    return (
        <Checkbox.Group value={value} onChange={setValue}>
            <Flex justify={'center'} align={'center'}>
                <Checkbox
                    pl={'lg'}

                    styles={{ label: { paddingRight: '4px' } }}
                    label={'استاندارد'}
                    value={'standard'}
                />
                <Checkbox
                    pl={'lg'}
                    styles={{ label: { paddingRight: '4px' } }}
                    label={'برنز'}
                    value={'bronze'}
                />

                <Checkbox
                    styles={{ label: { paddingRight: '4px' } }}
                    label={'گلد'}
                    value={'gold'}
                />
            </Flex>
        </Checkbox.Group>
    )
}

export default PowerStandardFilter