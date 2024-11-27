

function NotFound (){
  return (
    <div className="not-found">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-message">Oops! Page Not Found</p>
      <p className="not-found-submessage">It seems we can't find the page you're looking for.</p>
      <a href="/" className="not-found-home-link">Go to Homepage</a>
    </div>
  );
}

export default NotFound;
