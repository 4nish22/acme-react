import { Github, Twitter, Instagram, Cpu } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-border/40 bg-white/50 backdrop-blur-sm">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2 font-black text-xl tracking-tighter uppercase italic">
              <Cpu className="h-6 w-6 text-primary" />
              ACME<span className="text-primary/80">STORE</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Premium Items for the everyone.
            </p>
          </div>

          <div className="flex gap-8 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Shop</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          </div>

          <div className="flex gap-5 text-muted-foreground">
            <Github className="h-5 w-5 hover:text-foreground cursor-pointer transition-colors" />
            <Twitter className="h-5 w-5 hover:text-foreground cursor-pointer transition-colors" />
            <Instagram className="h-5 w-5 hover:text-foreground cursor-pointer transition-colors" />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/60 uppercase tracking-widest font-bold">
          <p>© 2026 ACME ACCOUNTING SOFTWARE.</p>
          <p>Built with Precision & Speed</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;