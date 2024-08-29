import { initializeApp } from '@angular/fire/app';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { DataService } from 'src/app/shared/services/data.service';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
    private chartPieUrl = 'http://210.86.230.107:8092/pie';
    private chartParabolUrl = 'http://210.86.230.107:8092/parabol';
    private chartColumnUrl = 'http://210.86.230.107:8092/column';
    private colors = [
        '--blue-500',
        '--yellow-500',
        '--green-500',
        '--red-500',
        '--purple-500',
        '--orange-500',
        '--cyan-500',
        '--pink-500',
        '--teal-500',
        '--indigo-500'
    ];

    private hoverColors = [
        '--blue-400',
        '--yellow-400',
        '--green-400',
        '--red-400',
        '--purple-400',
        '--orange-400',
        '--cyan-400',
        '--pink-400',
        '--teal-400',
        '--indigo-400'
    ]

    data: any;

    options: any;

    data2: any;

    options2: any;

    data3: any;

    options3: any;

    plugin1: any;
    plugin2: any;
    plugin3: any;


    constructor(private readonly _data_service: DataService) {
        // this.plugin2 = ChartDataLabels;
        // this.plugin3 = ChartDataLabels;

        // // Chart.register(this.plugin1);
        // // Chart.register(this.plugin2);
        // // Chart.register(this.plugin3);
        // Chart.register(...registerables);
        // Chart.unregister(ChartDataLabels);
    }

    ngOnInit() {
        this.initChart1();
        this.initChart2();
        this.initChart3();
    }

    initChart1() {
        this.plugin1 = [ChartDataLabels];

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        this._data_service.get(this.chartPieUrl).subscribe((res: any) => {
            let labels = res.map((item: any) => item.name);
            let datas = res.map((item: any) => item.total);
            let colors = this.colors.slice(0, res.length).map(item => {
                return documentStyle.getPropertyValue(item);
            });

            let hoverColors = this.hoverColors.slice(0, res.length).map(item => {
                return documentStyle.getPropertyValue(item);
            });
            this.data = {
                labels: labels,
                datasets: [
                    {
                        data: datas,
                        backgroundColor: colors,
                        hoverBackgroundColor: hoverColors
                    }
                ]
            };
        }, error => {
            console.error(error);
        });


        this.options = {
            plugins: {
                datalabels: {
                    display: true,
                    align: 'end',
                    color: 'white',
                    formatter: (value: any) => {
                        return value;
                    }
                },
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: 'black',
                    }
                },
                title: {
                    display: true,
                    position: 'bottom',
                    text: 'Biểu đồ dự án',
                    font: {
                        size: 24
                    },
                    padding: {
                        top: 35,
                       
                    }
                },
            }
        };


    }

    initChart2() {


        const documentStyle2 = getComputedStyle(document.documentElement);
        const textColor2 = documentStyle2.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle2.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle2.getPropertyValue('--surface-border');
        this._data_service.get(this.chartParabolUrl).subscribe((res: any) => {
            let dataset = res.map((item: any, index: number) => {
                let values: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                Object.entries(item.value).forEach(([month, value]) => {
                    values[parseInt(month) - 1] = value;

                });
                let data = {

                    label: item.project_name,
                    data: values,
                    fill: false,
                    borderColor: documentStyle2.getPropertyValue(this.colors[index]),
                    backgroundColor: documentStyle2.getPropertyValue(this.colors[index]),
                    tension: 0.4
                }
                return data;
            });

            this.data2 = {
                labels: [
                    'Tháng 1',
                    'Tháng 2',
                    'Tháng 3',
                    'Tháng 4',
                    'Tháng 5',
                    'Tháng 6',
                    'Tháng 7',
                    'Tháng 8',
                    'Tháng 9',
                    'Tháng 10',
                    'Tháng 11',
                    'Tháng 12'
                ],
                datasets: dataset
            };
        }, error => {
            console.error(error);
        });

        this.plugin2 = [ChartDataLabels]

        this.options2 = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                datalabels: {
                    display: true,
                    anchor: 'auto',
                    align: 'auto',
                    color: 'white',
                    backgroundColor: (context: any) => {
                        // Retrieve the dataset's borderColor or backgroundColor
                        const dataset = context.dataset;
                        return dataset.borderColor || dataset.backgroundColor;
                    },
                    formatter: (value: any) => {
                        if (value < 1) {
                            return null;
                        }
                        return value;
                    }

                },
                legend: {
                    labels: {
                        color: textColor2
                    }
                },
                title: {
                    display: true,
                    position: 'bottom',
                    text: 'Biểu đồ triển khai',
                    font: {
                        size: 24
                    }
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    initChart3() {

        const documentStyle3 = getComputedStyle(document.documentElement);
        const textColor = documentStyle3.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle3.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle3.getPropertyValue('--surface-border');
        this._data_service.get(this.chartColumnUrl).subscribe((res: any) => {

            let dataset = res.map((item: any, index: number) => {
                let values: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                Object.entries(item.value).forEach(([month, value]) => {
                    values[parseInt(month) - 1] = value;

                });
                let data = {

                    label: item.project_name,
                    backgroundColor: documentStyle3.getPropertyValue(this.colors[index]),
                    borderColor: documentStyle3.getPropertyValue(this.colors[index]),
                    data: values
                }
                return data;
            });

            this.data3 = {
                labels: [
                    'Tháng 1',
                    'Tháng 2',
                    'Tháng 3',
                    'Tháng 4',
                    'Tháng 5',
                    'Tháng 6',
                    'Tháng 7',
                    'Tháng 8',
                    'Tháng 9',
                    'Tháng 10',
                    'Tháng 11',
                    'Tháng 12'
                ],
                datasets: dataset
            };

        }, error => {
            console.error(error);
        });


        this.plugin3 = [ChartDataLabels]

        this.options3 = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                datalabels: {
                    display: true,
                    anchor: 'end',
                    align: 'top',
                    color: 'black',
                    formatter: (value: any) => {
                        if (value < 1) {
                            return '';
                        }
                        return value;
                    }
                },
                legend: {
                    labels: {
                        color: textColor
                    }
                },
                title: {
                    display: true,
                    position: 'bottom',
                    text: 'Biểu đồ hợp đồng',
                    font: {
                        size: 24
                    }
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }

            }
        };
    }
}
