"use client"
import React, { useRef } from 'react'
import Editor, { DiffEditor, useMonaco, loader, Monaco } from '@monaco-editor/react';
function CodeEditor() {
    const editorRef = useRef<any>(null);

    function handleEditorDidMount(editor: any, monaco: Monaco) {
        editorRef.current = editor;
    }

    function showValue() {
        alert(editorRef.current.getValue());
    }
    return (
        <div className="bg-red-500 h-full w-full absolute top-0 left-0">
            <Editor
                height="100%"
                width={"100%"}
                defaultLanguage="javascript"
                defaultValue="// some comment"
                onMount={handleEditorDidMount}
                theme='vs-dark'
                options={{
                    automaticLayout: true,
                    mouseWheelZoom: true,
                    editContext: true,
                    fontSize: 24
                }}
            />
        </div>
    )
}

export default CodeEditor