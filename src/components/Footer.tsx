import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="text-center py-4 text-gray-300 border-t border-teal-700 mt-auto">
      <div className="space-y-2">
        <p className="text-sm">
          Created with <span className="text-red-400">❤</span> by Edson Reginold
        </p>
        <p className="text-sm">
          <Link to="/attributions" className="text-teal-300 hover:underline">
            Attributions
          </Link>
        </p>
      </div>
    </footer>
  );
} 