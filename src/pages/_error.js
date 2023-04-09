function Error({ statusCode }) {
  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : 'An error occurred on client'}
    </p>
  )
}

Error.getInitialProps = ({ res, err }) => {
  if (typeof window == "undefined") {
    const newrelic = require("newrelic");
    newrelic.noticeError(err, res);
  } else {
    window.newrelic.noticeError(err, res);
  }

  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error