export default function Footer() {
  return (
    <footer className="bg-[#123B3B] text-white py-8 mt-auto">
      <div className="container mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Dev<span className="text-[#E69A52]">Campus.</span>
        </h2>
        <p className="text-gray-400 mb-6 font-medium">
          Empowering students to build, share, and grow together.
        </p>
        <div className="border-t border-gray-600 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} DevCampus. Built by Satish Kumar.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm font-bold text-[#E69A52]">
            <a href="https://github.com/SatishKumar-git" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">GitHub</a>
            <a href="https://www.linkedin.com/in/satish-kumar-592534321" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}