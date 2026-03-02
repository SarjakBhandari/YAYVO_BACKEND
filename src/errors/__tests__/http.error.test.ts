import { HttpError } from '../http.error';

describe('HttpError', () => {
  it('should create an HttpError instance with statusCode and message', () => {
    const error = new HttpError(400, 'Bad Request');
    expect(error).toBeInstanceOf(HttpError);
    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Bad Request');
  });

  it('should create a 401 Unauthorized error', () => {
    const error = new HttpError(401, 'Unauthorized');
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe('Unauthorized');
  });

  it('should create a 403 Forbidden error', () => {
    const error = new HttpError(403, 'Forbidden');
    expect(error.statusCode).toBe(403);
    expect(error.message).toBe('Forbidden');
  });

  it('should create a 404 Not Found error', () => {
    const error = new HttpError(404, 'Not Found');
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Not Found');
  });

  it('should create a 409 Conflict error', () => {
    const error = new HttpError(409, 'Conflict');
    expect(error.statusCode).toBe(409);
    expect(error.message).toBe('Conflict');
  });

  it('should create a 500 Internal Server Error', () => {
    const error = new HttpError(500, 'Internal Server Error');
    expect(error.statusCode).toBe(500);
    expect(error.message).toBe('Internal Server Error');
  });

  it('should have stack trace', () => {
    const error = new HttpError(400, 'Bad Request');
    expect(error.stack).toBeDefined();
  });

  it('should work with throw and catch', () => {
    const throwError = () => {
      throw new HttpError(422, 'Unprocessable Entity');
    };

    expect(throwError).toThrow(HttpError);
    try {
      throwError();
    } catch (e: any) {
      expect(e.statusCode).toBe(422);
      expect(e.message).toBe('Unprocessable Entity');
    }
  });

  it('should support custom status codes', () => {
    const error = new HttpError(429, 'Too Many Requests');
    expect(error.statusCode).toBe(429);
    expect(error.message).toBe('Too Many Requests');
  });


});
