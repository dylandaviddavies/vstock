export default {
    ONE_DAY: {
        gridLines: {
            display: false,
            drawBorder: false
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
            display: false,
            autoSkip: true,
            maxTicksLimit: 4
        }
    },

    FIVE_DAYS: {
        gridLines: {
            display: false,
            drawBorder: false
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
            display: false,
            autoSkip: false,
            maxTicksLimit: 0
        }
    }
}