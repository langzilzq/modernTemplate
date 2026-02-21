import { Editable, withReact, useSlate, Slate, ReactEditor } from 'slate-react';
import { Editor, createEditor, Descendant, Transforms, Text, Range } from 'slate';
import React, { useMemo, useCallback, useEffect, useRef, memo, PropsWithChildren } from 'react';
import { withHistory } from 'slate-history';
import ReactDOM from 'react-dom';
import { useDebounceFn, useThrottleFn } from '@/hooks';
import { isBrowser } from '@/utils/judgedEnvironment';
import { ENGLISH_REG, UPPER_CASE_ENGLISH_REG } from '@/utils';

interface RichTextProps {
  value: string;
  formatValue?: string;
  readonly?: boolean;
  isTranslation?: boolean;
  onChange?: (value: string) => void;
  termArr?: any[];
}

const initSlateValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }]
  }
];

const RichText = (props: RichTextProps) => {
  const { value, readonly = false, formatValue = '', isTranslation = false, onChange, termArr = [] } = props;
  // @ts-ignore
  const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.underline) {
      return (
        <span
          {...attributes}
          className={`slate-editor-underline ${leaf.type === 'user' ? 'slate-editor-underline-user' : ''}`}
          onClick={() => {
            // underlineWordFn?.(isTranslation, leaf.text, true);
          }}
        >
          {children}
        </span>
      );
    }

    const { childSentence, sentence } = leaf;
    let classNameNum = '';
    if (typeof childSentence === 'number' && typeof sentence === 'number') {
      classNameNum = `${sentence}${childSentence}`;
    }
    if (isTranslation) {
      attributes.onMouseEnter = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        let { target } = e;
        let { dataset } = target;

        while (dataset?.slateNode !== 'text') {
          target = target.parentElement;
          const { dataset: parentDataset } = target;
          dataset = parentDataset;
        }
        target.classList.add('slate-editor-element');
        const res = document.getElementsByClassName(classNameNum);
        if (res.length) {
          res[0]?.parentElement?.classList.add('slate-editor-element');
        }
      };
      attributes.onMouseLeave = (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        let { target } = e;
        let { dataset } = target;

        while (dataset?.slateNode !== 'text') {
          target = target.parentElement;
          const { dataset: parentDataset } = target;
          dataset = parentDataset;
        }
        target.classList.remove('slate-editor-element');
        const res = document.getElementsByClassName(classNameNum);
        if (res.length) {
          res[0]?.parentElement?.classList.remove('slate-editor-element');
        }
      };
    } else {
      attributes.className = classNameNum;
    }

    return <span {...attributes}>{children}</span>;
  };
  // @ts-ignore
  const renderLeaf = useCallback(eleprops => <Leaf {...eleprops} />, []);

  const editor = useMemo(() => withTextLimit(withHistory(withReact(createEditor()))), []);

  const editorChange = (values: Descendant[]) => {
    // Check the word
    // if (chooseToSeekDict) {
    //   const { selection } = editor;
    //   if (selection) {
    //     const { anchor = { offset: 0 }, focus = { offset: 0 } } = selection;
    //     if (anchor.offset !== focus.offset) {
    //       underlineWordFn?.(isTranslation);
    //     }
    //   }
    // }
    if (isTranslation) {
      return;
    }
    let originalText = '';
    values.forEach((item: any, itemIndex: number) => {
      item.children.forEach((child: { text: string }, childIndex: number) => {
        const tempText = child.text;
        if (tempText.length) {
          originalText += `${tempText}${
            itemIndex !== values.length - 1 && childIndex === item.children.length - 1 ? '\n' : ''
          }`;
        } else {
          originalText += originalText.length || values.length > 1 ? '\n' : '';
        }
      });
    });

    onChange?.(originalText);
  };

  const decorate = useCallback(
    // @ts-ignore
    ([node, path]) => {
      const ranges: any = [];
      if (Text.isText(node)) {
        const { text } = node;

        termArr?.forEach((item: any) => {
          const { entries = [], name } = item;

          if (entries.length) {
            entries.forEach((entry: any) => {
              const lineText: string = isTranslation ? entry.translation : entry.source_text;

              // 大写匹配
              if (ENGLISH_REG.test(lineText.slice(0, 1)) && !UPPER_CASE_ENGLISH_REG.test(lineText.slice(0, 1))) {
                const uppercaseLineText: string = lineText.slice(0, 1).toUpperCase() + lineText.slice(1);
                const uppercaseParts = text.split(uppercaseLineText);
                let uppercaseOffset = 0;

                uppercaseParts.forEach((part, i) => {
                  if (i !== 0) {
                    ranges.push({
                      anchor: {
                        path,
                        offset: uppercaseOffset - lineText.length
                      },
                      focus: { path, offset: uppercaseOffset },
                      underline: true,
                      type: name
                    });
                  }
                  uppercaseOffset += part.length + lineText.length;
                });
              }
              const parts = text.split(lineText);
              let offset = 0;
              parts.forEach((part, i) => {
                if (i !== 0) {
                  ranges.push({
                    anchor: { path, offset: offset - lineText.length },
                    focus: { path, offset },
                    underline: true,
                    type: name
                  });
                }
                offset += part.length + lineText.length;
              });
            });
          }
        });
      }
      return ranges;
    },
    []
  );

  const autoSetCursor = () => {
    if (isTranslation) {
      return;
    }
    const { selection } = editor;

    if (selection) {
      ReactEditor.focus(editor);
    } else {
      Transforms.select(editor, [0, 0]);
    }
  };

  const { run: autoSetCursorFn } = useDebounceFn(autoSetCursor, 100, []);

  useEffect(() => {
    if (formatValue) {
      return;
    }
    let editorFirstText = '';
    // @ts-expect-error
    editor.children?.[0]?.children?.forEach((item: any) => {
      const { text = '' } = item;
      editorFirstText += text;
    });

    const editorChildrenLenght = editor.children.length;

    const valueArr = value.split('\n').map((item, index) => {
      const children = [
        {
          text: item,
          sentence: index,
          childSentence: 0
        }
      ];
      return {
        type: 'paragraph',
        children
      };
    });
    // Handling url text does not display the problem
    if (editorChildrenLenght === 1 && editorFirstText === '' && value !== '') {
      for (const editorChild of valueArr) {
        Transforms.insertNodes(editor, editorChild);
      }
      Transforms.removeNodes(editor, { at: [0] });
      // Deal with the clear button page not updating issue
    } else if (((editorChildrenLenght === 1 && editorFirstText !== '') || editorChildrenLenght > 1) && value === '') {
      Transforms.insertNodes(editor, initSlateValue, { at: [0] });
      for (let i = 0; i < editorChildrenLenght; i++) {
        Transforms.removeNodes(editor, { at: [valueArr.length] });
      }
    } else if (editorFirstText !== value && value !== '' && isTranslation && formatValue === '') {
      for (const [index, editorChild] of valueArr.entries()) {
        Transforms.insertNodes(editor, editorChild, { at: [index] });
      }
      for (let i = 0; i < editorChildrenLenght; i++) {
        Transforms.removeNodes(editor, { at: [valueArr.length] });
      }
    }
    if (!value) {
      autoSetCursorFn();
    }
  }, [value]);

  useEffect(() => {
    const { selection } = editor;
    let anchor;
    let focus;
    if (selection) {
      anchor = selection.anchor;
      focus = selection.focus;
    }

    if (formatValue === '' || JSON.stringify(anchor) !== JSON.stringify(focus)) {
      return;
    }

    const valueArr = formatValue.split('\n').map((item, index) => {
      const children = item.split('-preline-').map((text, textIndex: number) => ({
        text,
        sentence: index,
        childSentence: textIndex
      }));
      return {
        type: 'paragraph',
        children
      };
    });
    const editorChildrenLenght = editor.children.length;

    for (const [index, editorChild] of valueArr.entries()) {
      Transforms.insertNodes(editor, editorChild, { at: [index] });
    }

    for (let i = 0; i < editorChildrenLenght; i++) {
      Transforms.removeNodes(editor, { at: [valueArr.length] });
    }
  }, [formatValue]);

  return (
    <Slate editor={editor} initialValue={initSlateValue} onChange={editorChange}>
      <HoveringToolbar />
      <Editable
        style={{
          width: 'calc(100% - 40px)',
          minHeight: 300,
          padding: 10,
          outline: 'none'
        }}
        readOnly={readonly}
        renderLeaf={renderLeaf}
        decorate={decorate}
        onDragOver={e => e?.preventDefault?.()}
        onDragStart={e => e?.preventDefault?.()}
        onDragEnd={e => e?.preventDefault?.()}
        onDrop={e => e?.preventDefault?.()}
        placeholder="请输入要翻译的文字"
        onPaste={useCallback(
          (event: React.ClipboardEvent<HTMLDivElement>) => {
            if (!readonly) {
              event.preventDefault();
              ReactEditor.insertData(editor, event?.clipboardData);
            }
          },
          [readonly]
        )}
        autoFocus={!isTranslation}
      />
    </Slate>
  );
};

