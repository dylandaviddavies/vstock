export default {
    ONE_DAY: {
        gridLines: {
            display: false
        },
        type: "time",
        time: {
            tooltipFormat: "h:mm a",
            unit: "hour",
            unitStepSize: 1,
            displayFormats: {
                day: "MMM d"
            }
        },
        ticks: {
            autoSkip: true,
            maxTicksLimit: 4
        }
    },

    FIVE_DAYS: {
        gridLines: {
            display: false
        },
        type: "time",
        time: {
            tooltipFormat: "ll",
            unit: "day",
            unitStepSize: 1,
            displayFormats: {
                day: "MMM DD"
            }
        },
        ticks: {
            autoSkip: false,
            maxTicksLimit: 0
        }
    },

    ONE_MONTH: {
        gridLines: {
            display: false
        },
        type: "time",
        time: {
            tooltipFormat: "ll",
            unit: "day",
            unitStepSize: 1,
            displayFormats: {
                day: "MMM DD"
            }
        },
        ticks: {
            autoSkip: false,
            maxTicksLimit: 0
        }
    }
}