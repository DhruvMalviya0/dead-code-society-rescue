/**
 * Base application error carrying an HTTP status code.
 */
class AppError extends Error {
    /**
     * @param {string} message - Error message.
     * @param {number} statusCode - HTTP status code for this error.
     * @returns {void}
     * @throws {Error} When error initialization fails.
     */
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

/**
 * Error for missing resources.
 */
class NotFoundError extends AppError {
    /**
     * @param {string} message - Error message.
     * @returns {void}
     * @throws {Error} When error initialization fails.
     */
    constructor(message) {
        super(message, 404);
    }
}

/**
 * Error for unauthorized access.
 */
class UnauthorizedError extends AppError {
    /**
     * @param {string} message - Error message.
     * @returns {void}
     * @throws {Error} When error initialization fails.
     */
    constructor(message) {
        super(message, 401);
    }
}

/**
 * Error for conflicting state/data.
 */
class ConflictError extends AppError {
    /**
     * @param {string} message - Error message.
     * @returns {void}
     * @throws {Error} When error initialization fails.
     */
    constructor(message) {
        super(message, 409);
    }
}

/**
 * Error used for request validation failures.
 */
class ValidationError extends AppError {
    /**
     * @param {string[]} errors - Validation error messages.
     * @returns {void}
     * @throws {Error} When error initialization fails.
     */
    constructor(errors) {
        super('Validation failed', 422);
        this.errors = errors;
    }
}

module.exports = {
    AppError,
    NotFoundError,
    UnauthorizedError,
    ConflictError,
    ValidationError
};
