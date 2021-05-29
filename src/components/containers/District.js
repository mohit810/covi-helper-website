import React,{ lazy } from 'react';
import CityDropdown from "../../helpers/CityDropdown";
import StateDropdown from "../../helpers/StateDropdown";
import {States} from "../../helpers/States";
import Lottie from 'react-lottie';
import searchAnimation from '../lottie/49993-search.json';
import {withRouter} from "react-router";
import {retry} from "../../helpers/commonFunctions";
const DistrictData= lazy(() => retry(() => import("../DistrictData")));

class District extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {id: 0, name: "Choose One", state_id: "101"},
            allCities: window.cities(),
            shortlistedCities: [{id:0,name:"Choose One",state_id:"101"}],
            selectedState: {id:0,name:"Choose One",country_id:"101"}
        }
    }

    handleStateCallback = (stateDetail) => {
        this.setState({selectedState: stateDetail})
        const cities = this.state.allCities.filter((city, index, arr) => {
            return city.state_id == stateDetail.id
        });
        this.setState({shortlistedCities: cities})
    }

    handleCallback = (childData) =>{
        this.setState({data: childData})
    }

    render() {
        const defaultOptions = {
            loop: true,
            autoplay: true,
            animationData: searchAnimation,
            rendererSettings: {
                preserveAspectRatio: "xMidYMid slice"
            }
        };
        const { data,selectedState } = this.state;
        function renderCityDetail (cityDetail)  {
            if (cityDetail.id == 0 || cityDetail.id == null) {
                return (
                    <div className="flex flex-col">
                        <div className="flex-grow max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                            <div className="px-4 py-6 sm:px-0">
                                <div className="flex border-4 border-dashed border-gray-200 rounded-lg h-96" >
                                    <Lottie
                                        options={defaultOptions}
                                        height={400}
                                        width={400}
                                    />
                                </div>
                                <div className="text-center">
                                    Please choose your District to view Resources.
                                </div>
                            </div>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div>
                        <DistrictData cityDetail={cityDetail} statedetail={selectedState} />
                    </div>
                )
            }
        }
        return(
            <div className="h-full flex flex-col min-h-screen">
                <div className="w-screen">
                    <header className="bg-white space-x-4" >
                        <div className="flex flex-wrap px-4 sm:px-6 lg:px-8">
                            <div className="flex-1 m-1 z-40">
                                <StateDropdown displayText={"Choose State"} displayData={States} displayState={this.state.selectedState} parentCallback = {this.handleStateCallback}/>
                            </div>
                            <div className="flex-1 m-1 z-30">
                                <CityDropdown displayText={"Choose District"} displayData={this.state.shortlistedCities} displayCity={this.state.data} parentCallback = {this.handleCallback}/>
                            </div>
                        </div>
                    </header>
                </div>
                {renderCityDetail(data)}
            </div>
        )
    }
}

export default withRouter(District);