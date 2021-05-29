import NavToolbar from "../NavToolbar";
import '../../helpers/scss/Table.scss';
import {retry} from '../../helpers/commonFunctions';
import {lazy, useState, Suspense, useEffect} from 'react';
import {Route, Redirect, Switch, useLocation} from 'react-router-dom';
import {AuthProvider} from "../../helpers/Auth";
import PrivateRoute from "../../helpers/PrivateRoute";
import Footer from "../Footer";
const Verify = lazy(() => retry(() =>  import("./Verify")));
const DistrictData = lazy(() => retry(() =>  import("../DistrictData")));
const District = lazy(() => retry(() =>  import("./District")));
const Contribute = lazy(() => retry(() =>  import("./Contribute")));
const State = lazy(() => retry(() => import('./State')));
const Home = lazy(() => retry(() => import('./Home')));
const MasterVerify = lazy(()=> retry(()=>import('./MasterDashboard')))

const App = () => {
    const location = useLocation();

    const pages = [
        {
            pageLink: '/',
            view: Home,
            displayName: 'Home',
            showInNavbar: true,
        },
        {
            pageLink: '/resource/:stateName/:cityName/:cityCode',
            view: DistrictData,
            displayName: 'Your District',
            showInNavbar: false,
        },
        {
            pageLink: '/resource',
            view: District,
            displayName: 'Your District',
            showInNavbar: true,
        },
        {
            pageLink: '/contribute',
            view: Contribute,
            displayName: 'Contribute',
            showInNavbar: true,
        },
        {
            pageLink: '/state/:stateCode',
            view: State,
            displayName: 'State',
            showInNavbar: false,
        },{
            pageLink: '/verify',
            view: Verify,
            displayName: 'Verify',
            showInNavbar: true,
        },{
            pageLink: '/masterDashboard',
            view: MasterVerify,
            displayName: 'MasterDashboard',
            showInNavbar: false,
        }
    ];

    return (
        <div className="bg-gray-100 min-h-screen h-auto">
            <AuthProvider>
                <NavToolbar pages={pages}/>
                <Suspense fallback={<div />}>
                    <Switch location={location}>
                        <PrivateRoute exact path='/verify' component={Verify} />
                        <PrivateRoute exact path='/masterDashboard' component={MasterVerify} />
                        {pages.map((page, index) => {
                            return (
                                <Route
                                    exact
                                    path={page.pageLink}
                                    render={({match}) => <page.view />}
                                    key={index}
                                />
                            );
                        })}
                        <Redirect to="/" />
                    </Switch>
                </Suspense>
                <Footer />
            </AuthProvider>
        </div>
    );
}

export default App;
