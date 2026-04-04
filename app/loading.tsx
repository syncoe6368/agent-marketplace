export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="space-y-4">
        <div className="relative inline-flex">
          <div className="h-12 w-12 rounded-full border-4 border-muted border-t-primary animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
