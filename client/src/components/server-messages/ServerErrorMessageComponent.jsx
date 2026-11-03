function ServerErrorMessageComponent ({ title = "Error", message = "Server response error data", errorMessage })
{
  console.log(errorMessage)

  const errorText = typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage);
  const errorLines = errorText.split('\n').filter(line => line.trim() !== '');

  return (<>
    <h2>{title}</h2>
    <p>{message}</p>
    <div className="error-message-container">
      {errorLines.map((line, index) => (
        <p key={index} className="error-message-line">{line}</p>
      ))}
    </div>
  </>)
}

export default ServerErrorMessageComponent;
