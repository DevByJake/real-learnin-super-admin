import React, { useEffect, useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Code2,
  Minus,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
  Palette,
  Check,
} from "lucide-react";
import "./editor.css";

interface TiptapProps {
  content?: string;
  setContent?: (content: string) => void;
  placeholder?: string;
}

const PRESET_COLORS = [
  { name: "Default", value: "" },
  { name: "Brand Orange", value: "#fb923c" },
  { name: "Success Green", value: "#34d399" },
  { name: "Sky Blue", value: "#38bdf8" },
  { name: "Crimson Red", value: "#f87171" },
  { name: "Purple Accent", value: "#a855f7" },
  { name: "Muted Slate", value: "#94a3b8" },
  { name: "Light Text", value: "#f8fafc" },
];

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  if (!editor) {
    return null;
  }

  const activeColor = editor.getAttributes("textStyle").color || "";

  const getCurrentHeadingValue = () => {
    if (editor.isActive("heading", { level: 1 })) return "h1";
    if (editor.isActive("heading", { level: 2 })) return "h2";
    if (editor.isActive("heading", { level: 3 })) return "h3";
    return "p";
  };

  const handleHeadingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "p") {
      editor.chain().focus().setParagraph().run();
    } else if (value.startsWith("h")) {
      const level = parseInt(value.substring(1), 10) as 1 | 2 | 3;
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };

  return (
    <div className="editor-toolbar" role="toolbar" aria-label="Text Formatting Options">
      {/* Undo & Redo */}
      <div className="editor-toolbar-group">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="editor-toolbar-btn"
          title="Undo (Ctrl + Z)"
        >
          <Undo className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="editor-toolbar-btn"
          title="Redo (Ctrl + Y)"
        >
          <Redo className="h-4 w-4" />
        </button>
      </div>

      <div className="editor-toolbar-divider" />

      {/* Headings Selector */}
      <div className="editor-toolbar-group">
        <select
          value={getCurrentHeadingValue()}
          onChange={handleHeadingChange}
          className="bg-[#0D0E14] border border-[#1F2230] text-[#F8FAFC] text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#FB923C] cursor-pointer"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
      </div>

      <div className="editor-toolbar-divider" />

      {/* Basic Text Formatting */}
      <div className="editor-toolbar-group">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`editor-toolbar-btn ${editor.isActive("bold") ? "is-active" : ""}`}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`editor-toolbar-btn ${editor.isActive("italic") ? "is-active" : ""}`}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`editor-toolbar-btn ${editor.isActive("strike") ? "is-active" : ""}`}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`editor-toolbar-btn ${editor.isActive("code") ? "is-active" : ""}`}
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </button>
      </div>

      <div className="editor-toolbar-divider" />

      {/* Color Picker */}
      <div className="editor-toolbar-group relative">
        <button
          type="button"
          onClick={() => setShowColorPicker(!showColorPicker)}
          className={`editor-toolbar-btn relative flex items-center justify-center ${
            activeColor ? "text-[#FB923C] bg-[#FB923C]/10" : ""
          }`}
          title="Text Color"
        >
          <Palette className="h-4 w-4" />
          {activeColor && (
            <span
              className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-[2px] rounded-full"
              style={{ backgroundColor: activeColor }}
            />
          )}
        </button>

        {showColorPicker && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowColorPicker(false)} />
            <div className="absolute top-full left-0 mt-2 w-52 bg-[#12131C] border border-[#171923] rounded-xl shadow-2xl p-3 z-50 space-y-2">
              <span className="text-[11px] font-semibold text-[#94A3B8] block">Text Color</span>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_COLORS.map((color) => {
                  const isActive = color.value ? activeColor === color.value : !activeColor;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => {
                        if (color.value) {
                          editor.chain().focus().setColor(color.value).run();
                        } else {
                          editor.chain().focus().unsetColor().run();
                        }
                        setShowColorPicker(false);
                      }}
                      className="h-7 w-7 rounded-full border border-[#1F2230] flex items-center justify-center transition-transform hover:scale-105"
                      style={{ backgroundColor: color.value || "#0D0E14" }}
                      title={color.name}
                    >
                      {isActive && <Check className="h-3.5 w-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="editor-toolbar-divider" />

      {/* Lists */}
      <div className="editor-toolbar-group">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`editor-toolbar-btn ${editor.isActive("bulletList") ? "is-active" : ""}`}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`editor-toolbar-btn ${editor.isActive("orderedList") ? "is-active" : ""}`}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
      </div>

      <div className="editor-toolbar-divider" />

      {/* Blocks & Separators */}
      <div className="editor-toolbar-group">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`editor-toolbar-btn ${editor.isActive("blockquote") ? "is-active" : ""}`}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`editor-toolbar-btn ${editor.isActive("codeBlock") ? "is-active" : ""}`}
          title="Code Block"
        >
          <Code2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="editor-toolbar-btn"
          title="Horizontal Rule"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default function Tiptap({ content, setContent }: TiptapProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color.configure({ types: ["textStyle"] }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      setContent?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && !editor.isFocused && content !== undefined && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="editor-wrapper">
      <MenuBar editor={editor} />
      <div className="editor-content-area">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
