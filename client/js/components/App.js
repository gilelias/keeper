/**
 * Created by gil on 12/20/16.
 */
import React from 'react';
import { connect } from 'react-redux';

import { getRequests } from 'actions/requests';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Route, Switch} from 'react-router-dom';
import Requests from 'containers/Requests';
import Challenges from 'containers/Challenges';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import FlatButton from 'material-ui/FlatButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router-dom'

require('./app.less');

class App extends React.Component {
    constructor(...props) {
        super(...props);
        this.state = {open: false};
    }

    componentWillMount(){
        // this.props.getRequests();
    }
    handleToggle = () => this.setState({open: !this.state.open});

    render() {
        const { requests } = this.props;
        return (            
            <MuiThemeProvider>
                <div>
                    <AppBar
                        title="Keeper"
                        iconElementLeft={<IconButton onClick={this.handleToggle}><NavigationMenu /></IconButton>}
                    />
                    <Drawer docked={false} open={this.state.open} onRequestChange={(open) => this.setState({open})}>
                        <Link to="/"><MenuItem>Requests</MenuItem></Link>
                        <Link to="/view/challenges"><MenuItem>Challenges</MenuItem></Link>
                    </Drawer>
                    <div className="page-content">
                        <Route exact path="/" component={Requests}/>
                        <Route path="/view/challenges/" component={Challenges} />
                    </div>
                </div>
            </MuiThemeProvider>
            );
    }
}

function mapStateToProps(state) {
    return state;
}


export default connect(mapStateToProps, {  getRequests })(App);
