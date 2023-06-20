class HttpError extends Error {
  constructor(message, errCode) {
    super(message); //add message property
    this.code = errCode; //add code property
  }
}

module.exports = HttpError;
