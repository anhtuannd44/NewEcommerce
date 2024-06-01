import { BaseTextFieldProps, TextField, TextFieldProps, styled } from "@mui/material";

const TextFieldSmallStyled = styled(TextField)`

`

export const TextFieldSmall = (props: BaseTextFieldProps): JSX.Element => {
    return (
        <TextField
            size={props.size || 'small'}
            sx={{
                fontSize: '0.5rem'
            }}
            {...props}
        />
    )
}