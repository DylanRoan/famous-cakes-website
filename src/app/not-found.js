import { faMagnifyingGlassMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NotFound() {
    return (
        <main id='not-found'>
            <FontAwesomeIcon icon={faMagnifyingGlassMinus} size="2x"></FontAwesomeIcon>
            <h1>404 - Not Found</h1>
            <p>Could not find requested page.</p>
        </main>
    )
  }