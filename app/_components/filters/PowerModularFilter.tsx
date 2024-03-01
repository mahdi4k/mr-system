import { Checkbox, Flex } from '@mantine/core'
import React, { FC } from 'react'

type Iprops = {
    value: string[],
    setValue: React.Dispatch<React.SetStateAction<string[]>>

}
const PowerModularFilter: FC<Iprops> = ({ value, setValue }) => {
    return (
        <Checkbox.Group value={value} onChange={setValue}>
            <Flex justify={'center'} align={'center'}>
                <Checkbox
                                    pl={'lg'}

                    styles={{ label: { paddingRight: '4px' } }}
                    label={'ماژولار'}
                    value={'3'}
                />
                <Checkbox
                    pl={'lg'}
                    styles={{ label: { paddingRight: '4px' } }}
                    label={'نیمه ماژولار'}
                    value={'2'}
                />

                <Checkbox
                    styles={{ label: { paddingRight: '4px' } }}
                    label={'غیر ماژولار'}
                    value={'1'}
                />
            </Flex>
        </Checkbox.Group>
    )
}

export default PowerModularFilter