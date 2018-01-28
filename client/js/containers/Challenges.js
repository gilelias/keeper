/**
 * Created by gil on 12/20/16.
 */

import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getChallenges, deleteChallenges, createChallenge } from 'actions/challenges';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


class Challenges extends React.Component {
    constructor(...props) {
        super(...props);
        this.state = {
            field: '',
            test: ''
        };

        this.selected = [];

        this.handleFormChange = this.handleFormChange.bind(this);
        this.createChallenge = this.createChallenge.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onRowSelection = this.onRowSelection.bind(this);
    }

    componentWillMount(){
        this.props.getChallenges();
    }


    createChallenge(){
        let { field, test } = this.state;
        if(field && test){
            this.props.createChallenge({
                field,
                test,
                type: 1
            });
        }
    }

    onRowSelection(rows){
        if(_.isArray(rows)){
            this.selected = rows;
        }else if(rows=='all'){
            let r=[];
            let i = 0;
            _.map(this.props.challenges, re=>r.push(i++));
            this.selected = r;
        }else if (rows=='none'){
            this.selected = [];

        }
    }

    onDelete(){
        let ids = [];
        _.map(this.selected, i=>{
            ids.push(this.props.challenges[i]._id)
        });
        this.props.deleteChallenges(ids);
    }

    handleFormChange(fieldName){
        return function(event){
            this.setState({
                [fieldName]:  event.target.value
            })
        }.bind(this);
    }

    render() {
        if(this.props.challenges){
            return (
                <div>
                    <Table
                        multiSelectable={true}
                        selectable={true}
                        onRowSelection={this.onRowSelection}
                    >
                        <TableHeader>
                            <TableRow>
                                <TableHeaderColumn>field</TableHeaderColumn>
                                <TableHeaderColumn>test</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>

                        <TableBody
                                deselectOnClickaway={false}
                                showRowHover={true}
                            >
                                {
                                    this.props.challenges && _.map(this.props.challenges, c=> {
                                        return (
                                        <TableRow key={_.get(c, '_id')}>
                                            <TableRowColumn>
                                                {_.get(c, 'field')}
                                            </TableRowColumn>
                                            <TableRowColumn>
                                                {_.get(c, 'test')}
                                            </TableRowColumn>
                                        </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                    </Table>

                    <RaisedButton
                        label="Delete Selected"
                        secondary={true}
                        disabled={false}
                        onClick={this.onDelete}
                    />


                    <div>
                    <TextField
                        value={this.state.field}
                        floatingLabelText="field"
                        onChange={this.handleFormChange('field')}
                    />
                    <TextField
                        value={this.state.test}
                        floatingLabelText="test"
                        onChange={this.handleFormChange('test')}
                    />
                    <RaisedButton
                        label="Create Challenge"
                        secondary={true}
                        disabled={false}
                        onClick={this.createChallenge}
                    />
                    </div>


                </div>)
        }else{
            return <div>Nothing to show..</div>
        }
    }
}

function mapStateToProps({ challenges }) {
    return { challenges };
}


export default connect(mapStateToProps, {  getChallenges, createChallenge, deleteChallenges })(Challenges);
