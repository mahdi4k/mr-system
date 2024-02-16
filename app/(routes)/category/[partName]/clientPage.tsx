"use client"

import UseCategoryPage from '@/_utils/customHook/useCategoryPage'
import { Container } from '@mantine/core'
import React from 'react'
type Iprop = 'motherboard' | 'cpu' | 'graphic' | 'power'



const ClientPage = ({ partName }: { partName: Iprop }) => {
    const CategoryItem = UseCategoryPage(partName)
    return (

        <Container styles={{ root: { flex: '1 0 auto',width:'100%' } }} size={'lg'}>
            {CategoryItem}
        </Container>

    )
}

export default ClientPage