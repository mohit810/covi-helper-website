import {DATA_API_ROOT, STATE_NAMES} from '../../helpers/constants';
import useIsVisible from '../../helpers/hooks/useIsVisible';
import {
    fetcher,
    formatNumber,
    getStatistic,
    retry,
} from '../../helpers/commonFunctions';

import classnames from 'classnames';
import {
    memo,
    useMemo,
    useState,
    useEffect,
    lazy,
    Suspense,
    useRef,
} from 'react';
import {Smile} from 'react-feather';
import {Helmet} from 'react-helmet';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {useSessionStorage} from 'react-use';
import useSWR from 'swr';

const DeltaBarGraph = lazy(() => retry(() => import('../DeltaBarGraph')));
const StateLevel = lazy(() => retry(() => import('../state/StateLevel')));
const LevelVaccinated = lazy(() => retry(() => import('../LevelVaccinated')));
const MapExplorer = lazy(() => retry(() => import('../map/MapExplorer')));
const MapSwitcher = lazy(() => retry(() => import('../map/MapSwitcher')));
const StateMinigraphs = lazy(() => retry(() => import('../state/StateMinigraphs')));
const StateHeader = lazy(() => retry(() => import('../state/StateHeader')));
const StateMeta = lazy(() => retry(() => import('../state/StateMeta')));

