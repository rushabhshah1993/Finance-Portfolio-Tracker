import React, { Component } from 'react';
import './AddStockButtons.css';

import AddStockButton from './AddStockButton/AddStockButton';

class AddStockButtons extends Component {
    state = {
        allStocksData: {}
    }

    componentDidMount() {
        // this.props.allStocks.map(stock => {
        //     let url = 'https://www.quandl.com/api/v3/datasets/EOD/'+stock+'.json?start_date=26/10/2017&end_date=26/10/2017&api_key=D6Drb3u1eMYHXjzZAepL';
        //     // let url = 'https://www.quandl.com/api/v3/datasets/WIKI/'+stock+'/data.json?start_date=26/10/2017&end_date=26/10/2017&api_key=D6Drb3u1eMYHXjzZAepL'
        //     Axios.get(url)
        //         .then(response => {
        //             let allStocksData = this.state.allStocksData;
        //             let name = response.data.dataset.name;
        //             allStocksData[stock] = {
        //                 ticker: stock,
        //                 name: name.slice(0, name.indexOf('Stock Prices'))
        //             }
        //             this.setState({
        //                 allStocksData: allStocksData
        //             })
        //         }).catch(error => {console.log(error)})
        //     return true;
        // })
    }
    
    addStockHandler = (event) => {
        console.log(event);
        console.log(new Date(Date.now()));
        // let currentStocks = [];
        // Axios.get('https://finance-portfolio-tracker.firebaseio.com/myStocks.json')
        //     .then(response => {
        //         currentStocks = response.data;
        //         currentStocks.push(event);
        //         this.props.newMyStocks(currentStocks);
                
        //         return Axios.put('https://finance-portfolio-tracker.firebaseio.com/myStocks.json', currentStocks)})
        //     .then(response => {
        //                 console.log('Put call', response);
        //                 console.log(this.props.allStocks);
        //                 let newAllStocks = [...this.props.allStocks];
        //                 newAllStocks.splice(newAllStocks.indexOf(event), 1);
        //                 console.log('Axios call', newAllStocks);
        //                 this.props.newAllStocks(newAllStocks);

        //                 return Axios.put('https://finance-portfolio-tracker.firebaseio.com/allStocks.json', newAllStocks)})
        //     .then(response => {console.log(response)});
        //     //         });
        //     // })
        //     // .catch(error => {})

    }

    render() {
        // console.log(this.props);
        // let buttons = Object.keys(this.state.allStocksData).map(stock => {
        //     return <AddStockButton ticker={stock} name={this.state.allStocksData[stock].name} key={stock} clicked={(ticker) => this.addStockHandler(ticker)} />
        // })
        let buttons = this.props.allStocks.map(stock => {
            // console.log(stock);
            // return <AddStockButton ticker={stock.symbol} name={stock.name} key={stock.symbol} clicked={(ticker) => this.addStockHandler(ticker)} />
            return <AddStockButton key={stock.symbol} stock={stock} clicked={(stock) => this.props.addStock(stock)} />
        })

        return (
            <div className='AddStockButtons'>
                {buttons}
            </div>
        )
    }
}

export default AddStockButtons;
