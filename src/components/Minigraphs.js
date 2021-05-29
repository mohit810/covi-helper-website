import {
    MINIGRAPH_LOOKBACK_DAYS,
    PRIMARY_STATISTICS,
    STATISTIC_CONFIGS,
} from '../helpers/constants';
import {
    getStatistic,
    getIndiaDateYesterdayISO,
    parseIndiaDate,
    capitalize,
    formatNumber,
} from '../helpers/commonFunctions';
import {max} from 'd3-array';
import {interpolatePath} from 'd3-interpolate-path';
import {scaleTime, scaleLinear} from 'd3-scale';
import {select} from 'd3-selection';
import {line, curveMonotoneX} from 'd3-shape';
import 'd3-transition';
import {formatISO, subDays} from 'date-fns';
import equal from 'fast-deep-equal';
import {memo, useEffect, useRef, useMemo} from 'react';
import {useMeasure} from 'react-use';

// Dimensions
const margin = {top: 10, right: 10, bottom: 2, left: 10};
const height = 75;
const maxWidth = 120;

function PureLevelItem({statistic, total, delta, index, wrapperRef, refs, width}) {

    const statisticConfig = STATISTIC_CONFIGS[statistic];
    const deltaNumber = formatNumber(delta, statisticConfig.format, statistic)

    return (
        <div className="my-16">
            <div className="grid w-56 p-3 bg-center bg-cover bg-white rounded-lg shadow-lg">
                <div
                    className="flex-1 justify-self-center text-center pb-4"
                    ref={index === 0 ? wrapperRef : null} >
                    <h4 className="mb-2" style={{color: statisticConfig.color}}> {capitalize(statisticConfig.displayName)}</h4>
                    <svg
                        ref={(el) => {
                            refs.current[index] = el;
                        }}
                        preserveAspectRatio="xMidYMid meet"
                        width={width}
                        className="mb-4"
                        height={height}/>
                </div>
            </div>

            <div className="flex flex-col mx-10 -mt-10 overflow-hidden bg-white rounded-lg shadow-lg md:w-50 dark:bg-gray-800">
                <div className="flex justify-center mx-auto my-1 dark:bg-gray-700">
                    { deltaNumber.includes("-") ? <></> : <i className="block material-icons font-bold text-base" style={{color: statisticConfig.secondaryColor}}>add</i>}
                    <div className="font-bold text-base dark:text-gray-200" style={{color: statisticConfig.secondaryColor}}>{deltaNumber}</div>
                </div>
                <h3 className="py-1 mx-auto font-bold text-center tracking-wide uppercase" style={{color: statisticConfig.color}}>{formatNumber(total, statisticConfig.format, statistic)}</h3>
            </div>
        </div>
    );
}

const LevelItem = memo(PureLevelItem);

