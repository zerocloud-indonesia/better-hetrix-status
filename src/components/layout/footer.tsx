import { MotionDiv } from "@/components/ui/motion"
import { Github, Instagram, Gamepad2, Mail, ExternalLink } from "lucide-react"

export function Footer() {
  const socials = [
    { name: 'GitHub', icon: Github, href: 'https://github.com/zerocloudid' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/zerocloud.id' },
    { name: 'Discord', icon: Gamepad2, href: 'https://discord.gg/25eJtzqsmk' },
    { name: 'Email', icon: Mail, href: 'mailto:supports@zerocloud.id' }
  ]

  return (
    <footer className="mt-auto border-t backdrop-blur-md transition-all duration-300 border-border/40 bg-background/80">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">ZeroCloud.id</h3>
            <p className="text-sm text-muted-foreground">
              Delivering reliable cloud hosting solutions with exceptional performance and speed. Your Server, Your Way! 🚀
            </p>
            <div className="flex gap-4">
              {socials.map((social) => (
                <MotionDiv
                  key={social.name}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.name}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                </MotionDiv>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Powered By</h3>
            <div className="grid grid-cols-1 gap-2">
              <a 
                href="https://hetrixtools.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>HetrixTools</span>
              </a>
            </div>
          </div>

          {/* Contact & Credits */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Other Links</h3>
            <div className="grid grid-cols-1 gap-2">
              <a 
                href="https://zerocloud.id" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Mainpage</span>
              </a>
              <a 
                href="https://control.zerocloud.id" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Gamepanel</span>
              </a>
              <a 
                href="https://my.zerocloud.id" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Billing</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ZeroCloud.id. All rights reserved.
          </p>
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-4"
          >
            <a href="https://docs.zerocloud.id/policies/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
            <a href="https://docs.zerocloud.id/policies/tos" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
          </MotionDiv>
        </div>
      </div>
    </footer>
  )
}