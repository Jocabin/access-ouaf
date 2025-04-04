import { PrimeReactProvider } from "primereact/api";
import Homepage from "../components/Homepage";
import "primereact/resources/themes/saga-orange/theme.css";
import "primeicons/primeicons.css";

export default async function Home() {
  return (
    <>
      <PrimeReactProvider>
        <div className="main--container">
          <div className="main--content">
            <Homepage />
          </div>
        </div>
      </PrimeReactProvider>
    </>
  );
}
