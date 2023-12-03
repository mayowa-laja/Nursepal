export const PatientsPage = () => {
    return (
        <div className="container-fluid">
            <div className="row mb-4">
                <div className="col">
                    <h1 id="title">Patients Page</h1>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <h3>Patients:</h3>
                    <ul className="list-unstyled">
                        <li>
                            <div className="container rounded bg-success text-white border" rounded>
                                John Doe
                            </div>
                        </li>
                        <li>
                            <div className="container rounded bg-success text-white border" rounded>
                                Jack Doe
                            </div>
                        </li>
                        <li>
                            <div className="container rounded bg-success text-white border" rounded>
                                Jane Doe
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}