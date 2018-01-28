/**
 * Created by gil on 12/20/16.
 */

process.env.BROWSER == 'true' && require('./requests.less');

import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getRequests, deleteRequests } from 'actions/requests';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import JSONTree from 'react-json-tree'
import {Tabs, Tab} from 'material-ui/Tabs';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';


class Requests extends React.Component {
    constructor(...props) {
        super(...props);
        this.state = {
            selected: []
        };
        this.onDelete = this.onDelete.bind(this);
        this.deleteRequest = this.deleteRequest.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.selected = [];
    }

    componentWillMount(){
        this.props.getRequests();
    }


    onSelect(id){
        return function(){
            let selected = this.state.selected;
            let index = selected.indexOf(id);
            if(index > -1){
                selected.splice(index, 1);
            }else{
                selected.push(id);
            }

            this.setState({
                selected
            });
        }.bind(this);
    }

    onDelete(){
        this.props.deleteRequests(this.state.selected);
    }

    deleteRequest(rId){
        return function(){
            this.props.deleteRequests([rId]);
        }.bind(this)
    }

    selectAll(){
        this.setState({
            selected: _.map(this.props.requests, '_id')
        });
    }

    render() {
        if(this.props.requests && this.props.requests.length){
            return (
            <div>
                <RaisedButton
                    label="Select All"
                    secondary={true}
                    disabled={false}
                    onClick={this.selectAll} 
                />

                { _.map(this.props.requests, request=>(
                <div key={_.get(request, '_id')}>
                    <Checkbox 
                        style={{ display: 'inline-block', width: 'auto', float: 'left', position: 'relative', top: 20 }}
                        checked={this.state.selected.indexOf(request._id) > -1}
                        onCheck={this.onSelect(request._id)}
                    />
                    <Card style={{margin: 10, marginLeft: 30}}>
                        <CardHeader
                        title={`${_.get(request, 'blocked') ? "blocked" : ""} ${_.get(request, 'requesterIp')} - ${_.get(request, 'request.uri')}`}
                        subtitle={`${(new Date(_.get(request, 'timestamp'))).toLocaleString()}`}
                        actAsExpander={true}
                        showExpandableButton={true}
                        />
                        <CardText expandable={true}>
                            <Tabs>
                                <Tab label="Request" >
                                <div>
                                    <JSONTree data={_.get(request, 'request')} />
                                </div>
                                </Tab>
                                <Tab label="Response" >
                                <div>
                                    <JSONTree data={_.get(request, 'response')} />
                                </div>
                                </Tab>
                            </Tabs>
                            <RaisedButton label="Delete" onClick={this.deleteRequest(request._id)}/>
                        </CardText>
                    </Card>
                </div>
                ))
            }

                <RaisedButton
                    label="Delete Selected"
                    secondary={true}
                    disabled={false}
                    onClick={this.onDelete} 
                />
            </div>
            )
        }else{
            return <div>Nothing to show..</div>
        }
    }
}

function mapStateToProps({ requests }) {
    return { requests };
}


export default connect(mapStateToProps, {  getRequests, deleteRequests })(Requests);
