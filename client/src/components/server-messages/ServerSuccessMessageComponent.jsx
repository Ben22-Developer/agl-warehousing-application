function ServerSuccessMessageComponent ({ title = "Request succeeded", message = "" })
{
  return (<>
    <h2>{title}</h2>
    <p>{message}</p>
  </>)
}

export default ServerSuccessMessageComponent;
