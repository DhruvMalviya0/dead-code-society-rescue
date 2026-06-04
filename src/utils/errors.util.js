class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404);
    }
}

class UnauthorizedError extends AppError {
    constructor(message) {
        super(message, 401);
    }
}

class ConflictError extends AppError {
    constructor(message) {
        super(message, 409);
    }
}

class ValidationError extends AppError {
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
