import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './store'
import { BrowserRouter } from "react-router";
import AppRouter from './router/AppRouter'
import { setupAuthInterceptor } from './shared/api/axios'

setupAuthInterceptor(() => store.getState().auth.accessToken);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
