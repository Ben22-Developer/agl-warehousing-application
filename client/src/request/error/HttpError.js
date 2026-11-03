export default class HttpError extends Error {
    constructor(statusCode, statusText, message) {
        // 1. Pass the human-readable message to the parent Error class
        super(message || `${statusCode} ${statusText}`);

        // 2. Set the custom properties
        this.name = 'HttpError';
        this.status = statusCode;       // e.g., 404
        this.statusText = statusText;   // e.g., 'Not Found'

        console.log(this.status)

        // 3. Maintain proper stack trace (NodeJS/V8 environments)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HttpError);
        }
    }
}