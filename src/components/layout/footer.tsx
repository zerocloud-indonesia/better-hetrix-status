export function Footer() {
  return (
    <footer className="mt-auto border-t backdrop-blur-md transition-all duration-300 border-border/40 bg-background/80">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between text-sm gap-4">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="flex items-center gap-1 ">
              Powered by{" "}
              <a href="https://hetrixtools.com" target="_blank" rel="noopener noreferrer" className="transition-all duration-200 hover:text-amber-500 hover:scale-102 inline-flex items-center gap-1">
                Hetrix Tools
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>{" "}
              and{" "}
              <a href="https://github.com/Waffle-Host/better-hetrix-status" target="_blank" rel="noopener noreferrer" className="transition-all duration-200 hover:text-amber-500 hover:scale-102 inline-flex items-center gap-1">
                Better-Hetrix-Page
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
            <div>
              Custom Made for <a href="https://waffle.host" target="_blank" rel="noopener noreferrer" className="transition-all duration-200 hover:text-amber-500 hover:scale-102 inline-flex items-center gap-1">
                Waffle.host
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a> by{" "}
              <a href="https://irazz.lol" target="_blank" rel="noopener noreferrer" className="transition-all duration-200 hover:text-amber-500 hover:scale-102 inline-flex items-center gap-1">
                irazz.lol
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
          </div>
          <div className="text-muted-foreground">
            &copy; {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </footer>
  )
}