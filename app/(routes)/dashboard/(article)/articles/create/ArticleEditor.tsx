"use client";

import "@mantine/tiptap/styles.css";
import { Link, RichTextEditor } from "@mantine/tiptap";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { IconPhoto } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useRef, useState } from "react";
import { createClient } from "../../../../../_lib/supabase/client";
import classes from "./article-editor.module.css";

interface ArticleEditorProps {
  error?: React.ReactNode;
  onBlur: () => void;
  onChange: (value: string) => void;
  value: string;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const editor = useEditor({
    content: value,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Link.configure({
        HTMLAttributes: { rel: "noopener noreferrer" },
        openOnClick: false,
      }),
      Image.configure({ inline: false, allowBase64: false }),
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

  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      notifications.show({
        color: "red",
        message: "فقط فایل تصویری قابل آپلود است.",
      });
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      notifications.show({
        color: "red",
        message: "حجم تصویر باید کمتر از ۵ مگابایت باشد.",
      });
      return;
    }

    setUploadingImage(true);
    try {
      const supabase = createClient();
      const { data: userData, error: authError } =
        await supabase.auth.getUser();
      if (authError || !userData.user) {
        throw new Error("نشست مدیریتی معتبر نیست.");
      }

      const extension = file.name.split(".").pop()?.toLowerCase() || "webp";
      const storagePath = `${userData.user.id}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("article-images")
        .upload(storagePath, file, {
          cacheControl: "31536000",
          contentType: file.type,
          upsert: false,
        });
      if (uploadError) throw uploadError;

      const { data: imageUrl } = supabase.storage
        .from("article-images")
        .getPublicUrl(storagePath);

      editor
        ?.chain()
        .focus()
        .setImage({ src: imageUrl.publicUrl, alt: file.name })
        .run();
    } catch (uploadError) {
      notifications.show({
        color: "red",
        message:
          uploadError instanceof Error
            ? uploadError.message
            : "آپلود تصویر ناموفق بود.",
      });
    } finally {
      setUploadingImage(false);
    }
  };

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
            <RichTextEditor.Control
              aria-label="افزودن تصویر به مقاله"
              disabled={!editor?.isEditable || uploadingImage}
              interactive={!uploadingImage}
              onClick={() => fileInputRef.current?.click()}
              title="افزودن تصویر"
            >
              <IconPhoto
                size={16}
                stroke={1.8}
                opacity={uploadingImage ? 0.4 : 1}
              />
            </RichTextEditor.Control>
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
      <input
        accept="image/*"
        hidden
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          if (file) void handleImageFile(file);
          event.currentTarget.value = "";
        }}
        ref={fileInputRef}
        type="file"
      />
      {error && (
        <div className={classes.error} id="article-content-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
