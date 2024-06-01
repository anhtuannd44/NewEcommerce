export const updateObject = (oldObject: any, updatedProperties: any) => {
  return {
    ...oldObject,
    ...updatedProperties
  }
}

export interface IValidationRequest {
  validation: IValidationRules
  result: IValidationResult
}

export interface IValidationResult {
  isValid: boolean | undefined
  errorMessage?: string
}

export interface IValidationRules {
  required?: boolean | undefined
  minNumber?: number | undefined
  minLength?: number | undefined
  maxLength?: number | undefined
  isEmail?: boolean | undefined
  isNumeric?: boolean | undefined
  isPhone?: boolean | undefined
  isUserName?: boolean | undefined
  isPassword?: boolean | undefined
}

export const checkValidity = (value: any, rules: IValidationRules) => {
  const rs: IValidationResult = { isValid: true, errorMessage: '' }
  if (!rules) {
    return rs
  }
	console.log(value)
  if (rules.required) {
		if (Array.isArray(value)) {
			const isInvalid = value.length <= 0
			rs.isValid = !isInvalid
			if (isInvalid) {
				rs.errorMessage = 'Không được để trống'
				return rs
			}
		}
    const isInvalid = value === null || value === undefined || (value.toString() || '').trim() === ''
    rs.isValid = !isInvalid
    if (isInvalid) {
      rs.errorMessage = 'Không được để trống'
      return rs
    }
  }

  if (rules.isNumeric) {
    if (!rules.required && !value) {
      return rs
    }
    const pattern = /^\d+$/
    rs.isValid = pattern.test(value)
    if (!rs.isValid) {
      rs.errorMessage = 'Chỉ được nhập số nguyên'
      return rs
    }
  }

  if (rules.minNumber) {
    if (!rules.required && !value) {
      return rs
    }
    rs.isValid = value >= rules.minNumber
    if (!rs.isValid) {
      rs.errorMessage = `Giá trị phải từ: ${rules.minNumber}`
      return rs
    }
  }

  if (rules.minLength) {
    rs.isValid = value.length >= rules.minLength
    if (!rs.isValid) {
      rs.errorMessage = `Tối thiểu phải gồm ${rules.minLength} ký tự`
      return rs
    }
  }

  if (rules.maxLength) {
    rs.isValid = value.length <= rules.maxLength
    if (!rs.isValid) {
      rs.errorMessage = `Không được vượt quá ${rules.maxLength} ký tự`
      return rs
    }
  }

  if (rules.isEmail) {
    const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    rs.isValid = pattern.test(value)
    if (!rs.isValid) {
      rs.errorMessage = 'Email không hợp lệ'
      return rs
    }
  }

  if (rules.isPhone) {
    const pattern = /^(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8,9})$/
    rs.isValid = pattern.test(value)
    if (!rs.isValid) {
      rs.errorMessage = 'Số điện thoại không hợp lệ'
      return rs
    }
  }

  if (rules.isUserName) {
    const pattern = /^[a-zA-Z0-9]([.](?![.])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/
    rs.isValid = pattern.test(value)
    if (!rs.isValid) {
      rs.errorMessage = 'Tên người dùng không hợp lệ'
      return rs
    }
  }

  if (rules.isPassword) {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    rs.isValid = pattern.test(value)
    if (!rs.isValid) {
      rs.errorMessage = 'Mật khẩu chưa đúng định dạng'
      return rs
    }
  }

  return rs
}

export const compareNewPassword = (newPw: string, confirmNewPw: string) => {
  if (!confirmNewPw || !(newPw === confirmNewPw)) {
    return false
  }
  return true
}
