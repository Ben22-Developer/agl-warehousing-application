function ModalComponent ({ isOpen, onClose, children, onConfirm })
{
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div>{children}</div>
                <div className="modal-actions">
                    <button className="modal-close-btn" onClick={onClose}>Close</button>
                    {onConfirm && <button className="modal-confirm-btn" onClick={onConfirm}>Confirm</button> }
                </div>
            </div>
        </div>
    )
}

export default ModalComponent;