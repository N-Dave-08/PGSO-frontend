export default function NotFound() {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">404</h1>
        <h2 className="text-xl mt-4">Page Not Found</h2>
        <p className="mt-2 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;texist or has been moved.
        </p>
      </div>
    );
  }