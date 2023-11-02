import { NavLink } from 'react-router-dom';

interface pathInterface {
  name: string;
  path: string;
}

function Link({ name, path }: pathInterface)
{
  return (  
    <li>
    <NavLink to={path}>{name}</NavLink>
    </li>
  );
}
function Header() {
  return (
    <header>
      <nav>
        <ul>
            <Link path='/' name='Accueil'/>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
