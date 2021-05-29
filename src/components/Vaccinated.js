import { STATISTIC_CONFIGS} from '../helpers/constants.js';
import {formatNumber, getStatistic} from '../helpers/commonFunctions';
import equal from 'fast-deep-equal';
import { memo } from 'react';

function Vaccinated({data}) {

    function format(date, tmp){
        //write code for edge case of night
        return [
            (tmp = date.getDate() - 1) +
            ([, 'st', 'nd', 'rd'][/1?.$/.exec(tmp)] || 'th'),
            [ 'January', 'February', 'March', 'April',
                'May', 'June', 'July', 'August',
                'September', 'October', 'November', 'December'
            ][date.getMonth()],
            date.getFullYear()
        ].join('')
    }

// test formatting for all dates within a month from today

    var day = 864e5, today = +new Date;
    const vaccineURL = "https://www.mohfw.gov.in/pdf/CumulativeCovidVaccinationCoverageReport"+format(new Date(today))+".pdf"

    const total = getStatistic(data, 'total', 'vaccinated')
    return (
        <figure className="bg-red-100 rounded-xl p-2">
            <a
                href={vaccineURL}
                target="_blank">
                <div className="flex flex-row" style={{color: "#df648b"}}>
                    <div className="flex flex-row ">
                        <span className="material-icons text-base mr-1">favorite</span>
                        <div className="mr-2">
                        {formatNumber(Math.floor(total))}
                        </div>
                    </div>
                    <div>
                        {STATISTIC_CONFIGS['vaccinated'].displayName}
                    </div>
                </div>
        </a>
        </figure>
    );
}

const isEqual = (prevProps, currProps) => {
    if (!equal(prevProps.data, currProps.data)) {
        return false;
    }
    return true;
};

export default memo(Vaccinated, isEqual);