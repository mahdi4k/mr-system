import { TablerIconsProps } from '@tabler/icons-react'
import './MenuItem.scss'

import React, { ReactNode } from 'react'
 

type Iprop = {
    icon?:JSX.Element
    title?:string
    action?:any
    isActive?:any
}
export default ({
    icon, title, action, isActive = null,
}:Iprop) => (
    <button
        className={`menu-item${isActive && isActive() ? ' is-active' : ''}`}
        onClick={action}
        title={title}
    >
        {icon}
    </button>
)