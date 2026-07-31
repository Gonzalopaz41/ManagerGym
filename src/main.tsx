import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './store'
import { BrowserRouter } from "react-router";
import AppRouter from './router/AppRouter'
import { setupAuthInterceptor } from './shared/api/axios'
import { refreshThunk } from './features/auth'

setupAuthInterceptor(() => store.getState().auth.accessToken);

// Se restaura la sesión una sola vez al arrancar, fuera de React: dentro de un
// useEffect StrictMode lo ejecuta dos veces, y si el backend revoca el refresh
// token al usarlo, el segundo intento falla y cierra la sesión recién abierta.
if (store.getState().auth.isInitializing) {
  store.dispatch(refreshThunk());
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
