import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout'
import { TooltipProvider } from "@/components/ui/tooltip"
import { Learning } from './pages/Learning'
import { Discussion } from './pages/Discussion'
import { Documentation } from './pages/Documentation'



const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Learning />,
      },
      {
        path: 'discussion',
        element: <Discussion />,
      },
      {
        path: 'documentation',
        element: <Documentation />,
      },
    ],
  },
])

function App() {
  return (
    <TooltipProvider>
      <RouterProvider router={router} />
    </TooltipProvider>
  )
}

export default App
