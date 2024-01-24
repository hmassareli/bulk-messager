// cada número deve ser separado por quebra de linha, ou virgula
// os números podem ou não ter 55 na frente, não deve ser obrigatório, mas deve ser tratado para inserir isso antes de enviar as mensagens
// talvez seja legal perguntar no futuro se todos os números são brasileiros
//exemplo
/*
5512991944059
551299194-4059
55 12 99194 4059
12991944059
12 991944059
55 12991944059
 12 9 91944059

*/
export const formatNumbers = (numbers: string[]): string[] => {
  // remove everything but numbers
  const cleanNumbers = numbers.map((n) => {
    return n.replace(/\D/g, '')
  })
  const numbersWithCountryCode = cleanNumbers.map((n) => {
    if (n.slice(0, 2) === '55') {
      return n
    }
    return `55${n}`
  })

  console.log(numbersWithCountryCode)

  return numbersWithCountryCode

  // console.log(numbers)
}

const removeRepeatedNumbers = (numbers: string[]): string[] => {
  const uniqueNumbers = [...new Set(numbers)]
  return uniqueNumbers
}

export const divideNumbers = (
  stringNumbers: string,
  typeOfDivider: 'comma' | 'lineBreak'
): string[] => {
  if (typeOfDivider) {
    return stringNumbers.split('\n')
  }
  return stringNumbers.split(',')
}

export const getFormattedNumbers = (
  numbersString: string,
  typeOfDivider: 'comma' | 'lineBreak'
): { numbers: string[]; invalidNumbersLength: number } => {
  const numbersArray = divideNumbers(numbersString, typeOfDivider)
  const result = removeRepeatedNumbers(formatNumbers(numbersArray))
  return {
    numbers: result,
    invalidNumbersLength: 0
  }
}
