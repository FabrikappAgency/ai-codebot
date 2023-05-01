function throwError(message = 'This is a sample error'): never {
  throw new Error(message);
}

export default throwError;