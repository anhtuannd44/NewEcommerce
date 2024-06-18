export enum APIStatus {
  SUCCESS = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  INTERNAL_SERVER_ERROR = 500
}

export enum APIMessages {
  incorrectPassword = 'Incorrect Password',
  emailAlreadyExists = 'Email Already Exists',
  emailNotExists = 'Email Not Exists'
}