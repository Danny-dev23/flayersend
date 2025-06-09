import Home from './Pages/Home/home.jsx';
import About from './Pages/About/about.jsx';
import Shop from './Pages/Shop/Shop.jsx';
import Contacts from './Pages/Contacts/contacts.jsx';
import TestTwo from './Pages/Main/TestTwo.jsx';

const Routes = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/shop', element: <Shop /> },
  { path: '/contacts', element: <Contacts /> },
  { path: '/test', element: <TestTwo /> },
];

export default Routes;