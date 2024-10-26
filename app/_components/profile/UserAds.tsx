import { useState, useEffect } from "react";

const UserAds = () => {
    const [userData, setUserads] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/profile-ads', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                // Check if the request was successful
                if (response.ok) {
                    const data = await response.json();
                    setUserads(data.userData); // Assuming userData is in the response
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Something went wrong');
                }
            } catch (error) {
                // setError(error.message || 'An error occurred');
            }
        };

        fetchUserData();
    }, []);

    console.log("🚀 ~ UserAds ~ userData:", userData)

    return (
        <div>
            ji
        </div>
    )
}
export default UserAds