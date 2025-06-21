export default function QRWebviewLayout({ children }) {
  return (
    <div className="relative min-h-screen">
      <div className="min-h-[100dvh]">{children}</div>

      <img
        src="/img/background-indonesia-map.webp"
        alt="bg-muattrans"
        className="fixed bottom-0 left-0 z-[-1] w-screen object-contain"
      />
    </div>
  );
}
