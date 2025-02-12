import { HttpException, HttpStatus } from '@nestjs/common';

const uniqueErrors = [];

export const handleError = (error: any) => {
  //console.log('error in handleError: ', error);
  let errorMessage = error.message;
  let errorStatus = error.status || HttpStatus.INTERNAL_SERVER_ERROR;

  if (errorStatus === 500) throw new Error(errorMessage);

  throw new HttpException(errorMessage, errorStatus);
};
