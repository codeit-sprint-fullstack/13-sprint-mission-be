function imageUrlsFromRequest(req) {
  return (req.files || []).map(
    (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
  );
}

export { imageUrlsFromRequest };
