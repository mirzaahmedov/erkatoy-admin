import type { FC } from "react";
import ReactQuill from "react-quill-new";

import "quill/dist/quill.snow.css";

export const QuillEditor: FC<ReactQuill.ReactQuillProps> = (props) => {
  return (
    <ReactQuill
      theme="snow"
      modules={{ toolbar: editorToolbarOptions }}
      {...props}
    />
  );
};

const editorToolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  ["link", "image"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];
