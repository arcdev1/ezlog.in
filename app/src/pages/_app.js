import "sanitize.css";
import "sanitize.css/forms.css";
import "sanitize.css/typography.css";
import "../global.css";
import "../client.css";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
