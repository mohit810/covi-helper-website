import React, {useContext, useEffect, useState} from 'react';
import submitAnimation from "./lottie/600-submit-button.json";
import Lottie from 'react-lottie';
import {COVI_HELPER_API} from "../helpers/constants";
import {ContributeCardData} from "../helpers/ContributeCardData";
import {AuthContext} from "../helpers/Auth";
import StateDropdown from "../helpers/StateDropdown";
import CityDropdown from "../helpers/CityDropdown";
import {States} from "../helpers/States";

function VerifyDetailsForm({lead,resourceType, parentCallback,city,state,updateUI}) {
    const allCities = window.cities()
    const [citySelected, setCitySelected] = useState(city)
    const [selectedState,setSelectedState] = useState(state)
    const [shortlistedCities,setShortlistedCities]= useState([{id:0,name:"Choose One",state_id:"101"}])
    const {currentUser} = useContext(AuthContext)
    const [issStopped,setIssStopped] = useState(true)
    const [errorFaced,setErrorFaced] = useState(false)
    const [resource,setResource] = useState(ContributeCardData[0])
    const [plasmaForm,setPlasmaForm] = useState(false)
    const [dateRecovery,setDateRecovery] = useState(resourceType.notes)
    const [resourceName,setResourceName] = useState(resourceType.name)
    const [resourceLeadType,setResourceLeadType] = useState(resourceType.lead_type)
    const [resourceAddress,setResourceAddress] = useState(resourceType.address)
    const [resourceURL,setResourceURL] = useState(resourceType.url)
    const [resourcePhoneNumber,setResourcePhoneNumber] = useState(resourceType.phoneNumber)
    const [resourceWhatsappNumber,setResourceWhatsappNumber] =useState(resourceType.whatsappNumber)
    const [resourceWebsite,setResourceWebsite] = useState(resourceType.website)
    const [valid, setValid] = useState(false);

    useEffect(() => {
        // regex for DD-MM-YYYY
        const regexddmmyyyy = /^(0[1-9]|[12][0-9]|3[01])[ /.](0[1-9]|1[012])[ /.](19|20)\d\d$/;

        if (regexddmmyyyy.test(dateRecovery)) {
            setValid(true);
        } else {
            setValid(false);
        }

    }, [dateRecovery]);

    useEffect(()=>{
        renderIcon()
    },[lead])

    const handleDateChanged = (e) => { setDateRecovery(e.target.value); };

    const handleNameChange = (e) => { setResourceName(e.target.value) };

    const handleLeadTypeChange = (e) => { setResourceLeadType(e.target.value) };

    const handleAddressChange = (e) => { setResourceAddress(e.target.value) };

    const handleURLChange = (e) => { setResourceURL(e.target.value) };

    const handlePhoneNumberChange = (e) => { setResourcePhoneNumber(e.target.value) };

    const handleWhatsappNumberChange = (e) => { setResourceWhatsappNumber(e.target.value) }

    const handleWebsiteChange = (e) => { setResourceWebsite(e.target.value) };

    const shortlist =(stateDetail) => {
        setSelectedState(stateDetail)
        const cities = allCities.filter((city, index, arr) => {
            return city.state_id == stateDetail.id
        });
        setShortlistedCities(cities)
    }

    const selectedCity = (childData) =>{
        setCitySelected(childData)
    }

    const plasmaDate = () => {
        setPlasmaForm(true)
        var isoDateTime = new Date(resourceType.notes);
        var localDateTime = isoDateTime.toLocaleDateString()
        setDateRecovery(localDateTime)
    }

    const onTrigger = (event) => {
        parentCallback();
    }

    const renderIcon = () => {
        setPlasmaForm(false)
        if (lead === "Oxygen"){
            setResource(ContributeCardData[0])
        } else if (lead === "Bed"){
            setResource(ContributeCardData[1])
        }else if (lead === "Plasma"){
            setResource(ContributeCardData[2])
            plasmaDate()
        }else if (lead === "Medicine"){
            setResource(ContributeCardData[3])
        }else if (lead === "Ambulance"){
            setResource(ContributeCardData[4])
        }else if (lead === "Helping Hand"){
            setResource(ContributeCardData[5])
        }
    }

    const defaultOptions = {
        loop: false,
        autoplay: false,
        animationData: submitAnimation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    const onSubmit = data => {
        const tempTimestamp = new Date()
        tempTimestamp.toISOString()
        if (plasmaForm) {
            if (valid){
                var tempdate = dateRecovery.split("/");
                var ISOFormat = new Date(parseInt(tempdate[2]), parseInt(tempdate[1]) - 1, parseInt(tempdate[0]));
                ISOFormat.toISOString()
                const jsonData = {
                    "id": resourceType.id,
                    "name": resourceName,
                    "lead_type": resourceLeadType,
                    "address": resourceAddress,
                    "url": resourceURL,
                    "phoneNumber": resourcePhoneNumber,
                    "whatsappNumber": resourceWhatsappNumber,
                    "website": resourceWebsite,
                    "notes": ISOFormat,
                    "verified_by": currentUser.email,
                    "verfied_time": tempTimestamp,
                    "statecode": selectedState.id,
                    "citycode": citySelected.id
                }
                submitFormApi(jsonData)
            }
        } else {
            const jsonData = {
                "id": resourceType.id,
                "name": resourceName,
                "lead_type": resourceLeadType,
                "address": resourceAddress,
                "url": resourceURL,
                "phoneNumber": resourcePhoneNumber,
                "whatsappNumber": resourceWhatsappNumber,
                "website": resourceWebsite,
                "notes": dateRecovery,
                "verified_by": currentUser.email,
                "verfied_time": tempTimestamp,
                "statecode": selectedState.id,
                "citycode": citySelected.id
            }
            submitFormApi(jsonData)
        }
    }

    const submitFormApi = (jsonData) => {
        fetch(`${COVI_HELPER_API}/verify${resource.id}`, {
            method: 'POST',
            body: JSON.stringify(jsonData)
        }).then(response => response.status)
            .then(data => {
                if (data.valueOf() == 201) {
                    setIssStopped(false)
                    setTimeout(updateUI("submit"), 3000)
                } else {
                    setErrorFaced(true)
                }
            })
            .catch((error) => {
                setErrorFaced(true)
            });
    }

    const onDelete = () => {
        fetch(`${COVI_HELPER_API}/remove${resource.id}/${resourceType.id}`, {
            method: 'DELETE'
        }).then(response => response.status)
            .then(data => {
                if (data.valueOf() == 202) {
                    updateUI("delete")
                } else {
                    setErrorFaced(true)
                }
            })
            .catch((error) => {
                setErrorFaced(true)
            });
    }

    return(
        <div className="md:grid ">
            <div className="mt-5 md:mt-0 md:col-span-2">
                <form
                    autoComplete="on" >
                    <div className="grid grid-cols-6 ">
                        <div className="col-span-6 my-1">
                            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={resourceName}
                                onChange={handleNameChange}
                                id="name"
                                autoComplete="cc-family-name"
                                className="mt-1 p-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                            />
                            <span className="text-sm text-blue-500">This field is required with minimum length 2.</span>
                        </div>

                        <div className="col-span-6 sm:col-span-4 my-1">
                            <label htmlFor="lead_type" className="block text-sm font-medium text-gray-700">
                                Type of {lead} Lead
                            </label>
                            <select
                                id="lead_type"
                                name="lead_type"
                                value={resourceLeadType}
                                autoComplete="lead_type"
                                onChange={handleLeadTypeChange}
                                className="mt-1 p-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                {resource.leadType.map((data)=>{
                                    return <option key={data.name} >{data.name}</option>
                                })}
                            </select>
                        </div>

                        <div className="col-span-6 sm:col-span-3 my-1 mr-0 sm:mr-1">
                            <StateDropdown displayText={"Choose State"} displayData={States} displayState={state} parentCallback = {shortlist} />
                            {selectedState.name == "Choose One" ? (<span className="text-sm text-red-500">Please choose a State.</span>):(<></>)}
                        </div>

                        <div className="col-span-6 sm:col-span-3 my-1 ml-0 sm:ml-1">
                            <CityDropdown displayText={"Choose District"} displayData={shortlistedCities} displayCity={city} parentCallback = {selectedCity}/>
                            {citySelected.name == "Choose One" ? (<span className="text-sm text-red-500">Please choose a City.</span>):(<></>)}
                        </div>


                        <div className="col-span-6 my-1">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Address
                            </label>
                            <input
                                type="text"
                                value={resourceAddress}
                                onChange={handleAddressChange}
                                name="address"
                                id="address"
                                autoComplete="address"
                                className="mt-1 p-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                            />
                            <span className="text-sm text-blue-500">This field is required with minimum and maximum length is 2 and 200.</span>
                        </div>
                        <div className="col-span-6 my-1">
                            <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                                Google Map Link
                            </label>
                            <input
                                type="url"
                                name="url"
                                value={resourceURL}
                                onChange={handleURLChange}
                                id="url"
                                className="mt-1 p-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                            />
                            <span className="text-sm text-blue-500">If a URL is present, Please make sure it is Google Map URL</span>
                        </div>

                        <div className="col-span-6 my-1 mr-0 sm:mr-1">
                            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                name="phone_number"
                                value={resourcePhoneNumber}
                                onChange={handlePhoneNumberChange}
                                id="phone_number"
                                autoComplete="tel"
                                className="mt-1 p-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                            />
                            <span className="text-sm text-blue-500">Phone number is required with minimum length 8 and please use 0 instead of +91.</span>
                        </div>

                        <div className="col-span-6 my-1 ml-0 ">
                            <label htmlFor="whatsapp_number" className="block text-sm font-medium text-gray-700">
                                Whatsapp Number
                            </label>
                            <input
                                type="text"
                                name="whatsapp_number"
                                value={resourceWhatsappNumber}
                                onChange={handleWhatsappNumberChange}
                                id="whatsapp_number"
                                autoComplete="tel"
                                className="mt-1 p-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="col-span-6 my-1 ml-0">
                            <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                                Website
                            </label>
                            <input
                                type="url"
                                name="url"
                                value={resourceWebsite}
                                onChange={handleWebsiteChange}
                                id="url"
                                autoComplete="url"
                                className="mt-1 p-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                            />
                            <span className="text-sm text-blue-500">If a URL is present, Please make sure it is like this- https://www.google.com</span>
                        </div>
                        <div className="col-span-6 my-1">
                            <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                                {lead == "Plasma"? <>Date of Recovery</>:<>Notes</>}
                            </label>
                            {lead == "Plasma"? (
                                <div>
                                    <input
                                        type="text"
                                        name="number"
                                        placeholder="dd/mm/yyyy"
                                        value={dateRecovery}
                                        onChange={handleDateChanged}
                                        id="number"
                                        className="mt-1 p-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                                    />
                                    {valid ? <></> : <h3 className="text-sm text-red-500">Invalid Date</h3>}
                                    <span className="text-sm text-blue-500"> This Field is required. (In case of All or BloodBank, please enter any date)</span>
                                </div>
                            ):(
                                <input
                                    type="text"
                                    name="notes"
                                    placeholder={"notes"}
                                    value={dateRecovery}
                                    onChange={handleDateChanged}
                                    id="notes"
                                    autoComplete="off"
                                    className="mt-1 p-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                                />
                            )}
                        </div>
                    </div>
                    <div className="mt-4">
                        {resourceType.verified_by === "" ? (
                            <>
                                {errorFaced ? (
                                    <div className="flex flex-wrap">
                                        <button
                                            type="button"
                                            className="flex-none h-10 inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600"
                                            onClick={onTrigger}
                                        >
                                            Close
                                        </button>
                                        <div className="flex-1 pl-4">
                                            We faced some error. Please try after sometime.
                                        </div>
                                    </div>
                                ):(
                                    <div className="flex flex-wrap">
                                        <button
                                            type="button"
                                            className="flex-1 -ml-1 my-1 inline-flex justify-center text-sm font-medium border border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                            onClick={onSubmit}
                                        >
                                            <Lottie
                                                options={defaultOptions}
                                                height="2.3rem"
                                                width="9.7rem"
                                                isStopped={issStopped}
                                            />
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-1 h-10 inline-flex justify-center mx-2 my-1 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600"
                                            onClick={onDelete}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-1 h-10 inline-flex justify-center mx-2 my-1 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                            onClick={onTrigger}
                                        >
                                            Close
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                {errorFaced ? (
                                    <div className="flex flex-wrap">
                                        <button
                                            type="button"
                                            className="flex-none h-10 inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600"
                                            onClick={onTrigger}
                                        >
                                            Close
                                        </button>
                                        <div className="flex-1 pl-4">
                                            We faced some error. Please try after sometime.
                                        </div>
                                    </div>
                                ):(
                                    <div className="flex flex-wrap">
                                        <button
                                            type="button"
                                            className="flex-1 h-10 inline-flex justify-center mx-2 my-1 py-2 text-sm font-medium text-white bg-red-500 border border-transparent rounded-md hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600"
                                            onClick={onDelete}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-1 h-10 inline-flex justify-center mx-2 my-1 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                            onClick={onTrigger}
                                        >
                                            Close
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default VerifyDetailsForm;