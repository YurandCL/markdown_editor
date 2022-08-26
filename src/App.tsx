import { useEffect, useRef, useState } from 'react'
import { marked } from 'marked'
import hljs from 'highlight.js'

import './App.css'
import 'highlight.js/styles/night-owl.css'

const defaultMd = '# Welcome\n\nyou now can write here anything are you want\n\nplese, select the textarea to do that.\n\nIf you don\'t know what is the text field follow our arrow\n\n          /\n         /\n        /\n       /\n      /\n     /_____________________________________\n     \\\n      \\\n       \\\n        \\\n         \\\n          \\'

function App() {
  const [markdownText, setMarkdownText] = useState(defaultMd)
  const [selectedText, setSelectedText] = useState<string|undefined>('')
  const [showAlert, setShowAlert] = useState({ show: false, msg: '' })

  const timerRef = useRef<NodeJS.Timeout>()
  const downloadRef = useRef<HTMLAnchorElement>(null)
  const uploadRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    marked.setOptions({
      highlight: function (code: string, lang: string) {
        return hljs.highlightAuto(code, [lang]).value
      }
    })
  }, [])

  const hasThatText = ({keyPress, completeText, textToEval}:{keyPress:string, completeText:string, textToEval:string}) => {
    if (keyPress === '*') {
      const newText = `*${textToEval}*`
      const textReplaced = completeText.includes(textToEval) && completeText.replace(textToEval, newText)
      return textReplaced
    } else if (keyPress === '\'') {
      const newText = `'${textToEval}'`
      const textReplaced = completeText.includes(textToEval) && completeText.replace(textToEval, newText)
      return textReplaced
    }
    else if (keyPress === '{') {
      const newText = `{\n\t${textToEval}\n}`
      const textReplaced = completeText.includes(textToEval) && completeText.replace(textToEval, newText)
      return textReplaced
    }
  }

  const handleChange = ({target, nativeEvent}: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = target
    const {data: keyPress} = nativeEvent as InputEvent
    console.log({target,nativeEvent})


    const textReplaced = selectedText && keyPress && hasThatText({keyPress, completeText: markdownText, textToEval: selectedText})

    return setMarkdownText(textReplaced || value)
  }

  const handleShowAlert = (msg = '') => {
    setShowAlert({ show: true, msg })

    timerRef.current && clearTimeout(timerRef.current)
    timerRef.current = global.setTimeout(() => {
      setShowAlert({show: false, msg: ''})
    }, 3000)
  }

  const handleDownload = (textInput: string) => {
    const fileData = new Blob([textInput], { type: 'text/plain' })
    const textFileUrl = window.URL.createObjectURL(fileData)

    downloadRef.current && downloadRef.current.setAttribute('href', textFileUrl)

    downloadRef.current?.click()
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownText).then(() => {
      handleShowAlert('Copied to clipboard')
    })
  }

  const handleUploadFile = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {target} = e

    const {files} = target

    if(!files) return
    const file = files[0]
    const reader = new FileReader()

    reader.onload = ({target}) => {
      const file = target && target.result
      const lines = typeof file === 'string' && file.split(/\r\n|\n/)
      lines && setMarkdownText(lines.join('\n'))
    }

    reader.onerror = () => alert('no se pudo leer el archivo')

    reader.readAsText(file)
  }

  // const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault()
  // }

  // const drop = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault()
  //   console.log(e)
  // }

  const getRawMarkup = () => {
    return {__html: marked.parse(markdownText)}
  }

  return (
    <div className="App">
      <h1 className="App_title">
          Online Markdown Editor
      </h1>
      <a href="http://https://www.markdownguide.org/" target="_blank" rel="noopener noreferrer">Markdown Docs</a>
      <div className="App_content">
        <div className="md_editor">
          <div className="md_editor-header">
            <h1>Md text</h1>
            <div className="md_editor-header_actions">
              <button
                className="md_editor-header_downloadButton"
                onClick={() => handleDownload(markdownText)}
              >
                Download MD
              </button>
              <a style={{ display: 'none' }} download="file.md" ref={downloadRef}></a>
              <button className="md_editor-header_downloadButton" onClick={()=>uploadRef.current && uploadRef.current.click()}>Upload MD file</button>
            </div>
          </div>
          <div className="md_editor-content">
            <div className="md_editor-content_body">
              <textarea
                className="md_editor-content_body-textarea"
                value={markdownText}
                onChange={handleChange}
                onSelectCapture={() =>
                  setSelectedText(document.getSelection()?.toString()||'')
                }
              />
              {/* <div
                ref={uploadRef}
                className="md_editor-content_body-dragDrop"
                onDragOver={(e) => {
                  e.preventDefault()
                  uploadRef.current?.classList.remove('here')
                }}
                onDragLeave={(e) => {
                  e.preventDefault()
                  // uploadRef.current?.classList.remove('here')
                  uploadRef.current?.classList.add('here')
                }}
                onDrop={drop}
              >
                drag your file here
              </div> */}
              <input
                ref={uploadRef}
                className="md_editor-content_body-uploadFile"
                type="file"
                accept=".md"
                onChange={handleUploadFile}
              />
              <button className="md_editor-content_body-copyButton" onClick={handleCopy}>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" data-darkreader-inline-fill="" data-darkreader-inline-stroke="">
                  <path d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="md_result">
          <h1 className="md_result-title">HTML Result</h1>
          <article
            className="md_result-content"
            dangerouslySetInnerHTML={getRawMarkup()}
          >
          </article>
        </div>
      </div>

      {showAlert.show && <div className="App_alert">{showAlert.msg}</div>}
    </div>
  )
}

export default App
