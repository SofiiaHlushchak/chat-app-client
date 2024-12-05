import React, { useEffect, useState } from "react";

const ToastNotification = ({ message }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return show ? (
        <div className="toast-notification">
            <p>{message}</p>
        </div>
    ) : null;
};

export default ToastNotification;
