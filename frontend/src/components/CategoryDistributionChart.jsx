import { Chart } from "@highcharts/react";
import { PieSeries } from "@highcharts/react/series/Pie";
import EmptyState from "./EmptyState";

function CategoryDistributionChart({ distribution }) {

    const total = (distribution?.HNI || 0) + (distribution?.UHNI || 0);

    if(total === 0){
        return (
            <div className="h-[280px]">
                <EmptyState
                    title="No client data yet"
                    message="Add clients to see the HNI and UHNI distribution."
                />
            </div>
        )
    }
    const data = [
        {
            name: "HNI",
            y: distribution?.HNI || 0
        },
        {
            name: "UHNI",
            y: distribution?.UHNI || 0
        }
    ];

    return (
        <div className="flex h-[280px] w-full items-center justify-center">
            <Chart
                options={{
                    chart: {
                        type: "pie",
                        backgroundColor: "transparent",
                        height: 280,
                        spacing: [10, 10, 10, 10]
                    },

                    title: {
                        text: undefined
                    },

                    credits: {
                        enabled: false
                    },

                    tooltip: {
                        pointFormat: "<b>{point.y}</b> clients ({point.percentage:.1f}%)"
                    },

                    legend: {
                        enabled: true,
                        align: "right",
                        verticalAlign: "middle",
                        layout: "vertical"
                    },

                    plotOptions: {
                        pie: {
                            innerSize: "65%",
                            borderWidth: 0,
                            dataLabels: {
                                enabled: true,
                                format: "{point.name}: {point.percentage:.1f}%"
                            }
                        }
                    }
                }}
            >
                <PieSeries
                    name="Clients"
                    data={data}
                    colorByPoint={true}
                    colors={[
                        "#2563EB",
                        "#93C5FD"
                    ]}
                />
            </Chart>
        </div>
    );
}

export default CategoryDistributionChart;