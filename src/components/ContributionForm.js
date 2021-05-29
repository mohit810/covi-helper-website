import React, {useEffect, useState} from 'react';
import StateDropdown from "../helpers/StateDropdown";
import CityDropdown from "../helpers/CityDropdown";
import submitAnimation from "./lottie/600-submit-button.json";
import Lottie from 'react-lottie';
import { useForm } from 'react-hook-form';
import {COVI_HELPER_API} from "../helpers/constants";

function ContributionForm({resourceType, parentCallback, states}) {
    const allCities = window.cities()
    const [citySelected, setCitySelected] = useState({id:0,name:"Choose One",state_id:"101"})
    const [selectedState,setSelectedState] = useState({id:0,name:"Choose One",country_id:"101"})
    const [shortlistedCities,setShortlistedCities]= useState([{id:0,name:"Choose One",state_id:"101"}])
    const [isStopped,setIsStopped] = useState(true)
    const [errorFaced,setErrorFaced] = useState(false)
    const { register, handleSubmit,formState: { errors } } = useForm()
    const [date, setDate] = useState();
    const [valid, setValid] = useState(false);
    const [plasmaForm,setPlasmaForm] = useState(false)

    useEffect(() => {
        // regex for DD-MM-YYYY
        const regexddmmyyyy = /^(0[1-9]|[12][0-9]|3[01])[ /.](0[1-9]|1[012])[ /.](19|20)\d\d$/;

        if (regexddmmyyyy.test(date)) {
            setValid(true);
        } else {
            setValid(false);
        }
        { resourceType.id == "plasma" ? setPlasmaForm(true) : setPlasmaForm(false)}
    }, [date]);

    const handleChanged = (e) => {
        setDate(e.target.value);
    };

    const onTrigger = (event) => {
        parentCallback();
    }

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
            if (selectedState.name != "Choose One" && citySelected.name != "Choose One" && valid) {
                var tempdate = date.split("/");
                var ISOFormat = new Date(parseInt(tempdate[2]),parseInt(tempdate[1])-1,parseInt(tempdate[0]));
                ISOFormat.toISOString()
                const jsonData = {
                    "name": data.name,
                    "lead_type": data.lead_type,
                    "address": data.address,
                    "url": data.url,
                    "phoneNumber": data.phone_number,
                    "whatsappNumber": data.whatsapp_number,
                    "website":data.website,
                    "notes": ISOFormat,
                    "creationTime": tempTimestamp,
                    "statecode": selectedState.id,
                    "citycode":citySelected.id
                }
                submitFormApi(jsonData)
            }
        } else {
            if (selectedState.name != "Choose One" && citySelected.name != "Choose One") {
                const jsonData = {
                    "name": data.name,
                    "lead_type": data.lead_type,
                    "address": data.address,
                    "url": data.url,
                    "phoneNumber": data.phone_number,
                    "whatsappNumber": data.whatsapp_number,
                    "website":data.website,
                    "notes": data.notes,
                    "creationTime": tempTimestamp,
                    "statecode": selectedState.id,
                    "citycode":citySelected.id
                }
                submitFormApi(jsonData)
            }
        }
    }

    const submitFormApi = (jsonData) => {
        fetch(`${COVI_HELPER_API}/add${resourceType.id}`, {
            method: 'POST',
            body: JSON.stringify(jsonData)
        }).then(response => response.status)
            .then(data => {
                if (data.valueOf() == 201) {
                    setIsStopped(false)
                    setTimeout(onTrigger, 3000)
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
                                {...register("name", { required: true, minLength: 2, maxLength: 30 })}
                                id="name"
                                autoComplete="cc-family-name"
                                className="mt-1 p-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                            />
                            {errors.name && <span className="text-sm text-red-500">This field is required with minimum length 2.</span>}
                        </div>

                        <div className="col-span-6 sm:col-span-4 my-1">
                            <label htmlFor="lead_type" className="block text-sm font-medium text-gray-700">
                                Type of {resourceType.resourceType} Lead
                            </label>
                            <select
                                id="lead_type"
                                name="lead_type"
                                {...register("lead_type")}
                                autoComplete="lead_type"
                                className="mt-1 p-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                {resourceType.leadType.map((data)=>{
                                    return <option key={data.name} >{data.name}</option>
                                })}
                            </select>
                        </div>

                        <div className="col-span-6 sm:col-span-3 my-1 mr-0 sm:mr-1">
                            <StateDropdown displayText={"Choose State"} displayData={states} displayState={selectedState}  parentCallback = {shortlist} />
                            {selectedState.name == "Choose One" ? (<span className="text-sm text-red-500">Please choose a State.</span>):(<></>)}
                        </div>

                        <div className="col-span-6 sm:col-span-3 my-1 ml-0 sm:ml-1">
                            <CityDropdown displayText={"Choose District"} displayData={shortlistedCities} displayCity={citySelected} parentCallback = {selectedCity}/>
                            {citySelected.name == "Choose One" ? (<span className="text-sm text-red-500">Please choose a City.</span>):(<></>)}
                        </div>

                        <div className="col-span-6 my-1">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Address
                            </label>
                            <input
                                type="text"
                                {...register("address", { required: true, minLength: 2, maxLength: 200 })}
                                name="address"
                                id="address"
                                autoComplete="address"
                                className="mt-1 p-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                            />
                            {errors.address && <span className="text-sm text-red-500">This field is required with minimum and maximum length is 2 and 200.</span>}
                        </div>
                        <div className="col-span-6 my-1">
                            <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                                Google Map Link
                            </label>
                            <input
                                type="url"
                                name="url"
                                {...register("url")}
                                id="url"
                                className="mt-1 p-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="col-span-6 my-1 mr-0 sm:mr-1">
                            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                name="phone_number"
                                {...register("phone_number", { required: true,
                                    maxLength: 13,
                                    minLength: 8,
                                    pattern:/^(91[-\s]?)?[0]?(91)?[789]\d{9}$/})}
                                id="phone_number"
                                autoComplete="tel"
                                className="mt-1 p-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                            />
                            {errors.phone_number && <span className="text-sm text-red-500">Phone number is required with minimum length 8 and please use 0 instead of +91.</span>}
                        </div>

                        <div className="col-span-6 my-1 ml-0 ">
                            <label htmlFor="whatsapp_number" className="block text-sm font-medium text-gray-700">
                                Whatsapp Number
                            </label>
                            <input
                                type="text"
                                name="whatsapp_number"
                                {...register("whatsapp_number")}
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
                                {...register("website")}
                                id="url"
                                autoComplete="url"
                                className="mt-1 p-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                            />
                            <span className="text-sm text-blue-500">This field is optional. If you are filling this, here is an ex- https://www.google.com</span>
                        </div>
                        <div className="col-span-6 my-1">
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                {resourceType.id == "plasma"? <>Date of Recovery</>:<>Notes</>}
                            </label>
                            {resourceType.id == "plasma"? (
                                <div>
                                    <input
                                        type="text"
                                        placeholder="dd/mm/yyyy"
                                        name="notes"
                                        {...register("notes",{ required: true })}
                                        id="notes"
                                        onChange={handleChanged}
                                        className="mt-1 p-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                                    />
                                    {valid ? <></> : <p className="text-sm text-red-500">Invalid Date</p>}
                                    {errors.notes && <span className="text-sm text-red-500"> This Field is required.(In case of All or BloodBank, please enter any date.)</span>}
                                </div>
                            ):(
                                <input
                                    type="text"
                                    name="notes"
                                    {...register("notes")}
                                    id="notes"
                                    className="mt-1 p-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                                />
                            )}

                        </div>
                    </div>
                    <div className="mt-4">
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
                            <button
                                type="button"
                                className="-ml-1 inline-flex justify-center text-sm font-medium border border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                onClick={handleSubmit(onSubmit)}
                            >
                                <Lottie
                                    options={defaultOptions}
                                    height="2.5rem"
                                    width="10rem"
                                    isStopped={isStopped}
                                />
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ContributionForm;