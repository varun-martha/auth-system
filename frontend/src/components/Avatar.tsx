export function Avatar({ url, size = 40 }: { url?: string; size?: number }) {
  if (!url) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: "#ccc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: size * 0.4
        }}
      >
        ?
      </div>
    );
  }

  return (
    <img
      src={url}
      alt="User Avatar"
      width={size}
      height={size}
      style={{
        borderRadius: "50%",
        objectFit: "cover",
        backgroundColor: "#f0f0f0"
      }}
    />
  );
}
