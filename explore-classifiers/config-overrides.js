module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    zlib: false,
    stream: false,
  };
  return config;
};
