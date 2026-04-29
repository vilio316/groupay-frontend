export default function SpinnerLoader() {
  return (
    <div
      className={`flex items-center justify-center`}
      data-testid="spinner-loader"
    >
      <div className="animate-spin rounded-full h-6 w-6 border-4 border-emerald-500 border-t-transparent"></div>
    </div>
  );
}
