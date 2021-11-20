import './App.css';
import Editor, { BeforeMount, Monaco, OnChange } from '@monaco-editor/react';

const language = 'plaintext';

function App() {
  const customPrompt = (monaco: Monaco) => {
    monaco.languages.registerCompletionItemProvider(language, {
      provideCompletionItems(model, position) {
        const text = model.getWordUntilPosition(position);

        const before = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        const word = {
          startLineNumber: position.lineNumber,
          startColumn: text.startColumn,
          endLineNumber: position.lineNumber,
          endColumn: text.endColumn,
        };

        let suggestions: any[] = [];

        //is after '[['
        if (before.lastIndexOf('[[') > before.lastIndexOf(']]'))
          suggestions = [
            ...suggestions,
            ...['module', 'collapse'].map((item) => {
              return {
                insertText: `${item}_wde`,
                kind: monaco.languages.CompletionItemKind.Function,
                label: item,
                range: word,
              };
            }),
          ];
        console.log(suggestions);

        return {
          suggestions,
        };
      },
    });
  };

  const handleEditorWillMount: BeforeMount = (monaco) => {
    customPrompt(monaco);
  };

  return (
    <div className="App">
      <Editor
        width={'50vw'}
        height={'100vh'}
        language={language}
        beforeMount={handleEditorWillMount}
      />
    </div>
  );
}

export default App;
