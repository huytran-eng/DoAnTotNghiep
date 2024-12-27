/* eslint-disable react/prop-types */
import Editor from '@monaco-editor/react';


export default function CodeEditor(props) {
  const { language, value, onChange } = props;
  return (
    <Editor
      height="100%"
      language= {language}
      value={value}
      onChange={(value) => onChange(value || '')}
      theme="vs-light"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        automaticLayout: true,
        scrollBeyondLastLine: false,
      }}
    />
  );
}