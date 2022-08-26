import {dataTypes, reservedWords, operators} from '../utils/consts'

interface useHighLightInterface{
  code: string
  lang: string
}

const spanTagClosed = '</span>'

const useHighLight = ({ code, lang }: useHighLightInterface) => {
  const allCodeSplitted = code.split(/\s|\n+/g)
  console.log({ allCodeSplitted })

  for (let i = 0; i < allCodeSplitted.length; i++) {
    const word = allCodeSplitted[i];

    if (dataTypes.includes(word)) {
      allCodeSplitted[i] = `<span class="dataType">${word}${spanTagClosed}`
    }
    else if (reservedWords.includes(word)) {
      allCodeSplitted[i] = `\n<span class="reservedWord">${word}${spanTagClosed}`
    }
    else if (operators.includes(word)) {
      allCodeSplitted[i] = `<span class="operator">${word}${spanTagClosed}`
    }
  }

  const newCodeJoined = allCodeSplitted.join(' ')

  return `<div class="code">${newCodeJoined}</div>`
}

export default useHighLight