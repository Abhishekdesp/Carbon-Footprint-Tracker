const errorHandler = (err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  if (res.headersSent) return next(err);
  
  // Multer errors
  if (err && err.name === 'MulterError') {
    return res.status(400).json({ error: err.message });
  }
  
  const message = (err && err.message) || 'Internal Server Error';
  res.status(err && err.status ? err.status : 500).json({ error: message });
};

module.exports = errorHandler;