function Minigraphs({timeseries, date: timelineDate, data}) {
    const refs = useRef([]);
    const endDate = timelineDate || getIndiaDateYesterdayISO();

    let [wrapperRef, {width}] = useMeasure();
    width = 120;
    //width = Math.min(width, maxWidth);

    const dates = useMemo(() => {
        const pastDates = Object.keys(timeseries || {}).filter(
            (date) => date <= endDate
        );
        const lastDate = pastDates[pastDates.length - 1];

        const cutOffDateLower = formatISO(
            subDays(parseIndiaDate(lastDate), MINIGRAPH_LOOKBACK_DAYS),
            {representation: 'date'}
        );
        return pastDates.filter((date) => date >= cutOffDateLower);
    }, [endDate, timeseries]);

    useEffect(() => {
        if (!width) return;

        const T = dates.length;

        const chartRight = width - margin.right;
        const chartBottom = height - margin.bottom;

        const xScale = scaleTime()
            .clamp(true)
            .domain([
                parseIndiaDate(dates[0] || endDate),
                parseIndiaDate(dates[T - 1]) || endDate,
            ])
            .range([margin.left, chartRight]);

        refs.current.forEach((ref, index) => {
            const svg = select(ref);
            const statistic = PRIMARY_STATISTICS[index];
            const color = STATISTIC_CONFIGS[statistic].color;

            const dailyMaxAbs = max(dates, (date) =>
                Math.abs(getStatistic(timeseries[date], 'delta', statistic))
            );

            const yScale = scaleLinear()
                .clamp(true)
                .domain([-dailyMaxAbs, dailyMaxAbs])
                .range([chartBottom, margin.top]);

            const linePath = line()
                .curve(curveMonotoneX)
                .x((date) => xScale(parseIndiaDate(date)))
                .y((date) =>
                    yScale(getStatistic(timeseries[date], 'delta', statistic))
                );

            let pathLength;
            svg
                .selectAll('path')
                .data(T ? [dates] : [])
                .join(
                    (enter) =>
                        enter
                            .append('path')
                            .attr('fill', 'none')
                            .attr('stroke', color + '99')
                            .attr('stroke-width', 2.5)
                            .attr('d', linePath)
                            .attr('stroke-dasharray', function () {
                                return (pathLength = this.getTotalLength());
                            })
                            .call((enter) =>
                                enter
                                    .attr('stroke-dashoffset', pathLength)
                                    .transition()
                                    .delay(100)
                                    .duration(2500)
                                    .attr('stroke-dashoffset', 0)
                            ),
                    (update) =>
                        update
                            .attr('stroke-dasharray', null)
                            .transition()
                            .duration(500)
                            .attrTween('d', function (date) {
                                const previous = select(this).attr('d');
                                const current = linePath(date);
                                return interpolatePath(previous, current);
                            })
                            .selection()
                );

            svg
                .selectAll('circle')
                .data(T ? [dates[T - 1]] : [])
                .join(
                    (enter) =>
                        enter
                            .append('circle')
                            .attr('fill', color)
                            .attr('r', 2.5)
                            .attr('cx', (date) => xScale(parseIndiaDate(date)))
                            .attr('cy', (date) =>
                                yScale(getStatistic(timeseries[date], 'delta', statistic))
                            )
                            .style('opacity', 0)
                            .call((enter) =>
                                enter
                                    .transition()
                                    .delay(2100)
                                    .duration(500)
                                    .style('opacity', 1)
                                    .attr('cx', (date) => xScale(parseIndiaDate(date)))
                                    .attr('cy', (date) =>
                                        yScale(getStatistic(timeseries[date], 'delta', statistic))
                                    )
                            ),
                    (update) =>
                        update
                            .transition()
                            .duration(500)
                            .attr('cx', (date) => xScale(parseIndiaDate(date)))
                            .attr('cy', (date) =>
                                yScale(getStatistic(timeseries[date], 'delta', statistic))
                            )
                            .style('opacity', 1)
                            .selection()
                );
        });
    }, [endDate, dates, timeseries, width]);
    var statisticConfig = STATISTIC_CONFIGS["confirmed"];
    return (
        <div className="flex flex-wrap ">
            {PRIMARY_STATISTICS.map((statistic, index) => (

                <div
                    key={statistic}
                    className="flex flex-col w-56 mx-auto ">
                    <LevelItem
                        {...{statistic}}
                        index={index}
                        wrapperRef={wrapperRef}
                        refs={refs}
                        width={width}
                        total={getStatistic(data, 'total', statistic)}
                        delta={getStatistic(data, 'delta', statistic)}
                    />

                </div>

                /*<div
                    key={statistic}
                    className="svg-parent flex-1 place-self-center"
                    ref={index === 0 ? wrapperRef : null}
                >
                    <svg
                        ref={(el) => {
                            refs.current[index] = el;
                        }}
                        preserveAspectRatio="xMidYMid meet"
                        width={width}
                        height={height}
                    />
                </div>*/
            ))}
        </div>
    );
}

const isEqual = (prevProps, currProps) => {
    if (currProps.forceRender) {
        return false;
    } else if (!currProps.timeseries && prevProps.timeseries) {
        return true;
    } else if (currProps.timeseries && !prevProps.timeseries) {
        return false;
    } else if (!equal(currProps.stateCode, prevProps.stateCode)) {
        return false;
    } else if (!equal(currProps.date, prevProps.date)) {
        return false;
    }
    return true;
};

export default memo(Minigraphs, isEqual);