

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6">
        <p className="text-sm text-muted-foreground">
          © 2025 Find Your Flow State |{' '}
          <a
            href="https://www.zickonezero.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
          >
            ZICKONEZERO Creative
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
