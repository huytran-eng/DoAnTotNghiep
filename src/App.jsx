// src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import Routers from './routes'

const App = () => {

  return (
    <Routers />
    // <Router>
    //   <Routes>
    //     {/* Public Routes */}
    //     {publicRoutes.map((route, index) => (
    //       <Route key={index} path={route.path} element={route.element} />
    //     ))}

    //     {/* Protected Routes */}
    //     {protectedRoutes.map((route, index) => (
    //       <Route key={index} path={route.path} element={route.element} />
    //     ))}
    //   </Routes>
    // </Router>
  );
};
export default App;
