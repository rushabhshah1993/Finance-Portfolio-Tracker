import React, { Component } from 'react';
import './Main.css';

import Navbar from './../../components/Navbar/Navbar';
import MyStocks from './../../components/MyStocks/MyStocks';
import AddStocks from './../../components/AddStocks/AddStocks';
import HorizontalLine from './../../common/HorizontalLine/HorizontalLine';
import Modal from './../../common/Modal/Modal';

import Axios from 'axios';

class Main extends Component {
    constructor(props) {
        super(props);
        this.NoOfShares = React.createRef();
        this.BuyingPrice = React.createRef();
        this.BuyingDate = React.createRef();
    }

    state = {
        myStocks: {},
        allStocks: {},
        showModal: false,
        selectedStock: {},
        dateError: false,
        dateErrorMsg: null,
        formComplete: false,
        formIncompleteError: false
    }

    componentDidMount() {
        Axios.get('https://finance-portfolio-tracker.firebaseio.com/allStocksValue.json')
            .then(response => {
                let allStocks = response.data;
                Axios.get('https://finance-portfolio-tracker.firebaseio.com/myStocksValue.json')
                .then(response => {
                    this.setState({
                        myStocks: response.data,
                        allStocks: allStocks
                    })
                })
            })
            .catch(error => {console.log(error)});
    }

    addStockHandler = (stock) => {
        let selectedStock = {};
        selectedStock.symbol = stock.symbol;
        selectedStock.name = stock.name;

        this.setState({
            showModal: true,
            selectedStock: selectedStock
        })
    }
    
    modalCloseHandler = () => {this.setState({showModal: false})};

    addStockToDBHandler = () => {
        if(this.BuyingPrice.current.value.length === 0 && this.BuyingDate.current.value.length === 0 && this.NoOfShares.current.value.length === 0) {
            this.setState({
                formComplete: false,
                formIncompleteError: true
            })
        } else {
            let selectedStock = {...this.state.selectedStock};
            selectedStock.closingPrice = this.BuyingPrice.current.value;
            selectedStock.date = this.BuyingDate.current.value;
            selectedStock.numberOfShares = this.NoOfShares.current.value;

            Axios.post('https://finance-portfolio-tracker.firebaseio.com/myStocksValue.json', selectedStock)
            .then(response => {
                let allStocks = {...this.state.allStocks};
                let newAllStocks = [];
                for(let value in allStocks) {
                    if(allStocks[value].symbol !== this.state.selectedStock.symbol) {
                        newAllStocks.push(allStocks[value]);
                    }
                }

                let newMyStocks = {};

                Axios.get('https://finance-portfolio-tracker.firebaseio.com/myStocksValue.json')
                    .then(response => {
                        newMyStocks = response.data;

                        Axios.put('https://finance-portfolio-tracker.firebaseio.com/allStocksValue.json', newAllStocks)
                            .then(response => {
                                this.setState({
                                    selectedStock: {},
                                    showModal: false,
                                    allStocks: newAllStocks,
                                    myStocks: newMyStocks
                                })
                            }).catch(error => {console.log(error)});
                    }).catch(error => {console.log(error)});

            }).catch(error => {console.log(error)});

        }
        
    }

    dateHandler = (event) => {
        if(new Date(event.target.value).getDay() === 0 || new Date(event.target.value).getDay() === 6) {
            this.setState({
                dateError: true,
                dateErrorMsg: 'You cannot select a weekend date'
            })
        } else if(new Date(event.target.value).getTime() >  new Date().getTime()) {
            this.setState({
                dateError: true,
                dateErrorMsg: 'You cannot select a future date'
            })
        } else {
            this.setState({
                dateError: false,
                dateErrorMsg: null
            })
        }
    }

    stopTrackingHandler = (symbol) => {
        let myStocks = this.state.myStocks;
        let newMyStocks = {};
        let newAllStocksValue = {};
        for(let stock in myStocks) {
            if(myStocks[stock].symbol !== symbol) {
                newMyStocks[stock] = (myStocks[stock]);
            } else {
                newAllStocksValue.name = myStocks[stock].name;
                newAllStocksValue.symbol = myStocks[stock].symbol;
            }
        }
        let newAllStocks = this.state.allStocks;
        newAllStocks.push(newAllStocksValue);
        Axios.put('https://finance-portfolio-tracker.firebaseio.com/allStocksValue.json', newAllStocks)
            .then(response => response)
            .catch(error => {console.log(error)})
        Axios.put('https://finance-portfolio-tracker.firebaseio.com/myStocksValue.json', newMyStocks)
            .then(response => response)
            .catch(error => {console.log(error)})
        this.setState({
            allStocks: newAllStocks,
            myStocks: newMyStocks
        })
    }

    render() {
        let today = new Date();
        let modalContent = this.state.showModal ?
            (
                <React.Fragment>
                    {this.state.formIncompleteError ? <p>Kindly complete the form before adding this stock for tracking.</p> : null}
                    <div className='AddStockForm'>
                        <div className='FormRow'><span className='Label'>Company Name:</span><span>{this.state.selectedStock.name}</span></div>
                        <div className='FormRow'><span className='Label'>No. of Shares:</span><input type='number' min="1" placeholder='No. of shares' ref={this.NoOfShares} /></div>
                        <div className='FormRow'><span className='Label'>Buy Price:</span> <input type='number' min="1" placeholder='Buying Price' ref={this.BuyingPrice} /></div>
                        <div className='FormRow'><span className='Label'>Buy Date:</span>{this.state.dateError ? <span>{this.state.dateErrorMsg}</span> : null}<input type='date' onChange={this.dateHandler} ref={this.BuyingDate} /></div>
                    </div>
                    <button className='AddButton' disabled={this.state.formComplete} onClick={this.addStockToDBHandler}>Add</button>
                </React.Fragment>
            )
        : null;

        let weekendWarning = (
            today.getDay() === 0 || today.getDay() === 7 ?
            <p>*Since today is a weekend, the current price refers to the last updated working day price.</p> :
            null 
        )
        return (
            <div>
                { 
                    this.state.showModal ? 
                    <Modal 
                        title={'Add '+this.state.selectedStock.name+' to My Stocks'}
                        content={modalContent}
                        close={this.modalCloseHandler}/> : 
                    null 
                }
                {weekendWarning}
                <Navbar title="Finance Portfolio Tracker" />
                <MyStocks myStocks={this.state.myStocks} stopTracking={this.stopTrackingHandler} />
                <HorizontalLine />
                {
                    Object.keys(this.state.myStocks).length < 6 ?
                    <AddStocks allStocks={this.state.allStocks} addStock={this.addStockHandler} /> :
                    <AddStocks error={'You can add only 5 stocks for tracking!'} />
                }
            </div>
        )
    }
}

export default Main;