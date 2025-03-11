import React, { useState,useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ editorContent,setEditorContent,initialContent }) => {
  // const [editorContent, setEditorContent] = useState(initialContent);
  const handleChange = (content) => {
    setEditorContent(content);
  };
  useEffect(() => {
    setEditorContent(initialContent);
  }, []);


  return (
    <div>
   
    <ReactQuill
        value={editorContent}
        onChange={handleChange}
        modules={RichTextEditor.modules}
        formats={RichTextEditor.formats}
        placeholder="Start writing..."
      />
    </div>
  );
};

// Modules and formats for the toolbar
RichTextEditor.modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    ['clean'],
    [{ 'align': [] }]
  ],
};

RichTextEditor.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video',
  'align'
];

export default RichTextEditor;
