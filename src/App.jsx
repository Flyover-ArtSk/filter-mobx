import React, {Component} from 'react';
import {Provider} from 'mobx-react';
import {Router, Route, useRouterHistory} from 'react-router'
import {createHashHistory} from 'history'
import IndexPage from './pages/IndexPage';
import IndexStore from './stores/IndexStore';

const browserHistory = useRouterHistory(createHashHistory)({queryKey: false});

const store = new IndexStore();

class App extends Component {
    render() {
        return (
            <Provider IndexStore={store}>
                <Router history={browserHistory}>
                    <Route path="/" component={IndexPage}/>
                </Router>
            </Provider>
        );
    }
}

export default App;