const HoveringToolbar = () => {
  const editor = useSlate();
  const toolbarRef = useRef<HTMLDivElement>(null);

  const handelSelectionChange = () => {
    const el = toolbarRef.current;

    if (!el || !isBrowser) {
      return;
    }

    setTimeout(() => {
      const { selection } = editor;
      const domSelection: any = window.getSelection();

      if (
        !selection ||
        selection.anchor.offset === selection.focus.offset ||
        domSelection.toString() === '' ||
        Range.isCollapsed(selection) ||
        Editor.string(editor, selection) === ''
      ) {
        el.removeAttribute('style');
        return;
      }

      if (domSelection.rangeCount) {
        const domRange = domSelection.getRangeAt(0);
        const rect = domRange.getBoundingClientRect();
        el.style.top = `${rect.top - 5}px`;
        el.style.left = `${rect.left - el.offsetWidth / 2 + rect.width / 2}px`;
      } else {
        el.removeAttribute('style');
      }
    });
  };

  const { run } = useThrottleFn(handelSelectionChange, 100, [], {
    immediately: true
  });

  useEffect(() => {
    document.addEventListener('selectionchange', run);
    return () => {
      document.removeEventListener('selectionchange', run);
    };
  }, []);

  return (
    <Portal>
      <div
        ref={toolbarRef}
        className="hovering-toolbar"
        onMouseDown={e => {
          e.preventDefault();
        }}
      >
        <span></span>
      </div>
    </Portal>
  );
};

const Portal: React.FC<PropsWithChildren> = ({ children }) =>
  isBrowser ? ReactDOM.createPortal(children, document.body) : null;

const withTextLimit = (editor: ReactEditor) => {
  editor.insertTextData = (data: DataTransfer): boolean => {
    let text = data.getData('text/plain');

    if (text) {
      if (text.length > 5000) {
        text = text.substring(0, 5000);
      }

      const lines = text.split(/\r\n|\r|\n/);
      let split = false;

      for (const line of lines) {
        if (split) {
          Transforms.splitNodes(editor, { always: true });
        }

        editor.insertText(line);
        split = true;
      }
      return true;
    }
    return false;
  };

  return editor;
};

export default RichText;

export const SourceRichText = memo(RichText, (prevProps: RichTextProps, nextProps: RichTextProps) => {
  const { value, termArr, formatValue, readonly } = prevProps;
  const { value: nextValue, termArr: nextTermArr, formatValue: nextFormatValue, readonly: nextReadonly } = nextProps;

  if (
    value === nextValue &&
    JSON.stringify(termArr) === JSON.stringify(nextTermArr) &&
    formatValue === nextFormatValue &&
    readonly === nextReadonly
  ) {
    return true;
  }

  return false;
});
