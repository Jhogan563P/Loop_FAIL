import App from "@/App";
import GamePage from "@/pages/GamePage";
import WelcomePage from "@/pages/WelcomePage";
import { createBrowserRouter } from "react-router";

export const routes = createBrowserRouter([
    {  
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <WelcomePage />
            },
            {
                path: "/play",
                element: <GamePage />
            }
        ]
    }
]);