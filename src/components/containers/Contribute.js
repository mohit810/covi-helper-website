import { Dialog, Transition } from "@headlessui/react";
import React, {useContext, useRef, useState, Fragment, useCallback} from 'react';
import {AuthContext} from "../../helpers/Auth";
import {ContributeCardData} from "../../helpers/ContributeCardData";
import ContributionForm from "../ContributionForm";
import {States} from "../../helpers/States";
import {COVI_HELPER_API} from "../../helpers/constants";
import {useForm} from "react-hook-form";

export default function Contribute () {
    const {currentUser} = useContext(AuthContext)
    const [open, setOpen] = useState(false);
    const [openVolunteer, setOpenVolunteer] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false)
    const [volunteerStatus, setVolunteerStatus] = useState(1)
    const [resource, setResource] = useState("")
    const cancelButtonRef = useRef();
    const [volunteerPhoneNumber,setVolunteerPhoneNumber] = useState('')
    const { register, handleSubmit,formState: { errors } } = useForm()

    function closeModal() {
        setOpen(false);
    }

    function openModal(data) {
        if (data.id === 'volunteer') {
            setResource(data)
            setOpenVolunteer(true)
        }
        else {
            setResource(data)
            setOpen(true);
        }
    }

    const handleLogin = useCallback(
        async event =>{
            try {
                const provider = new window.firebase.auth.GoogleAuthProvider();
                provider.addScope('https://www.googleapis.com/auth/userinfo.profile');

                //log-out
                /* await window.firebase.auth().signOut()
                     .then(() => {
                         // Sign-out successful.
                     }).catch((error) => {
                         // An error happened.
                         alert(error)
                     });*/

                //login
                await window.firebase.auth().setPersistence(window.firebase.auth.Auth.Persistence.LOCAL)
                    .then(() => {
                        return (window.firebase.auth().signInWithPopup(provider)
                            .then((result)=>{
                                const data = {
                                    email: result.additionalUserInfo.profile.email,
                                    id: result.additionalUserInfo.profile.id,
                                    name:result.additionalUserInfo.profile.name,
                                    phoneNumber: volunteerPhoneNumber,
                                    picture : result.additionalUserInfo.profile.picture.replace("s96-c","s400"),
                                    allowed: false
                                };
                                fetch(`${COVI_HELPER_API}/registerVolunteer`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(data),
                                })
                                    .then(response => response.status)
                                    .then(data => {
                                        setOpenVolunteer(false);
                                        setVolunteerStatus(data.valueOf())
                                        setAlertOpen(true)
                                    })
                                    .catch((error) => {
                                        console.error('Error:', error);
                                    });
                            })
                            .catch((e)=>{
                                console.error('Error:', e);
                            }))
                    })
                    .catch((error) => {
                        // Handle Errors here.
                        console.log(error.message)
                    });
            } catch (e) {
                //alert(e)
                console.error('Error:', e);
            }});

    const volunteerSubmit = (data) => {
        setVolunteerPhoneNumber(data.phone_number)
        handleLogin()
    }

    return(
        <div className="h-full">
            <section className="text-gray-600 body-font">
                <div className="px-5 py-16">
                    <div className="flex flex-col text-center w-full mb-20">
                        <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
                            Add Resources available in your Locality or You can also become a volunteer and verify Resources.
                        </h1>
                    </div>
                    <div className="flex flex-wrap justify-center ">
                        {ContributeCardData.map((data)=>{
                                return(
                                    < React.Fragment key={data.id}>
                                        {data.id === 'all'?
                                            (<></>): (
                                            <div className="p-4 my-4 mx-4 w-auto md:w-1/3 bg-white rounded-xl flex">
                                            <div
                                                className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-blue-100 text-indigo-500 mb-4 flex-shrink-0">
                                                {data.img}
                                            </div>
                                            <div className="flex-grow flex flex-col pl-4">
                                                <h2 className="text-gray-900 text-lg title-font font-medium mb-2">{data.name}</h2>
                                                <p className="leading-relaxed text-base text-justify my-auto">{data.details}</p>
                                                <button className="mt-3 px-4 w-max py-2 text-blue-900 inline-flex align-bottom items-center bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                                        onClick={() => openModal(data)}
                                                        type="button">Click Here
                                                    <i className="material-icons text-center text-lg ml-1">arrow_forward</i>
                                                </button>
                                            </div>
                                        </div>
                                        )}
                                    </React.Fragment>
                                )
                            }
                        )}
                    </div>
                </div>
            </section>
            <Transition show={open} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    initialFocus={cancelButtonRef}
                    static
                    open={open}
                    onClose={closeModal}
                >
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-full max-w-md p-6 mb-4 mt-20 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                > Add Resource
                                </Dialog.Title>
                                <ContributionForm parentCallback={closeModal} resourceType={resource} states={States} />
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
            <Transition show={openVolunteer} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    initialFocus={cancelButtonRef}
                    static
                    open={openVolunteer}
                    onClose={setOpenVolunteer}
                >
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-full max-w-md p-6 mb-4 mt-20 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                > Let's get you Started
                                </Dialog.Title>

                                <div className="mt-2">
                                    <form
                                        autoComplete="on" >
                                        <div className="col-span-6 my-1 mr-0 sm:mr-1">
                                            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                                                Enter Your Phone Number
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
                                    </form>
                                </div>

                                <div className="mt-4">
                                    <button
                                        type="button"
                                        className="inline-flex h-10 justify-center text-sm font-medium text-blue-900 bg-white shadow-md border border-transparent rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                        onClick={handleSubmit(volunteerSubmit)}>
                                        <img className="my-auto p-1 h-7"
                                             src={"/icons/btn_google.svg"}  alt="google sign in image"/>
                                        <span className="my-auto pr-1 text-base">Sign In</span>
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
            {currentUser == null ?
                (<></>):(
                    <Transition.Root show={alertOpen} as={Fragment}>
                        <Dialog
                            as="div"
                            static
                            className="fixed z-10 inset-0 overflow-y-auto"
                            initialFocus={cancelButtonRef}
                            open={alertOpen}
                            onClose={setAlertOpen}
                        >
                            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                                </Transition.Child>

                                {/* This element is to trick the browser into centering the modal contents. */}
                                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                >
                                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                            <div className="sm:flex sm:items-start">
                                                {currentUser.photoURL === "" ? <span className="material-icons text-yellow-400 text-4xl p-2.5">person_outline</span>: <img className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-11 sm:w-11" aria-hidden="true" src={currentUser.photoURL}/>}
                                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                                        {volunteerStatus == 201 ?
                                                            <>Thanks! {currentUser.displayName} for Becoming a Volunteer</> :
                                                            <>Welcome Back {currentUser.displayName}!</>}
                                                    </Dialog.Title>
                                                    <div className="mt-2">
                                                        <p className="text-sm text-gray-500">
                                                            {volunteerStatus == 201 ?
                                                                <>It brings us Immense Joy to know that you have taken time to contribute in helping people in these difficult times. Head over to verify Tab to start Verifying the Leads.</> :
                                                                <>Welcome Back! Thanks for coming back. You know the drill.</>}

                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                            <button
                                                type="button"
                                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                onClick={() => setAlertOpen(false)}
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </Transition.Child>
                            </div>
                        </Dialog>
                    </Transition.Root>
                )}
        </div>
    )
}