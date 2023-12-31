import { useEffect } from "react"
import '../../css/HomePage.css';

export const HomePage = () => {
    useEffect(() => {
        if (localStorage.getItem('loggedIn') === null){
            window.location.href = '/login';
        }
    }, []);

    return (
        <div className="container-fluid">
            <div className="row mb-4">
                <div className="col">
                    <h1 id="title">Welcome User1!</h1>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <h3>Medicine Round:</h3>
                    <ul>
                        <li>Paracetamol</li>
                        <li>Ibruprofen</li>
                        <li>Panadol</li>
                    </ul>
                </div>
                <div className="col">
                    <h3>Number of Patients Assigned to you: 3</h3>
                    <ul className="list-unstyled">
                        <li>
                            <div className="container rounded bg-secondary mb-2" rounded="true">
                                John Doe
                            </div>
                        </li>
                        <li>
                            <div className="container rounded bg-secondary mb-2" rounded="true">
                                Jack Doe
                            </div>
                        </li>
                        <li>
                            <div className="container rounded bg-secondary mb-2" rounded="true">
                                Jane Doe
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}