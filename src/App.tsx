import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/Routes';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import AppInitializer from './config/AppIntializer';

function App() {
  return (
    <Provider store={store}>
      <AppInitializer />

      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>

  );
}

export default App;