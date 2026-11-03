import "./MultiBarStepStyles.css";

function MultiStepBar ({steps, completedSteps, setCompletedStepsHandler, nextButtonDisable, previousButtonDisable})
{

    return (<div className="progress-container">
        <div className="progress-track">
            <div className="progress-indicator" id="progressIndicator"></div>
        </div>
        <div className="steps-wrapper">
            {steps.map((element, index) => <StepBar key={index} node={element.node} label={element.label} isCompleted={index < completedSteps}/>)}
        </div>
        <div className="button-group ">
            <button type="button" disabled={previousButtonDisable} className={`app-button ${previousButtonDisable ? "disabled" : ""} `} onClick={() => setCompletedStepsHandler(-1)}>Previous</button>
            <button type="button" disabled={nextButtonDisable} className={`app-button ${nextButtonDisable ? "disabled" : ""} `} onClick={() => setCompletedStepsHandler(1)}>Next</button>
        </div>
    </div>)
}

function StepBar ({ node, label, isCompleted })
{
    return (
        <div key={node} className={`step-item ${isCompleted == true ? 'completed' : ''}`}>
            <div className="step-node">{node}</div>
            <div className="step-label">{label}</div>
        </div>
    )
}

export default MultiStepBar;