import { useEffect } from 'react';
import { useAppDispatch } from '../redux/redux-hooks';
import { initializeKeycloak } from '../redux/slices/authSlice';

const AppInitializer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (window.location.pathname !== '/logged-out') {
      dispatch(initializeKeycloak());
    }
  }, [dispatch]);

  return null;
};

export default AppInitializer;
