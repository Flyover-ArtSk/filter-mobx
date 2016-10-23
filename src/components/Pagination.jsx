import React, {Component} from 'react';
import Paginator from 'react-pagify';
import segmentize from 'segmentize';

export default (props) => {
    return (
        <div className="text-center">
            <Paginator.Context
                className="pagination text-center"
                tags={{
                    container: {tag: 'ul'},
                    segment: {tag: 'li'},
                    ellipsis: {
                        tag: 'li',
                            props: {
                            className: 'disabled',
                                children: <span>...</span>
                        }
                    },
                    link: {
                        tag: 'a'
                    }
                }}
                segments={segmentize({
                    pages: (props.totalPages == 0) ? 1 : props.totalPages,
                    page: props.currPage,
                    beginPages: 1,
                    endPages: 1,
                    sidePages: 3
                })}
                onSelect={props.onSelect}>
                <Paginator.Button
                    page={props.currPage - 1}
                    className={props.currPage - 1 < 1 ? 'disabled' : ''}>
                    Prev
                </Paginator.Button>
                <Paginator.Segment field="beginPages"/>
                <Paginator.Ellipsis previousField="beginPages" nextField="previousPages"/>
                <Paginator.Segment field="previousPages"/>
                <Paginator.Segment field="centerPage" className="active"/>
                <Paginator.Segment field="nextPages"/>
                <Paginator.Ellipsis previousField="nextPages" nextField="endPages"/>
                <Paginator.Segment field="endPages"/>
                <Paginator.Button
                    page={props.currPage + 1}
                    className={props.currPage + 1 > props.totalPages ? 'disabled' : ''}>
                    Next
                </Paginator.Button>
            </Paginator.Context>
        </div>
    )
}