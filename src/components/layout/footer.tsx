export function Footer() {
  return (
    <footer className="mt-auto border-t backdrop-blur-md transition-all duration-300 border-border/40 bg-background/80">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between text-sm">
          <a 
            href="https://hetrixtools.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-colors hover:text-primary"
          >
            Powered by Hetrix Tools
          </a>
          <div className="text-muted-foreground">
            © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </footer>
  )
}