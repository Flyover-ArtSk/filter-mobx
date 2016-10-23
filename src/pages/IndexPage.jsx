import React, { Component } from 'react';
import { observer } from 'mobx-react';
import Loader from '../components/Loader'
import Pagination from '../components/Pagination'
import Datetime from 'react-datetime';

import 'react-datetime/css/react-datetime.css'

@observer(["IndexStore"])
class IndexPage extends Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    componentDidUpdate(prevProps) {
        if(this.props.location.query) {
            this.props.IndexStore.updateDataFromHash({...this.props.location.query}, {...prevProps.IndexStore.filter});
        }
    }

    componentDidMount() {
        if(this.props.location.query) this.props.IndexStore.filter = this.props.location.query;
        this.props.IndexStore.init(this.context.router);
    }

    render() {
        const store = this.props.IndexStore;
        let list = null;
        if (store.list.length) {
            list = store.list.map((item) => {
                return (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.type}</td>
                        <td>{item.createdAt}</td>
                        <td>{item.data}</td>
                        <td className="text-center">{(item.deleted) ? <span className="glyphicon glyphicon-ok"/> : <span className="glyphicon glyphicon-remove"/>}</td>
                        <td>{item.code}</td>
                        <td>{item.ip}</td>
                        <td>{item.email}</td>
                    </tr>
                )
            });
        } else {
            list = (
                <tr>
                    <td colSpan="8" className="text-center">No data</td>
                </tr>
            )
        }
        
        return (
            <div className="container">
                {(store.error) ? <div className="alert alert-danger">{store.error}</div> : null}
                <h2>API filter test</h2>
                <form className="row">
                    <div className="col-md-4 form-group">
                        <label htmlFor="">Type:</label>
                        <select
                            className="form-control"
                            value={store.filter.type}
                            onChange={(e) => store.setFilter('type', e.target.value)}>
                            <option value="">all</option>
                            {store.filterProperties.types.map((item, index) => {
                                return <option key={index}>{item}</option>
                            })}
                        </select>
                    </div>
                    <div className="col-md-4 form-group">
                        <label htmlFor="">From:</label>
                        <Datetime dateFormat="YYYY-MM-DD"
                                  timeFormat="HH:mm"
                                  closeOnSelect
                                  value={store.filter.start}
                                  onChange={(value) => store.onDateChange('start', value)}
                                  isValidDate={store.checkDate}/>
                    </div>
                    <div className="col-md-4 form-group">
                        <label htmlFor="">To:</label>
                        <Datetime dateFormat="YYYY-MM-DD"
                                  timeFormat="HH:mm"
                                  closeOnSelect
                                  value={store.filter.end}
                                  onChange={(value) => store.onDateChange('end', value)}
                                  isValidDate={store.checkDate}/>
                    </div>
                </form>
                <div className="table-wrapper">
                    {store.loading
                        ? <div className="loading-info"><Loader /></div>
                        : null
                    }
                    <table className="table table-striped table-bordered">
                        <thead>
                        <tr>
                            <td>ID</td>
                            <td>Type</td>
                            <td>Date</td>
                            <td>Data</td>
                            <td>Deleted</td>
                            <td>Code</td>
                            <td>IP</td>
                            <td>Email</td>
                        </tr>
                        </thead>
                        <tbody>
                        {list}
                        </tbody>
                    </table>
                </div>
                {(store.list.length && store.pagination.totalPages > 0)
                    ? <Pagination
                    currPage={Number.parseInt(store.pagination.currPage)}
                    totalPages={store.pagination.totalPages}
                    onSelect={store.onPageSelect}/>
                    : null
                }
            </div>
        );
    }

}

export default IndexPage;