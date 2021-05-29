const Loader = () => {
    let circleCommonClasses = 'h-2.5 w-2.5 bg-green-500 rounded-full';

    return (
        <div className='h-screen w-screen grid grid-cols-1 gap-2 place-content-center text-center'>
            <div className="flex flex-wrap place-content-center">
                <div className={`${circleCommonClasses} mr-1 animate-bounce`}/>
                <div className={`${circleCommonClasses} mr-1 animate-bounce200`}/>
                <div className={`${circleCommonClasses} animate-bounce400`}/>
            </div>
            <div>Loading...</div>
        </div>
    );
};

export default Loader;