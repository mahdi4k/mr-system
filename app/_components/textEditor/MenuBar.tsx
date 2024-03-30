import './MenuBar.scss'

import React, { Fragment } from 'react'
import MenuItem from './MenuItem'
import { IconArrowBackUp, IconArrowForwardUp, IconBlockquote, IconBold, IconClearFormatting, IconCode, IconH1, IconH2, IconHighlight, IconItalic, IconList, IconListDetails, IconListNumbers, IconPilcrow, IconSeparator, IconStrikethrough, IconTextWrap } from '@tabler/icons-react'
import { Editor } from '@tiptap/react'


export default ({ editor }:{editor:Editor}) => {
    const items = [
        {
            icon: <IconBold/>,
            title: 'Bold',
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: () => editor.isActive('bold'),
        },
        {
            icon: <IconItalic/>,
            title: 'Italic',
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: () => editor.isActive('italic'),
        },
        {
            icon: <IconStrikethrough/>,
            title: 'Strike',
            action: () => editor.chain().focus().toggleStrike().run(),
            isActive: () => editor.isActive('strike'),
        },
        {
            icon: <IconCode/>,
            title: 'Code',
            action: () => editor.chain().focus().toggleCode().run(),
            isActive: () => editor.isActive('code'),
        },
        {
            icon: <IconHighlight/>,
            title: 'Highlight',
            action: () => editor.chain().focus().toggleHighlight().run(),
            isActive: () => editor.isActive('highlight'),
        },
        {
            type: 'divider',
        },
        {
            icon: <IconH1/>,
            title: 'Heading 1',
            action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: () => editor.isActive('heading', { level: 1 }),
        },
        {
            icon: <IconH2/>,
            title: 'Heading 2',
            action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: () => editor.isActive('heading', { level: 2 }),
        },
        {
            icon: <IconPilcrow/>,
            title: 'Paragraph',
            action: () => editor.chain().focus().setParagraph().run(),
            isActive: () => editor.isActive('paragraph'),
        },
        {
            icon: <IconList/>,
            title: 'Bullet List',
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: () => editor.isActive('bulletList'),
        },
        {
            icon: <IconListNumbers/>,
            title: 'Ordered List',
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: () => editor.isActive('orderedList'),
        },
        {
            icon: <IconListDetails/>,
            title: 'Task List',
            action: () => editor.chain().focus().toggleTaskList().run(),
            isActive: () => editor.isActive('taskList'),
        },
        {
            icon: <IconCode/>,
            title: 'Code Block',
            action: () => editor.chain().focus().toggleCodeBlock().run(),
            isActive: () => editor.isActive('codeBlock'),
        },
        {
            type: 'divider',
        },
        {
            icon: <IconBlockquote/>,
            title: 'Blockquote',
            action: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: () => editor.isActive('blockquote'),
        },
        {
            icon: <IconSeparator/>,
            title: 'Horizontal Rule',
            action: () => editor.chain().focus().setHorizontalRule().run(),
        },
        {
            type: 'divider',
        },
        {
            icon: <IconTextWrap/>,
            title: 'Hard Break',
            action: () => editor.chain().focus().setHardBreak().run(),
        },
        {
            icon: <IconClearFormatting/>,
            title: 'Clear Format',
            action: () => editor.chain().focus().clearNodes().unsetAllMarks()
                .run(),
        },
        {
            type: 'divider',
        },
        {
            icon: <IconArrowBackUp/>,
            title: 'Undo',
            action: () => editor.chain().focus().undo().run(),
        },
        {
            icon: <IconArrowForwardUp/>,
            title: 'Redo',
            action: () => editor.chain().focus().redo().run(),
        },
    ]

    return (
        <div className="editor__header">
            {items.map((item, index) => (
                <Fragment key={index}>
                    {item.type === 'divider' ? <div className="divider" /> : <MenuItem {...item} />}
                </Fragment>
            ))}
        </div> 
    )
}