import React, {Component} from 'react';
import Box from '@material-ui/core/Box';

import LineChart from './LineChart'

import SocialHealth from './Summary/SocialHealth';

export default class Summary extends Component {
	render() {
		return (
            <>
                <Box m={1}>
                    <SocialHealth reports = {this.props.reports} collection = {this.props.collection}/>
                </Box>
            </>
			)
	}
}