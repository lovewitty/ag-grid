---
title: "Line Series"
---

This section covers the most common series type &mdash; Line series.

Line series can be used in many situations. It's the series of choice when you need to spot a trend, render large amounts of data or create a real-time chart. Line series is also the preferred choice for rendering continuous data with irregular intervals or incomplete data that has some values missing.

## Single Series

Since `'line'` series type is so common, the chart factory (`AgChart.create` method) uses it as the default type, so it doesn't have to be specified explicitly.

The simplest line series config therefore only requires two properties, `xKey` and `yKey`:

```js
series: [{
    // type: 'line' <-- assumed
    xKey: 'year',
    yKey: 'spending'
}]
```

<chart-example title='Single Line Series' name='basic-line' type='generated'></chart-example>

The chart expects the data (`chart.data` property) to be an array of objects, where each object is a table row or a database record and each key is a column. To plot anything on a plane, we need at least two coordinates: `x` and `y`. The `xKey` and `yKey` line series configs tell the series which keys should be used to fetch the values of these coordinates from each object in the `data` array.

## Multiple Series

If we have more than two fields inside each object in the `data` array, we can create a multi-series line chart. For example, if a datum looks like this:

```js
{
    quarter: 'Q1',
    petrol: 200,
    diesel: 100
}
```

We can use the same `quarter` key as `xKey` for both series and `petrol` and `diesel` keys for `yKey` of the first and second line series, respectively.

To create multiple line series we need to provide two config objects in the `series` array:

```js
series: [
    {
        xKey: 'quarter',
        yKey: 'petrol'
    },
    {
        xKey: 'quarter',
        yKey: 'diesel'
    }
]
```

And we get a result like this:

<chart-example title='Multiple Line Series' name='multi-line' type='generated'></chart-example>

## Legend and Tooltip Information

By default the legend shows the keys used to fetch the series data, but those may not be very presentable. In our case, the `petrol` and `diesel` keys inside the data objects are not capitalised. We can provide a better display name using the `yName` config, and the legend will show that instead.

```js
series: [
    {
        xKey: 'quarter',
        yKey: 'petrol',
        yName: 'Petrol'
    },
    {
        xKey: 'quarter',
        yKey: 'diesel',
        yName: 'Diesel'
    }
]
```

<chart-example title='Legend and Tooltip Information' name='legend-info' type='generated'></chart-example>

The provided `yName` will also show up in tooltip titles:

![Left: tooltip with no title, Right: tooltip with title](resources/tooltip-titles.png)

## Line and Marker Colours

The chart above is not complicated, but it could still benefit from more visual separation. Currently both series use the same colours. Let's change that by making diesel look more like diesel. If we just add the following two configs to the second series:

```js
stroke: 'black',
marker: {
    fill: 'gray',
    stroke: 'black'
}
```

We'll get a result like this:

<chart-example title='Line and Marker Colours' name='line-marker-colors' type='generated'></chart-example>

There are many other customisations you can make to the markers; see the [markers section](/charts-markers/) for more information.

## Missing Data

In a perfect world all data would be 100% complete. Unfortunately, in the real one, data for certain items or time periods might be missing or corrupted. But that shouldn't result in corrupted charts, and AG Charts supports the correct rendering of incomplete data:

<chart-example title='Line Series with Incomplete Data' name='gap-line' type='generated'></chart-example>

If the `yKey` value of a data point is positive or negative `Infinity`, `null`, `undefined` or `NaN`, that data point will be rendered as a gap. The same is true for the `xKey`, if the bottom axis is also continuous (for example, if it's a `'number'` axis too).

## Continuous Data

By default, the bottom axis is a `'category'` axis, but this can be changed if you have continuous data that you would like to plot. See the [axes section](/charts-axes/) for more information on configuring axes.

<chart-example title='Continuous Data: Spiral Curve' name='two-number-axes' type='generated' options='{ "exampleHeight": 600 }'></chart-example>

## Time-Series Data

The following example shows how line series can be used to render time-series data, using a `'time'` axis. In this case, we have two ambient temperature sensors that give us two independent data sets, with different numbers of readings taken at different times:

<chart-example title='Time Data: Temperature Sensors' name='time-line' type='generated'></chart-example>

Because we have two separate data sets, we are using the `series.data` property of each series, rather than the `data` property of the chart itself:

```js
series: [
    {
        data: [
            {
                time: new Date('01 Jan 2020 13:25:30 GMT'),
                sensor: 25
            },
            {
                time: new Date('01 Jan 2020 13:26:30 GMT'),
                sensor: 24
            }
        ],
        ...
    },
    {
        data: [
            {
                time: Date.parse('01 Jan 2020 13:25:00 GMT'),
                sensor: 21
            },
            {
                time: Date.parse('01 Jan 2020 13:26:00 GMT'),
                sensor: 22
            }
        ],
        ...
    }
]
```

Notice that even though one data set has dates as `Date` objects and another uses timestamps, it doesn't present a problem and both series render just fine.

The time axis automatically selects an appropriate label format depending on the time span of the data, making a best-effort attempt to prevent the labels from overlapping.

## Real-Time Data

The chart will update whenever new data is supplied via the chart's or series' `data` property.

<chart-example title='Real-Time Chart: Core Voltage' name='real-time' type='generated'></chart-example>

This example uses the `'time'` axis which is configured to show a tick every 5 seconds and to use the `%H:%M:%S` label format to show colon separated hours, minutes and seconds.

## API Reference

<api-documentation source='charts-api/api.json' section='line' options='{ "showSnippets": true }'></api-documentation>

## Next Up

Continue to the next section to learn about [bar and column series](/charts-bar-series/).
