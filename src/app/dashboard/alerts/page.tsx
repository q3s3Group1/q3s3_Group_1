import Header from "../header";
import { AlertCard } from "./alert";


export default function Page() {
    return (
       <>
       <Header/>
       <div className="flex flex-col space-y-4 px-2 pt-2">
        <AlertCard 
            title="Heads up!" 
            description="You can add components to your app using the cli." 
            status="Inactief"
        />
       </div>
       </>
    )
}