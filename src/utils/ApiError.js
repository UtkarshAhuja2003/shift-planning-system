class ApiError extends Error{
  constructor(statusCode, message){
      super(message);
      this.statusCode = statusCode;
      this.status = false;
  }
}

export default ApiError;