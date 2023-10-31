import React, {useEffect, useState} from 'react';

const UseLoading = () => {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])
    return isClient
};

export default UseLoading;
