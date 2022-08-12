exports.getTime = () => {
  const time = new Date();

  return time.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};
