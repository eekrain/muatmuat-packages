// SSR / RSC Friendly Loading Component
export default function LoadingStatic() {
  return (
    <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-black/10 backdrop-blur-md">
      <img
        src={"/img/loading-animation.webp"}
        width={100}
        height={100}
        alt="loading"
      />
    </div>
  );
}
