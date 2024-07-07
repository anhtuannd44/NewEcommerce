import { NumericFormat, NumericFormatProps } from 'react-number-format'

const TextFieldVNDFormat = <BaseType,>(props: NumericFormatProps<BaseType>): JSX.Element => {
  return <NumericFormat decimalScale={2} thousandSeparator=',' {...props} />
}

export default TextFieldVNDFormat
