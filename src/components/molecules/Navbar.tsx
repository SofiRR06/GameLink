import { Link } from 'react-router-dom';
import logo from '../../assets/gamelink_logo1.svg';

const Navbar = () => {
    return (
        <nav className="flex justify-between items-center font-righteous bg-brand text-main-green shadow-md pl-7 pr-10">
            <div className="flex items-center gap-2">
                <Link to="/">
                    <img src={logo} alt="Logo" className="w-[80px] h-[80px]" />
                </Link>
                <Link to="/" className="no-underline text-black text-3xl transition-colors duration-300 hover:text-main-green"> GAMELINK</Link>
            </div>
            <ul className="flex gap-8 list-none ">
                <li>
                    <Link to="/catalog" className="no-underline font-medium  text-xl transition-colors duration-300 hover:text-black">Catálogo</Link>
                </li>
                <li>
                    <Link to="/profile" className="no-underline font-medium  text-xl transition-colors duration-300 hover:text-black">Perfil</Link>
                </li>
                <li>
                    <Link to="/wishlist" className="no-underline font-medium  text-xl transition-colors duration-300 hover:text-black">Lista de Deseos</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
