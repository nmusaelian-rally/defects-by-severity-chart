  Ext.define('CustomApp', {
     extend: 'Rally.app.App',
     componentCls: 'app',
     launch: function(){
        var filter = Ext.create('Rally.data.QueryFilter', {
                                property: 'Severity',
                                operator: '=',
                                value: 'Crash/Data Loss'
                            });
                            
                            filter = filter.or({
                                property: 'Severity',
                                operator: '=',
                                value: 'Major Problem'  
                            });
                            filter = filter.or({
                                property: 'Severity',
                                operator: '=',
                                value: 'Minor Problem'  
                            });
                            filter = filter.or({
                                property: 'Severity',
                                operator: '=',
                                value: 'Cosmetic'  
                            });
                            filter.toString();
                            
        this._myStore = Ext.create('Rally.data.WsapiDataStore', {
           model: 'Defect',
           fetch: true,
           autoLoad: true,
            filters: [filter],
           listeners: {
                            load: this._onDataLoaded,
                            scope: this
            }
       });
     },
     _onDataLoaded: function(store, data) {
                    var records = [];
                    var severityArr = ["Crash/Data Loss","Major Problem","Minor Problem","Cosmetic"]

                    var crashDataLossCount = 0;
                    var majorProblemCount = 0;
                    var minorProblemCount = 0;
                    var cosmeticCount = 0;
                    
                    var getColor = {
                        'Crash/Data Loss': '#FF3300',
                        'Major Problem': '#FF6600', 
                        'Minor Problem': '#FF9900', 
                        'Cosmetic': '#FFCC00', 
                    };

                    Ext.Array.each(data, function(record) {

                        var severity = record.get('Severity');
                        console.log('severity',severity);

                        switch(severity)
                        {
                            case "Crash/Data Loss":
                                crashDataLossCount++;
                                break;
                            case "Major Problem":
                                majorProblemCount++;
                                break;
                            case "Minor Problem":
                                minorProblemCount++;
                                break;
                            case "Cosmetic":
                                cosmeticCount++;
                        }
                    });
                    if (this.down('#myChart')) {
                                this.remove('myChart');
                    }
                    this.add(
                        {
                            xtype: 'rallychart',
                            height: 400,
                            storeType: 'Rally.data.WsapiDataStore',
                            store: this._myStore,
                            itemId: 'myChart',
                            chartConfig: {
                               chart: { 
                                    type: 'column'
                                },
                                title: {
                                    text: 'Defect by Severity Counts',
                                    align: 'center'
                                },
                                tooltip: {},
                                yAxis: {
                                    title: {
                                        text: 'Count'
                                    }
                                },
                                plotOptions : {
                                    column: {
                                        color: '#F00',
                                        dataLabels: { //prints data on above columns
                                            enabled: true
                                        }
                                    },
                                    series : {
                                        animation : {
                                            duration : 2000,
                                            easing : 'swing'
                                        }
                                    }
                                },
                            },                
                            chartData: {
                                categories: ["Crash/DataLoss","Major Problem","Minor Problem","Cosmetic"],
                                series: [ 
                                    {   
                                        type: 'column',  
                                        name: 'Severities',
                                        data: [
                                            {name: 'Crash/Data Loss',
                                            y: crashDataLossCount,
                                            color: getColor['Crash/Data Loss']
                                            },
                                            {name: 'Major Problem',
                                            y: majorProblemCount,
                                            color: getColor['Major Problem']
                                            },
                                            {name: 'Minor Problem',
                                             y: minorProblemCount,
                                            color: getColor['Minor Problem']
                                            },
                                            {name: 'Cosmetic',
                                             y: cosmeticCount,
                                            color: getColor['Cosmetic']
                                            }
                                              ]
                                    }
                                ]
                            }
                        }
                    );
                    this.down('#myChart')._unmask();
                }
     
 });
