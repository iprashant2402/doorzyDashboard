import React from "react";
import ".././css/custom-theme.scss";
import {Link} from "react-router-dom";

const NoMatch = () => {
    return(
        <div className="container-fluid bg-primary full-view">
            <div className="row">
                <div className="col col-md-6 col-sm-12 offset-md-3 nomatch-wrapper">
                    <img src={require(".././images/logo_1.png")} alt="No-Match" className="logo-nomatch"/>
                    <div className="border-left border-white">
                    <h3 className="text-white">Error 404</h3>
                    <p className="text-white">The requested URL does not exist on this server.</p>
                    <p className="text-white">That's all we know</p>
                    </div>
                    <Link to="/app"><button className="btn btn-success">Home</button></Link>
                </div>
            </div>
        </div>
    );
}

export default NoMatch;