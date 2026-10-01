export class HttpError extends Error {
  constructor(public StatusCode: number, message: string) {
    super(message);
  }
}
