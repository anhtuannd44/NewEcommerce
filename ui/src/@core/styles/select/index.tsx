import { BaseSelectProps, FormControl, InputLabel, MenuItem, Select, SelectProps } from "@mui/material";

export type ISelectDataSouce = {
  id: string,
  value: string
}

interface ISelectProps extends BaseSelectProps {
  title?: string,
  dataSource?: ISelectDataSouce[]
}


export const SelectSmallFullWidth = (selectProps: ISelectProps): JSX.Element => {
  const { dataSource, title, labelId } = selectProps
  return (
    <FormControl fullWidth size="small">
      <InputLabel id={labelId}>{title}</InputLabel>
      <Select
        fullWidth
        labelId={labelId}
        label={title}
        {...selectProps}
      >
        {dataSource?.map((item) => (
          <MenuItem value={item.value} id={item.id} key={item.id}>{item.value}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}