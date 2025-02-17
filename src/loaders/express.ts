import express from 'express';
import routes from '@/api';
import config from '@/config';

export default ({ app }: { app: express.Application }) => {
  console.log("✅ Loading Express...");
  console.log("✅ API Prefix: ", config.api.prefix);

  app.use(config.api.prefix, routes());

  app.use((req, res, next) => {
    console.error("🚨 Route Not Found:", req.method, req.url);
    const err = new Error("Not Found");
    err["status"] = 404;
    next(err);
  });

  app.use((err, req, res, next) => {
    console.error("🔥 Error Handler:", err.message);
    res.status(err.status || 500).json({
      errors: {
        message: err.message,
      },
    });
  });
};
