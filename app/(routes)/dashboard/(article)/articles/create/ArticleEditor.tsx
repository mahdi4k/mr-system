"use client";

import "@mantine/tiptap/styles.css";
import { Link, RichTextEditor } from "@mantine/tiptap";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import classes from "./article-editor.module.css";

interface ArticleEditorProps {
  error?: React.ReactNode;
  onBlur: () => void;
  onChange: (value: string) => void;
  value: string;
}

const labels = {
  alignCenterControlLabel: "تراز وسط",
  alignJustifyControlLabel: "تراز دو طرف",
  alignLeftControlLabel: "تراز چپ",
  alignRightControlLabel: "تراز راست",
  blockquoteControlLabel: "نقل قول",
  boldControlLabel: "پررنگ",
  bulletListControlLabel: "فهرست نشانه‌دار",
  clearFormattingControlLabel: "حذف قالب‌بندی",
  codeBlockControlLabel: "بلوک کد",
  codeControlLabel: "کد",
  h2ControlLabel: "عنوان سطح ۲",
  h3ControlLabel: "عنوان سطح ۳",
  h4ControlLabel: "عنوان سطح ۴",
  hrControlLabel: "خط جداکننده",
  italicControlLabel: "مورب",
  linkControlLabel: "افزودن پیوند",
  linkEditorExternalLink: "باز شدن در زبانه جدید",
  linkEditorInputLabel: "نشانی پیوند",
  linkEditorInputPlaceholder: "https://example.com",
  linkEditorInternalLink: "باز شدن در همین زبانه",
  linkEditorSave: "ذخیره",
  orderedListControlLabel: "فهرست شماره‌دار",
  redoControlLabel: "انجام دوباره",
  strikeControlLabel: "خط‌خورده",
  undoControlLabel: "واگرد",
  unlinkControlLabel: "حذف پیوند",
};

export default function ArticleEditor({
  error,
  onBlur,
  onChange,
  value,
}: ArticleEditorProps) {
  const editor = useEditor({
    content: value,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Link.configure({
        HTMLAttributes: { rel: "noopener noreferrer" },
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: "متن مقاله را بنویسید...",
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    onBlur,
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.isEmpty ? "" : currentEditor.getHTML());
    },
  });

  return (
    <div>
      <RichTextEditor
        aria-describedby={error ? "article-content-error" : undefined}
        aria-invalid={Boolean(error)}
        className={classes.editor}
        editor={editor}
        labels={labels}
      >
        <RichTextEditor.Toolbar sticky stickyOffset={0}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignRight />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignLeft />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Code />
            <RichTextEditor.CodeBlock />
            <RichTextEditor.Undo />
            <RichTextEditor.Redo />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>
      {error && (
        <div className={classes.error} id="article-content-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
