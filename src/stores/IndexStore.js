import {observable, asStructure} from 'mobx';
import moment from 'moment';
import api from '../api';

class IndexStore {
    dateFormat = 'YYYY-MM-DD HH:mm';
    router = null;
    filterFormat = {
        type: '',
        start: '',
        end: ''
    }

    @observable list = [];
    @observable loading = true;
    @observable error = false;
    @observable pagination = asStructure({
        currPage: 1,
        totalPages: 0,
        limit: 5
    });
    @observable filter = asStructure(this.filterFormat);
    @observable filterProperties = asStructure({
        types: [],
        max_date: '',
        min_date: ''
    });

    init(router) {
        this.router = router;
        this.getFilterProperties().then((response) => {
            if (response.status == 200) {
                let filterProperties = response.data.payload;
                filterProperties.min_date = moment(filterProperties.min_date, this.dateFormat).subtract(1, "days");
                filterProperties.max_date = moment(filterProperties.max_date, this.dateFormat);
                this.filterProperties = filterProperties;
            } else {
                this.error = response.error.message;
            }
            this.loading = false;
        });
    }

    onPageSelect = page => {
        if (page < 1 || page > this.pagination.totalPages) return false;
        this.pagination.currPage = page;
        this.router.push({path: "/", query: this.filterQuery({...this.filter, page})});
        window.scrollTo(0, 0);
    }

    onServerRequestError = error => {
        this.loading = false;
        this.error = error;
    }

    filterQuery(query){
        return Object.assign(
            ...Object.keys(query).map(
                key => (query[key]) && {[key]: query[key]}
            )
        );
    }

    setFilter(key, value) {
        this.router.push({path: "/", query: this.filterQuery({...this.filter, [key]: value})});
    }

    checkDate = current => {
        return !(current < this.filterProperties.min_date || current > this.filterProperties.max_date);
    }

    onDateChange(key, value) {
        if (value._isAMomentObject || value === "") {
            if (value._isAMomentObject)
                value = value.format(this.dateFormat);

            this.setFilter(key, value);
        }
    }

    getFilterProperties() {
        return api('properties', null, this.onServerRequestError).get();
    }

    updateDataFromHash(query, prevFilter){
        query = {...this.filterFormat, ...query};

        const isEquivalent = (a, b) => {
            a.$mobx = null;
            b.$mobx = null;
            let props = Object.getOwnPropertyNames(a);
            for(let i = 0; i < props.length; i++){
                let propName = props[i];
                if (a[propName] !== b[propName]) {
                    return false;
                }
            }
            return true;
        }

        if(!isEquivalent(query, {...prevFilter, page: this.pagination.currPage})){
            if(query.page){
                this.pagination.currPage = query.page;
                delete query.page;
            }
            this.filter = query;
            this.updateData();
        }
    }

    updateData() {
        this.loading = true;
        api
        (
            'log',
            {
                f: this.filter,
                limit: this.pagination.limit,
                offset: (this.pagination.currPage - 1) * this.pagination.limit
            },
            this.onServerRequestError
        )
            .get()
            .then((response) => {
                if (response.status == 200) {
                    this.list = response.data.payload.collection;
                    this.pagination = {
                        ...this.pagination,
                        ...response.data.payload.pagination
                    };
                    this.error = null;
                } else {
                    this.error = response.error.message;
                }
                this.loading = false;
            });
    }
}

export default IndexStore;
