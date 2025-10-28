
import { Link, useNavigate } from 'react-router';
import { logout, getUser } from '../api/auth';

export default function Navbar() {
    const navigate = useNavigate();
    const user = getUser();

    return (
        <nav className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between shadow-md">
            <div className="flex gap-6">
                <Link to="/dashboard" className="hover:underline font-medium">Dashboard</Link>
                <Link to="/transactions" className="hover:underline font-medium">Transactions</Link>
                <Link to="/transactions/new" className="hover:underline font-medium">Add Transaction</Link>
            </div>

            <div>
                {user ? (
                    <>
                        <span className="mr-4">{user.username}</span>
                        <button
                            onClick={logout}
                            className="bg-white text-blue-600 px-3 py-1 rounded-md hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-white text-blue-600 px-3 py-1 rounded-md hover:bg-gray-100"
                    >
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
}
