import React, { Component } from 'react';
import './MyStocks.css';
import Axios from 'axios';
import { isEqual } from 'lodash';

class MyStocks extends Component {
    state = {
        myStocks: {},
        isError: false
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return isEqual(nextState, this.state)
    }

    createRows = () => {
        let rows = {};
        Object.keys(this.props.myStocks).map(row => {
            let dataRow = this.props.myStocks[row];
            rows[dataRow.symbol] = {...dataRow};
            Axios.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+dataRow.symbol+'&outputsize=compact&apikey=6X6YP8313WMG8Y86')
                .then(response => {
                    let serverData = response.data["Time Series (Daily)"];
                    let today = new Date();
                    let dayCounter = 0;
                    if(today.getDay() === 0) { dayCounter = 2; }
                    if(today.getDay() === 6) { dayCounter = 1; }
                    let year = today.getFullYear();
                    let month = parseInt(today.getMonth())+ 1;
                    let date = parseInt(today.getDate()-dayCounter)<10 ? '0'+parseInt(today.getDate()-dayCounter) : parseInt(today.getDate()-dayCounter);
                    let finalDate = year+'-'+month+'-'+date;
                    if(serverData[finalDate.toString()] === undefined){
                        finalDate = year+'-'+month+'-'+(date-1);
                    }
                    console.log(finalDate);
                    let todayStocks = serverData[finalDate.toString()];
                    let currentClosingPrice = todayStocks["4. close"];
                    let calculateProfit = parseInt([currentClosingPrice - dataRow.closingPrice] * dataRow.numberOfShares);
                    rows[dataRow.symbol].currentClosingPrice = currentClosingPrice;
                    rows[dataRow.symbol].calculateProfit = calculateProfit;
                    this.setState({myStocks: rows})
                })
                .catch(error => {
                    console.log(error);
                    this.setState({
                        isError: true
                    })
                });
            return true;
        })
    }

    render() {
        if(Object.keys(this.props.myStocks).length > 0 && Object.keys(this.props.myStocks).length !== Object.keys(this.state.myStocks).length && this.state.isError === false) {
            this.createRows();
        }
        let rows = Object.keys(this.state.myStocks).map(stock => {
            let stockData = this.state.myStocks[stock];
            let stockRow = (
                <tr key={stockData.symbol}>
                    <td>{stockData.symbol}</td>
                    <td>{stockData.name}</td>
                    <td>{stockData.numberOfShares}</td>
                    <td>{stockData.closingPrice}</td>
                    <td>{stockData.currentClosingPrice}</td>
                    <td>{stockData.calculateProfit}</td>
                    <td><button className='StopTrackingBtn' onClick={() => this.props.stopTracking(stockData.symbol)}>Stop Tracking</button></td>
                </tr>
            )
            return stockRow;
        })
        return (
            <div className='MyStocks'>
                <div className='Header'>
                    <span className='MyStocksTitle'>My Stocks</span>
                    {/* <input type='text' className='SearchBar' placeholder='Search...' /> */}
                </div>
                <div className='Body'>
                    {
                        this.state.isError ?
                        <p>There seems to be a server issue, please try again later.</p> :
                        <table id='MyStocksTable' className='MyStocksTable'>
                            <thead>
                                <tr>
                                    <th>Stock symbol</th>
                                    <th>Stock name</th>
                                    <th>No.of shares</th>
                                    <th>Buy price</th>
                                    <th>Current price</th>
                                    <th>Profit/Loss</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows}
                            </tbody>
                        </table>
                    }
                </div>
            </div>
        )
    }
}

export default MyStocks;