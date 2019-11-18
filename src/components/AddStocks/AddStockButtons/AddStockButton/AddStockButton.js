import React from 'react';
import './AddStockButton.css';

const AddStockButton = (props) => {
    return (
        <div className='AddStockButton'>
            <button className='StockButton' onClick={() => props.clicked(props.stock)}>{props.stock.symbol}</button>
            {props.stock.name}
        </div>
    )
}

export default AddStockButton;