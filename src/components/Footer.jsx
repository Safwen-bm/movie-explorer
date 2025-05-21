function Footer() {
  return (
    <footer className="bg-secondary text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="font-body text-sm mb-2">© 2025 Movie Explorer. Powered by TMDB.</p>
        <div className="flex justify-center gap-4">
          <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            <i className="fab fa-tmdb"></i> TMDB
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            <i className="fab fa-github"></i> GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;