function State() {
    const {t} = useTranslation();

    const stateCode = useParams().stateCode.toUpperCase();

    const [mapStatistic, setMapStatistic] = useSessionStorage(
        'mapStatistic',
        'active'
    );
    const [showAllDistricts, setShowAllDistricts] = useState(false);
    const [regionHighlighted, setRegionHighlighted] = useState({
        stateCode: stateCode,
        districtName: null,
    });

    useEffect(() => {
        if (regionHighlighted.stateCode !== stateCode) {
            setRegionHighlighted({
                stateCode: stateCode,
                districtName: null,
            });
            setShowAllDistricts(false);
        }
    }, [regionHighlighted.stateCode, stateCode]);

    const {data: timeseries, error: timeseriesResponseError} = useSWR(
        `${DATA_API_ROOT}/timeseries-${stateCode}.min.json`,
        fetcher,
        {
            revalidateOnMount: true,
            refreshInterval: 100000,
        }
    );

    const {data} = useSWR(`${DATA_API_ROOT}/data.min.json`, fetcher, {
        revalidateOnMount: true,
        refreshInterval: 100000,
    });

    const toggleShowAllDistricts = () => {
        setShowAllDistricts(!showAllDistricts);
    };

    const handleSort = (districtNameA, districtNameB) => {
        const districtA = data[stateCode].districts[districtNameA];
        const districtB = data[stateCode].districts[districtNameB];
        return (
            getStatistic(districtB, 'total', mapStatistic) -
            getStatistic(districtA, 'total', mapStatistic)
        );
    };

    const gridRowCount = useMemo(() => {
        if (!data) return;
        const gridColumnCount = window.innerWidth >= 540 ? 3 : 2;
        const districtCount = data[stateCode]?.districts
            ? Object.keys(data[stateCode].districts).filter(
                (districtName) => districtName !== 'Unknown'
            ).length
            : 0;
        const gridRowCount = Math.ceil(districtCount / gridColumnCount);
        return gridRowCount;
    }, [data, stateCode]);

    const stateMetaElement = useRef();
    const isStateMetaVisible = useIsVisible(stateMetaElement);

    const trail = useMemo(() => {
        const styles = [];

        [0, 0, 0, 0].map((element, index) => {
            styles.push({
                animationDelay: `${index * 250}ms`,
            });
            return null;
        });
        return styles;
    }, []);

    const lookback = showAllDistricts ? (window.innerWidth >= 540 ? 10 : 8) : 6;

    return (
        <>
            <Helmet>
                <title>
                    Covid-19 Outbreak in {STATE_NAMES[stateCode]}
                </title>
                <meta
                    name="title"
                    content={`Covid-19 Outbreak in ${STATE_NAMES[stateCode]}: Latest Map and Case Count`}
                />
            </Helmet>

            <div className="w-full flex flex-col  lg:flex-row">
                <div className="w-full lg:w-6/12 p-4 flex flex-col">
                    <div className="mb-4 " >
                        <StateHeader data={data?.[stateCode]} stateCode={stateCode}  />
                    </div>
                    <span ref={stateMetaElement} />
                    <div style={{position: 'relative'}} className="mt-2" >
                        <MapSwitcher {...{mapStatistic, setMapStatistic}} />
                        <StateLevel data={data?.[stateCode]} />
                        <StateMinigraphs
                            timeseries={timeseries?.[stateCode]?.dates}
                            {...{stateCode}}
                            forceRender={!!timeseriesResponseError}
                        />
                    </div>

                    <div className="py-3 flex justify-center inline-block">
                        {data?.[stateCode]?.total?.vaccinated && (
                            <LevelVaccinated data={data?.[stateCode]}  />
                        )}
                    </div>

                    {data && (
                        <Suspense fallback={<div style={{minHeight: '50rem'}} />}>
                            <MapExplorer
                                {...{
                                    stateCode,
                                    data,
                                    regionHighlighted,
                                    setRegionHighlighted,
                                    mapStatistic,
                                    setMapStatistic,
                                }}
                            />
                        </Suspense>
                    )}
                </div>

                <div className="w-full lg:w-6/12 p-4 flex-1">
                    <>
                        <div className="district-bar">
                            <div
                                className={classnames('district-bar-top', {
                                    expanded: showAllDistricts,
                                })}
                            >
                                <div className="district-bar-left">
                                    <h2
                                        className={classnames(mapStatistic, 'fadeInUp')}
                                        style={trail[0]}
                                    >
                                        {t('Top districts')}
                                    </h2>
                                    <div
                                        className={`districts fadeInUp md:grid-cols-2  ${
                                            showAllDistricts ? 'is-grid' : ''
                                        }`}
                                        style={
                                            showAllDistricts
                                                ? {
                                                    gridTemplateRows: `repeat(${gridRowCount}, 2rem)`,
                                                    ...trail[1],
                                                }
                                                : trail[1]
                                        }
                                    >
                                        {Object.keys(data?.[stateCode]?.districts || {})
                                            .filter((districtName) => districtName !== 'Unknown')
                                            .sort((a, b) => handleSort(a, b))
                                            .slice(0, showAllDistricts ? undefined : 5)
                                            .map((districtName) => {
                                                const total = getStatistic(
                                                    data[stateCode].districts[districtName],
                                                    'total',
                                                    mapStatistic
                                                );
                                                const delta = getStatistic(
                                                    data[stateCode].districts[districtName],
                                                    'delta',
                                                    mapStatistic
                                                );
                                                return (
                                                    <div key={districtName} className="district">
                                                        <h2>{formatNumber(total)}</h2>
                                                        <h5>{t(districtName)}</h5>
                                                        {mapStatistic !== 'active' && (
                                                            <div className="delta">
                                                                <h6 className={mapStatistic}>
                                                                    {delta > 0
                                                                        ? '\u2191' + formatNumber(delta)
                                                                        : ''}
                                                                </h6>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>

                                <div className="district-bar-right fadeInUp" style={trail[2]}>
                                    {timeseries &&
                                    (mapStatistic === 'confirmed' ||
                                        mapStatistic === 'deceased') && (
                                        <div className="happy-sign">
                                            {Object.keys(timeseries[stateCode]?.dates || {})
                                                .slice(-lookback)
                                                .every(
                                                    (date) =>
                                                        getStatistic(
                                                            timeseries[stateCode].dates[date],
                                                            'delta',
                                                            mapStatistic
                                                        ) === 0
                                                ) && (
                                                <div
                                                    className={`alert ${
                                                        mapStatistic === 'confirmed' ? 'is-green' : ''
                                                    }`}
                                                >
                                                    <Smile />
                                                    <div className="alert-right">
                                                        No new {mapStatistic} cases in the past five days
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    <DeltaBarGraph
                                        timeseries={timeseries?.[stateCode]?.dates}
                                        statistic={mapStatistic}
                                        {...{stateCode, lookback}}
                                        forceRender={!!timeseriesResponseError}
                                    />
                                </div>
                            </div>

                            <div className="district-bar-bottom">
                                {Object.keys(data?.[stateCode]?.districts || {}).length > 5 ? (
                                    <button
                                        className="button fadeInUp"
                                        onClick={toggleShowAllDistricts}
                                        style={trail[3]}
                                    >
                    <span>
                      {t(showAllDistricts ? 'View less' : 'View all')}
                    </span>
                                    </button>
                                ) : (
                                    <div style={{height: '3.75rem', flexBasis: '15%'}} />
                                )}
                            </div>
                        </div>

                        {isStateMetaVisible && data && (
                            <Suspense fallback={<div />}>
                                <StateMeta
                                    {...{
                                        stateCode,
                                        data,
                                    }}
                                    timeseries={timeseries?.[stateCode]?.dates}
                                />
                            </Suspense>
                        )}
                        {/*<Suspense fallback={<div />}>
                            <TimeseriesExplorer
                                {...{
                                    stateCode,
                                    timeseries,
                                    regionHighlighted,
                                    setRegionHighlighted,
                                }}
                                forceRender={!!timeseriesResponseError}
                            />
                        </Suspense>*/}
                    </>
                </div>
            </div>
        </>
    );
}

export default memo(State);
