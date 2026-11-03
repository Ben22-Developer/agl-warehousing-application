function MissingOnCreateFieldsComponent ({ missingFields })
{
    return (<>
        <h2>Missing Required Data</h2>
        <p>Please complete the following sections before submitting:</p>
        <ul className="error-list">
            {missingFields.map((field, index) => (
                <li key={index}>{field}</li>
            ))}
        </ul>
    </>)
}

export default MissingOnCreateFieldsComponent;