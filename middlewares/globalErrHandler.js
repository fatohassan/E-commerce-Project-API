export const globalErrHandler = (err, req, res, next) => {
    // stack
    // status code
    // message
    const stack = err?.stack;
    const statusCode = err?.statusCode? err?.statusCode : 500;
    const message = err?.message;
    
    res.status(statusCode).json({
        stack,
        message,
    });
};

// routes error
export const notFound = (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    next(err);
};