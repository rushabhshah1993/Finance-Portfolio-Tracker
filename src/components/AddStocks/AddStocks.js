import React, { Component } from 'react';
import './AddStocks.css';

import AddStockButtons from './AddStockButtons/AddStockButtons';

class AddStocks extends Component {
    newAllStocksHandler = (newStocks) => {
        this.setState({
            allStocks: newStocks
        })
    }

    render() {
        return (
            <div className='AddStocks'>
                <div className='AddStocksTitle'>Add stocks to my stocks</div>
                {
                    this.props.error &&
                    <p>{this.props.error}</p>
                }
                {
                    this.props.allStocks && this.props.allStocks.length > 0 &&
                    <AddStockButtons 
                        addStock = {(stock) => this.props.addStock(stock)}
                        allStocks={this.props.allStocks} 
                        newAllStocks={(newAllStocks) => { console.log(newAllStocks); this.newAllStocksHandler(newAllStocks)}} 
                        newMyStocks={this.props.newMyStocks} />
                }
            </div>
        )
    }
}

export default AddStocks;